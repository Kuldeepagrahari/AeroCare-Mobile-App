
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { View, Text, StyleSheet, ScrollView, Animated, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useTheme } from "@/components/ThemeProvider"
import MapViewAlternative from "@/components/MapViewAlternate"
import { Ionicons } from "@expo/vector-icons"
import { useJourney } from "@/context/journeyContext"
interface TelemetryData {
  range: string
  battery: number
  temperature: number
  altitude: number
  horizontalSpeed: number
  verticalSpeed: number
  status: "Preparing" | "In Transit" | "Delivered"
}

export default function TrackingScreen() {
  const { isJourneyStarted } = useJourney()
  
  if (!isJourneyStarted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "black", fontWeight: "800", fontSize: 40, textAlign: "center" }}>
          Journey not started yet
        </Text>
        <Text style={{ color: "black" }}>Please start a journey</Text>
      </View>
    );
  }
  const { isDark } = useTheme()
  const backgroundColor = isDark ? "#121212" : "#fff"
  const textColor = isDark ? "#fff" : "#333"
  const secondaryTextColor = isDark ? "#aaa" : "#666"
  const cardBackgroundColor = isDark ? "#2a2a2a" : "#f5f5f5"
  const accentColor = "#30D5C8"

  
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    range: "0",
    battery: 91,
    temperature: 8,
    altitude: 50,
    horizontalSpeed: 0.0,
    verticalSpeed: 0.0,
    status: "In Transit",
  })

  const [position, setPosition] = useState({
    latitude: 25.4358,
    longitude: 81.8463,
  })

  const [destination, setDestination] = useState({
    latitude: 25.4358,
    longitude: 81.9463,
  })

  const [path, setPath] = useState<Array<{ latitude: number; longitude: number }>>([])
  const droneMarkerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(droneMarkerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(droneMarkerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start()
  
    return () => animation.stop(); // cleanup to avoid multiple loops
  }, [])

  
    const centerRef = useRef({
      latitude: position.latitude,
      longitude: position.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    
    useEffect(() => {
      const interval = setInterval(() => {
        fetchTelemetry();
      }, 2000);
    
      return () => clearInterval(interval);
    }, []);
    const fetchTelemetry = async () => {
      try {
        const response = await fetch("https://vtol-server.onrender.com/api/telemetry")
        if (response.ok) {
          const data = await response.json()
          const configurations = data.configurations
          const latestTelemetry = data.latestTelemetry

          if (configurations && latestTelemetry) {
            const { horizontalSpeed, verticalSpeed, battery, currLatti, currLongi, currAltitude } = latestTelemetry
            const { sourceLatti, sourceLongi, destiLatti, destiLongi, temperature } = configurations

            // setTelemetry({
            //   range: calculateDistance(currLatti || sourceLatti, currLongi || sourceLongi, destiLatti, destiLongi),
            //   battery,
            //   temperature,
            //   altitude: currAltitude,
            //   horizontalSpeed,
            //   verticalSpeed,
            //   status: "In Transit",
            // })
            setTelemetry(prev => {
              const newTelemetry = {
                range: calculateDistance(currLatti || sourceLatti, currLongi || sourceLongi, destiLatti, destiLongi),
                battery,
                temperature,
                altitude: currAltitude,
                horizontalSpeed,
                verticalSpeed,
                status: "In Transit",
              };
            
              if (JSON.stringify(prev) !== JSON.stringify(newTelemetry)) {
                return newTelemetry;
              }
              return prev;
            });
            
            setPath([{
              latitude: currLatti,
              longitude: currLongi,
            }])
            if (currLatti && currLongi) {
              setPosition({ latitude: currLatti, longitude: currLongi })
            }

            setDestination({ latitude: destiLatti, longitude: destiLongi })
          }
        }
      } catch (error) {
        console.error("Error fetching telemetry:", error)
      }
    }

   
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(2)
  }


  const droneScale = droneMarkerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  })


