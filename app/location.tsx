"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  Switch
} from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import * as Location from "expo-location"
import { useTheme } from "@/components/ThemeProvider"
import { Ionicons } from "@expo/vector-icons"
import MapViewAlternative from "@/components/MapViewAlternate"
import { GOOGLE_MAPS_API_KEY } from "@/constants/ApiKeys"
import { useJourney } from "@/context/journeyContext";

// Define the form data interface
interface FormData {
  fromLocation: string
  toLocation: string
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
  criticalBattery: string
  temperature: string
  altitude: string
  emergencyAction: "Land" | "RTL"
}

export default function LocationScreen() {

  const { startJourney } = useJourney();
  const { isDark } = useTheme()
  const backgroundColor = isDark ? "#121212" : "#fff"
  const textColor = isDark ? "#fff" : "#333"
  const inputBackgroundColor = isDark ? "#2a2a2a" : "#f5f5f5"
  const borderColor = isDark ? "#333" : "#ddd"

  // State variables
  const [loading, setLoading] = useState(false)
  const [feasibilityChecked, setFeasibilityChecked] = useState(false)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [btnTitle, setBtnTitle] = useState("Check Feasibility")
  const [useCurrentLocationAsDestination, setUseCurrentLocationAsDestination] = useState(false);
  // Map state
  const [mapCenter, setMapCenter] = useState({
    latitude: 64.2008,
    longitude: -149.4937, // Default location: Alaska
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  // Initialize form data with empty values
  const [formData, setFormData] = useState<FormData>({
    fromLocation: "",
    toLocation: "",
    fromLat: 0,
    fromLng: 0,
    toLat: 0,
    toLng: 0,
    criticalBattery: "",
    temperature: "",
    altitude: "",
    emergencyAction: "Land",
  })


  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Get user's current location on component mount
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
      
       
        // setLoading(true)
        const location = await fetch("https://vtol-server.onrender.com/api/telemetry/from")

       if(location.ok) {
          const data = await location.json()
          const initialData = data.initialDroneData
          if(initialData.droneLatti === 0 && initialData.droneLongi === 0){
            return Alert.alert("Drone is Off", "Please turn on the drone to Start the Journey")
          }

        setMapCenter({
          latitude: initialData.droneLatti,
          longitude: initialData.droneLongi,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })

        // Get address from coordinates
        try {
          const addresses = await Location.reverseGeocodeAsync({
            latitude: initialData.droneLatti,
            longitude: initialData.droneLongi})
          if (addresses && addresses.length > 0) {
            const address = addresses[0]
            const formattedAddress = [address.name, address.street, address.city, address.region, address.country]
              .filter(Boolean)
              .join(", ")

         
          
            setFormData((prev) => ({
              ...prev,
              fromLocation: formattedAddress,
              fromLat: initialData.droneLatti,
              fromLng: initialData.droneLongi,
            }))
          }
        } catch (error) {
          console.log("Error getting address:", error)
        }

        setLoading(false)}
      } catch (error) {
        setLoading(false)
        console.log("Error getting location:", error)
        Alert.alert("Location Error", "Failed to get your current location.")
      }
    }

    getCurrentLocation()
  }, [])
 
  
  // Search for a location using Google Places API
  const searchLocation = async (query: string, isDestination: boolean) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_MAPS_API_KEY}`,
      )

      const data = await response.json()

      if (data.status === "OK" && data.predictions.length > 0) {
        const placeId = data.predictions[0].place_id

        // Get place details
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`,
        )

        const detailsData = await detailsResponse.json()

        if (detailsData.status === "OK") {
          const location = detailsData.result.geometry.location
          const formattedAddress = detailsData.result.formatted_address

          if (isDestination) {
            setFormData((prev) => ({
              ...prev,
              toLocation: formattedAddress,
              toLat: location.lat,
              toLng: location.lng,
            }))

            // Update map center to destination
            setMapCenter({
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })
          } else {
            setFormData((prev) => ({
              ...prev,
              fromLocation: formattedAddress,
              fromLat: location.lat,
              fromLng: location.lng,
            }))
          }
        }
      }
      setLoading(false)
    } catch (error) {
      console.error("Error searching location:", error)
      setLoading(false)
    }
  }

  // Handle map press to set destination
  const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {
    // If we haven't set a destination yet, use the pressed location as destination
    if (!formData.toLat || !formData.toLng) {
      setFormData((prev) => ({
        ...prev,
        toLat: coordinate.latitude,
        toLng: coordinate.longitude,
      }))

      // Get address from coordinates
      Location.reverseGeocodeAsync(coordinate)
        .then((addresses) => {
          if (addresses && addresses.length > 0) {
            const address = addresses[0]
            const formattedAddress = [address.name, address.street, address.city, address.region, address.country]
              .filter(Boolean)
              .join(", ")

            setFormData((prev) => ({
              ...prev,
              toLocation: formattedAddress,
            }))
          }
        })
        .catch((error) => {
          console.log("Error getting address:", error)
        })
    }
  }

  // Check feasibility of the journey
  const handleCheckFeasibility = async () => {
    if (!formData.fromLocation || !formData.toLocation) {
      Alert.alert("Missing Information", "Please enter both locations")
      return
    }

    if (!formData.fromLat || !formData.fromLng || !formData.toLat || !formData.toLng) {
      Alert.alert("Invalid Locations", "Please select valid locations on the map")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://vtol-server.onrender.com/api/telemetry/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLongi: formData.fromLng,
          sourceLatti: formData.fromLat,
          destiLongi: formData.toLng,
          destiLatti: formData.toLat,
        }),
      })
  


      const data = await response.json()
 

      setLoading(false)

      if (response.ok) {
        setFeasibilityChecked(true)
        setBtnTitle("Go Ahead")
      } else {
        Alert.alert(
          "Feasibility Check Failed",
          `We can't cover this much distance\nBattery: ${data.batterySoC}%\nDistance: ${data.distance?.toFixed(2)} km ${data}`,
       
        )
      }
    } catch (error) {
      setLoading(false)
      console.error("Feasibility Check Failed:", error)

      // For demo purposes, we'll proceed anyway
      Alert.alert(
        "Server Error",
        "Could not connect to the server. Would you like to proceed anyway for demonstration?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Proceed",
            onPress: () => {
              setFeasibilityChecked(true)
              setBtnTitle("Go Ahead")
            },
          },
        ],
      )
    }
  }

  const setCurrentLocationAsDestination = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
  
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
  
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
  
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        const formattedAddress = [address.name, address.street, address.city, address.region, address.country]
          .filter(Boolean)
          .join(", ");
  
        setFormData((prev) => ({
          ...prev,
          toLocation: formattedAddress,
          toLat: latitude,
          toLng: longitude,
        }));
  
        setMapCenter({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.log('Error getting current location:', error);
      Alert.alert('Location Error', 'Failed to fetch your current location.');
    }
  };
  

  // Proceed to order details
  const handleProceed = () => {
    if (!formData.temperature || !formData.altitude) {
      Alert.alert("Missing Information", "Please fill all required fields")
      return
    }

    setShowOrderDetails(true)
  }

  // Book the journey
  const handleBook = async () => {
    setLoading(true)

    try {
      const response = await fetch("https://vtol-server.onrender.com/api/telemetry/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLongi: formData.fromLng,
          sourceLatti: formData.fromLat,
          destiLongi: formData.toLng,
          destiLatti: formData.toLat,
          criticalBattery: formData.criticalBattery,
          temperature: formData.temperature,
          altitude: formData.altitude,
        }),
      })

      setLoading(false)

      if (response.ok) {
        startJourney()
        router.push("/booking/confirmed")
      } else {
        Alert.alert("Error", "Failed to start journey")
      }
    } catch (error) {
      setLoading(false)
      console.error("Start Journey Failed:", error)
       Alert.alert("Error", "Failed to start journey")
      // For demo purposes, we'll proceed anyway
      // router.push("/booking/confirmed")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>Syma W2</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapViewAlternative
          style={styles.map}
          center={mapCenter}
          isDark={isDark}
          markers={[
            ...(formData.fromLat && formData.fromLng
              ? [
                  {
                    id: "origin",
                    position: { lat: formData.fromLat, lng: formData.fromLng },
                    title: "Origin",
                    color: "#4285F4",
                  },
                ]
              : []),
            ...(formData.toLat && formData.toLng
              ? [
                  {
                    id: "destination",
                    position: { lat: formData.toLat, lng: formData.toLng },
                    title: "Destination",
                    color: "#FF9800",
                  },
                ]
              : []),
          ]}
          paths={
            formData.fromLat && formData.fromLng && formData.toLat && formData.toLng
              ? [
                  {
                    id: "route",
                    coordinates: [
                      { lat: formData.fromLat, lng: formData.fromLng },
                      { lat: formData.toLat, lng: formData.toLng },
                    ],
                    strokeColor: "#007bff",
                    strokeWidth: 4,
                  },
                ]
              : []
          }
          onMapPress={handleMapPress}
        />

        {loading && (
          <View style={styles.mapOverlay}>
            <ActivityIndicator size="large" color="#30D5C8" />
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {!showOrderDetails ? (
          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: textColor }]}>Location</Text>

            {/* From Location Input */}
            <Text style={[styles.inputLabel, { color: textColor }]}>From</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
              placeholder="From where?"
              placeholderTextColor={isDark ? "#777" : "#999"}
              value={formData.fromLocation}
              onChangeText={(text) => handleInputChange("fromLocation", text)}
              onSubmitEditing={() => searchLocation(formData.fromLocation, false)}
            />
            <Text style={[styles.inputHint, { color: isDark ? "#aaa" : "#666" }]}>
              Enter location and press return to search
            </Text>

            {/* To Location Input */}
            <Text style={[styles.inputLabel, { color: textColor }]}>To</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
              placeholder="Where should you go?"
              placeholderTextColor={isDark ? "#777" : "#999"}
              value={formData.toLocation}
              onChangeText={(text) => handleInputChange("toLocation", text)}
              onSubmitEditing={() => searchLocation(formData.toLocation, true)}
            />
         
            <Text style={[styles.inputHint, { color: isDark ? "#aaa" : "#666" }]}>
              Enter location and press return to search, or tap on the map
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 ,  paddingRight: 20, width: "90%"}}>
           <Switch
             value={useCurrentLocationAsDestination}
            
             onValueChange={async (val) => {
             setUseCurrentLocationAsDestination(val);
             if (val) {
              await setCurrentLocationAsDestination();
             }
    }}
  />
           <Text style={{ marginLeft: 10, color: textColor }}>
             Take my current location as destination address
           </Text>
          </View>


            {/* Critical Battery Input */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Critical Battery (%)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
              placeholder="Critical Battery?"
              placeholderTextColor={isDark ? "#777" : "#999"}
              value={formData.criticalBattery}
              onChangeText={(text) => handleInputChange("criticalBattery", text)}
              keyboardType="numeric"
            />

            {!feasibilityChecked ? (
              <TouchableOpacity style={styles.checkButton} onPress={handleCheckFeasibility} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.checkButtonText}>{btnTitle}</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.additionalFields}>
                {/* Temperature Input */}
                <Text style={[styles.fieldLabel, { color: textColor }]}>Temperature</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  placeholder="Temperature (°C)"
                  placeholderTextColor={isDark ? "#777" : "#999"}
                  value={formData.temperature}
                  onChangeText={(text) => handleInputChange("temperature", text)}
                  keyboardType="numeric"
                />

                {/* Altitude Input */}
                <Text style={[styles.fieldLabel, { color: textColor }]}>Altitude</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBackgroundColor, color: textColor }]}
                  placeholder="Altitude (m)"
                  placeholderTextColor={isDark ? "#777" : "#999"}
                  value={formData.altitude}
                  onChangeText={(text) => handleInputChange("altitude", text)}
                  keyboardType="numeric"
                />

                {/* Emergency Action Selection */}
                <Text style={[styles.fieldLabel, { color: textColor }]}>Emergency Action</Text>
                <View style={styles.selectContainer}>
                  <TouchableOpacity
                    style={[
                      styles.selectOption,
                      { borderColor: borderColor },
                      formData.emergencyAction === "Land" && styles.selectedOption,
                    ]}
                    onPress={() => handleInputChange("emergencyAction", "Land")}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        { color: textColor },
                        formData.emergencyAction === "Land" && styles.selectedOptionText,
                      ]}
                    >
                      Land
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.selectOption,
                      { borderColor: borderColor },
                      formData.emergencyAction === "RTL" && styles.selectedOption,
                    ]}
                    onPress={() => handleInputChange("emergencyAction", "RTL")}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        { color: textColor },
                        formData.emergencyAction === "RTL" && styles.selectedOptionText,
                      ]}
                    >
                      RTL
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                  <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.orderDetailsContainer}>
            <Text style={[styles.orderDetailsTitle, { color: textColor }]}>Order Details</Text>

            <View style={styles.locationsList}>
              <View style={styles.locationItem}>
                <View style={[styles.locationDot, styles.blueDot]} />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationText, { color: textColor }]}>{formData.fromLocation}</Text>
                </View>
              </View>

              <View style={styles.locationItem}>
                <View style={[styles.locationDot, styles.orangeDot]} />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationText, { color: textColor }]}>{formData.toLocation}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.detailsCard, { backgroundColor: inputBackgroundColor }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#aaa" : "#666" }]}>Altitude</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{formData.altitude} m</Text>
              </View>
            </View>

            <View style={[styles.detailsCard, { backgroundColor: inputBackgroundColor }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#aaa" : "#666" }]}>Emergency Action</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{formData.emergencyAction}</Text>
              </View>
            </View>

            <View style={[styles.detailsCard, { backgroundColor: inputBackgroundColor }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: isDark ? "#aaa" : "#666" }]}>Temperature Required</Text>
                <Text style={[styles.detailValue, { color: textColor }]}>{formData.temperature} °C</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBook} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.bookButtonText}>Book</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingTop: Platform.OS === "ios" ? 50 : 50,
    backgroundColor: "#30D5C8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  menuButton: {
    padding: 5,
  },
  mapContainer: {
    height: 250,
    width: "100%",
    position: "relative",
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Inter-Bold",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: "Inter-Medium",
  },
  input: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  inputHint: {
    fontSize: 12,
    marginBottom: 15,
    fontFamily: "Inter-Regular",
  },
  checkButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  additionalFields: {
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Inter-Medium",
  },
  selectContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  selectOption: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    alignItems: "center",
    marginRight: 10,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#30D5C8",
    borderColor: "#30D5C8",
  },
  selectOptionText: {
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  selectedOptionText: {
    color: "#fff",
  },
  proceedButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  orderDetailsContainer: {
    padding: 20,
  },
  orderDetailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Inter-Bold",
  },
  locationsList: {
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  blueDot: {
    backgroundColor: "#4285F4",
  },
  orangeDot: {
    backgroundColor: "#FF9800",
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  detailsCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  bookButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})