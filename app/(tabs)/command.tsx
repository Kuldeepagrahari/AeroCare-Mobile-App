"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Slider from "@react-native-community/slider"
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useJourney } from "@/context/journeyContext";

export default function CommandScreen() {
  // const { isJourneyStarted } = useJourney();
  const isJourneyStarted = true
  const {journey_end} = useJourney()
  const [mode, setMode] = useState("Drone is ready to Takeoff")
  const [temperature, setTemperature] = useState(5.0)
  const [loading, setLoading] = useState(false)
  const [takeoff, setTakeoff] = useState(false)
  const [hover, setHover] = useState(false)

  const handleEmergencyLanding = async () => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
      setTimeout(() => {
        Alert.alert("Emergency Landing", "Emergency landing initiated")
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Emergency landing failed", error)
      setLoading(false)
    }
  }

  const handleModeChange = async (newMode:any) => {
   
    Alert.alert("Are you sure!", `We're going to execute ${newMode}`, [
      { text: "Cancel", onPress: () =>null , style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          try {
      // In a real app, you would make an API call here
             fetch("https://vtol-server.onrender.com/api/command/action", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ mode: newMode }),
             }).catch((error) => {
             console.error("Mode change API call failed:", error)
            })
            setMode(newMode)
          } catch (error) {
             console.error("Mode change failed", error)
          }}
  }])
  }
  const handleEndJourney = async () => {
    try {
      setLoading(true)
      Alert.alert("Are you sure!", "Do you want to end the journey?", [
        { text: "Cancel", onPress: () => setLoading(false), style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            // Proceed with ending the journey
            fetch("https://vtol-server.onrender.com/api/telemetry/end", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => {
                setLoading(false)
                if (response.ok) {
                  journey_end()
                  Alert.alert("Journey Ended", "Hopefully, You made a Successful Journey! We will wait for the next one!", [
                    { text: "OK", onPress: () => router.replace("/(tabs)/home") },
                  ])
                } else {
                  Alert.alert("Error", "Failed to end journey")
                }
              })
              .catch((error) => {
                setLoading(false)
                console.error("End journey API call failed:", error)
                // For demo purposes, we'll proceed anyway
                Alert.alert("Journey Ended", "Hopefully, You made a Successful Journey! We will wait for the next one!", [
                  { text: "OK", onPress: () => router.replace("/(tabs)/home") },
                ])
              })
          },
        },
      ]
      )
      // In a real app, you would make an API call here
     
    } catch (error) {
      setLoading(false)
      console.error("Error ending journey:", error)
    }
  }

 
  return (
 
  <ScreenWrapper>
      {isJourneyStarted ? (
        <View style={styles.container}>
          <StatusBar style="dark" />
           <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: "#333" }]}>Control Your Drone</Text>
           </View>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.section}>
             
              <View style={styles.temperatureContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={0.1}
                  value={temperature}
                  onValueChange={(value) =>
                    setTemperature(Number.parseFloat(value.toFixed(1)))
                  }
                  minimumTrackTintColor="#30D5C8"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#30D5C8"
                />
                <Text style={styles.temperatureValue}>{temperature}°C</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.modeValue}>{mode}</Text>
            </View>

            <View style={styles.modeButtonsContainer}>
              {!takeoff ? (
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'takeoff' && styles.activeModeButton,
                  ]}
                  onPress={() => {
                    handleModeChange('takeoff');
                    setTakeoff(true);
                  }}
                >
                  <MaterialIcons name="flight-takeoff" size={20} color="white" />
                  <Text style={styles.modeButtonText}> Takeoff</Text>
                </TouchableOpacity>
              ) :  <>
              <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'landing' && styles.activeModeButton,
              ]}
              onPress={() => {
                handleModeChange('landing');
                
              }} 
            >
               <MaterialIcons name="flight-land" size={20} color="white" />
              <Text style={styles.modeButtonText}> Land</Text>
            </TouchableOpacity>
              <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'failsafe' && styles.activeModeButton,
              {backgroundColor: "#FF5252"}
              ]}
              onPress={() => {
                handleModeChange('failsafe');
                
              }} 
              
            >
                 <MaterialIcons name="warning" size={20} color="white" />
              <Text style={styles.modeButtonText}> FailSafe</Text>
            </TouchableOpacity>
            </>}

             {takeoff ?<> {!hover ? (
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'hovering' && styles.activeModeButton,
                  ]}
                  onPress={() => {
                    handleModeChange('hovering');
                    setHover(true);
                  }}
                >
                  <Ionicons name="pause-circle" size={20} color="white" />
                  <Text style={styles.modeButtonText}> Hover</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    mode === 'On the way' && styles.activeModeButton,
                  ]}
                  onPress={() => {
                    handleModeChange('On the way');
                    setHover(false);
                  }}
                >
                  <Ionicons name="play-circle" size={20} color="white" />
                  <Text style={styles.modeButtonText}> Resume</Text>
                </TouchableOpacity>
              )} </> : null}
            </View>

            <View style={styles.actionButtonsContainer}>
            

              <TouchableOpacity
                style={[styles.actionButton, styles.endJourneyButton]}
                onPress={handleEndJourney}
                disabled={loading}
              >
                <Ionicons name="stop-circle" size={20} color="white" />
                <Text style={styles.actionButtonText}> End the Journey</Text>
              </TouchableOpacity>

            
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'black',
              fontWeight: '800',
              fontSize: 40,
              textAlign: 'center',
            }}
          >
            Journey not started yet
          </Text>
          <Text style={{ color: 'black' }}>Please start a journey</Text>
        </View>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 50,
    alignItems: "center",
    backgroundColor: "#30D5C8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Inter-Bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Inter-Bold",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    width: 200,
    height: 40,
  },
  temperatureValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#30D5C8",
    marginLeft: 20,
    width: 80,
    fontFamily: "Inter-Bold",
  },
  modeValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#30D5C8",
    textAlign: "center",
    fontFamily: "Inter-Bold",
    textShadowColor: "black",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  modeButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  modeButton: {
    width: 140,
    height: 80,
    backgroundColor: "#30D5C8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flexDirection: "row",
  },
  activeModeButton: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flexDirection: "row",
  },
  modeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  actionButtonsContainer: {
    marginTop: 0,
  },
  actionButton: {
    paddingVertical: 25,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    flexDirection: "row",
  
  },
  emergencyButton: {
    backgroundColor: "#FF5252",
    fontWeight:800
  },
  landingButton: {
    backgroundColor: "#30D5C8",
    fontWeight:800
  },
  endJourneyButton: {
    backgroundColor: "#4CAF50",
    fontWeight:800
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Inter-Medium",
  },
})

