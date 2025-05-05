"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert} from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import DroneStats from "@/components/DroneStats"
import { useTheme } from "@/components/ThemeProvider"
import { Ionicons } from "@expo/vector-icons"
import BottomNavigation from "@/components/BottomNavigation"
import ScreenWrapper from '@/components/ScreenWrapper';
export default function HomeScreen() {
  // const { isDark } = useTheme() 
  const isDark = false
  const backgroundColor = isDark ? "#121212" : "#fff"
  const textColor = isDark ? "#fff" : "#333"
  const secondaryTextColor = isDark ? "#aaa" : "#666"
  const borderColor = isDark ? "#333" : "#eee"
  const [battery, setBattery] = useState(100)
  const drone = {
    id: "Syma W2",
    name: "Protective Drone",
    description: "Scratch your protective drone to deliver Vaccines in minimum Cost and higher Speed",
    model: "Aviator Pro",
    
    speed: 46,
    range: 50,
    wind: 15,
  }
  const getbattery = async () => {
    try {
      const res = await fetch("https://vtol-server.onrender.com/api/telemetry/from")

      if(res.ok){
        const data = await res.json()
        setBattery(data.initialDroneData.batterySOC)
      }

    } catch (error) {
      Alert.alert("Error", "Failed to fetch battery data")
    }
  }
  useEffect(() => {
    
    getbattery()
  }
  , [])

  const handleScheduleRide = () => {
    router.push("/location")
  }


  return (
    <ScreenWrapper>
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.droneName, { color: textColor }]}>{drone.id}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
       

        <View style={styles.droneImageContainer}>
       
          <Image source={require("../../assets/drone_msg.png")} style={styles.droneImage} resizeMode="cover" />
        
        </View>

      

        <DroneStats battery={battery} speed={drone.speed} range={drone.range} wind={drone.wind} />

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleRide}>
          <Text style={styles.scheduleButtonText}>Schedule a Ride</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <BottomNavigation active="home" /> */}
    </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    backgroundColor: "#30D5C8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  backButton: {
    padding: 5,
  },
  droneName: {
    fontSize: 25,
  
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  menuButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  droneTitle: {
    marginBottom: 20,
  },
  droneTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Inter-Bold",
  },
  droneDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
  droneImageContainer: {
    alignItems: "center",
    marginBottom: 30,
    height:160
  },
  droneImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  droneModel: {
    fontSize: 25,
    color: "#30D5C8",
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  batteryContainer: {
    marginBottom: 20,
  },
  batteryLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Inter-Medium",
  },
  batteryBar: {
    height: 20,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  batteryLevel: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#30D5C8",
    borderRadius: 5,
  },
  batteryPercentage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    lineHeight: 17,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Inter-Bold",
  },
  scheduleButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 0,
    marginBottom: 80,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})