return (

  <View style={[{ flex: 1, backgroundColor }]}>
    <StatusBar style={isDark ? "light" : "dark"} />
    <View style={styles.header}>
    <Text style={[styles.headerTitle, { color: accentColor }]}>Drone Live Tracking</Text>
    </View>

 <View style={styles.mapContainer}>
    <MapViewAlternative
    style={styles.map}
    center={centerRef.current}
    isDark={isDark}
    markers={[
      {
        id: "origin",
        position: { lat: path[0]?.latitude || position.latitude, lng: path[0]?.longitude || position.longitude },
        title: "Origin",
        color: "#4285F4",
      },
      {
        id: "destination",
        position: { lat: destination.latitude, lng: destination.longitude },
        title: "Destination",
        color: "#FF9800",
      },
      {
        id: "drone",
        position: { lat: position.latitude, lng: position.longitude },
        title: "Drone",
        color: "#30D5C8",
      },
    ]}
    paths={[
      {
        id: "dronePath",
        coordinates: path.map((p) => ({ lat: p.latitude, lng: p.longitude })),
        strokeColor: "#30D5C8",
        strokeWidth: 3,
      },
    ]}
  />

      </View>

      <ScrollView style={styles.telemetryContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.telemetryRow}>
          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Range</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>{telemetry.range} km</Text>
          </View>

          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Battery</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>{Math.floor(telemetry.battery)}%</Text>
          </View>

          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Temperature</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>{telemetry.temperature}°C</Text>
          </View>
        </View>

        <View style={styles.telemetryRow}>
          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Altitude</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>{telemetry.altitude} m</Text>
          </View>

          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Horizontal Speed</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>
              {telemetry.horizontalSpeed.toFixed(2)} m/s
            </Text>
          </View>
          <View style={[styles.telemetryItem, { backgroundColor: cardBackgroundColor }]}>
            <Text style={[styles.telemetryLabel, { color: secondaryTextColor }]}>Vertical Speed</Text>
            <Text style={[styles.telemetryValue, { color: textColor }]}>{telemetry.verticalSpeed.toFixed(2)} m/s</Text>
          </View>
        </View>


        <View style={styles.statusContainer}>
          <Text style={[styles.statusTitle, { color: textColor }]}>Delivery Status</Text>

          <View style={styles.statusTracker}>
            <View style={styles.statusStep}>
              <View style={[styles.statusDot, styles.completedDot]} />
              <View style={[styles.statusLine, styles.completedLine]} />
              <Text style={[styles.statusText, { color: secondaryTextColor }]}>Preparing</Text>
            </View>

            <View style={styles.statusStep}>
              <View style={[styles.statusDot, styles.activeDot]} />
              <View style={[styles.statusLine, { backgroundColor: isDark ? "#333" : "#ddd" }]} />
              <Text style={[styles.statusText, styles.activeStatusText]}>In Transit</Text>
            </View>

            <View style={styles.statusStep}>
              <View style={[styles.statusDot, { backgroundColor: isDark ? "#333" : "#ddd" }]} />
              <Text style={[styles.statusText, { color: secondaryTextColor }]}>Delivered</Text>
            </View>
          </View>

          <View style={[styles.estimatedTimeContainer, { backgroundColor: cardBackgroundColor }]}>
            <Ionicons name="time" size={20} color={accentColor} />
            <Text style={[styles.estimatedTimeText, { color: textColor }]}>Estimated arrival in 15 minutes</Text>
          </View>
        </View> 
      </ScrollView>
      </View>
     


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  mapContainer: {
    height: 300,
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  droneMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#30D5C8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  telemetryContainer: {
    flex: 1,
    padding: 10,
  },
  telemetryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  telemetryItem: {
    width: "32%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
  },
  telemetryLabel: {
    fontSize: 10,
    marginBottom: 5,
    fontFamily: "Inter-Regular",
  },
  telemetryValue: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  statusContainer: {
    padding: 15,
    marginTop: 10,
    marginBottom: 80,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Inter-Bold",
  },
  statusTracker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  statusStep: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  completedDot: {
    backgroundColor: "#30D5C8",
  },
  activeDot: {
    backgroundColor: "#30D5C8",
    borderWidth: 4,
    borderColor: "rgba(48, 213, 200, 0.3)",
    width: 24,
    height: 24,
  },
  statusLine: {
    position: "absolute",
    top: 10,
    left: "50%",
    width: "100%",
    height: 2,
    zIndex: -1,
  },
  completedLine: {
    backgroundColor: "#30D5C8",
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  activeStatusText: {
    color: "#30D5C8",
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  estimatedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  estimatedTimeText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
 
})
