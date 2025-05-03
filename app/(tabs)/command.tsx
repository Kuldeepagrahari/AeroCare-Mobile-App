"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Slider from "@react-native-community/slider"
import ScreenWrapper from '@/components/ScreenWrapper';
import { useJourney } from "@/context/journeyContext";

export default function CommandScreen() {
  const { isJourneyStarted } = useJourney();
  const {journey_end} = useJourney()
  const [mode, setMode] = useState("Hover")
  const [temperature, setTemperature] = useState(5.0)
  const [loading, setLoading] = useState(false)

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
    setMode(newMode)
    try {
      // In a real app, you would make an API call here
      fetch("https://vtol-server.onrender.com/api/command/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      }).catch((error) => {
        console.error("Mode change API call failed:", error)
      })
    } catch (error) {
      console.error("Mode change failed", error)
    }
  }

  const handleEndJourney = async () => {
    try {
      setLoading(true)
      // In a real app, you would make an API call here
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
    } catch (error) {
      setLoading(false)
      console.error("Error ending journey:", error)
    }
  }

  const handleRTL = () => {
    try {
      Alert.alert("RTL", "Return to launch initiated")
    } catch (error) {
      console.error("RTL failed", error)
    }
  }

  return (
    <ScreenWrapper>
   {isJourneyStarted ?<> <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature Control</Text>
          <View style={styles.temperatureContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={temperature}
              onValueChange={(value) => setTemperature(Number.parseFloat(value.toFixed(1)))}
              minimumTrackTintColor="#30D5C8"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#30D5C8"
            />
            <Text style={styles.temperatureValue}>{temperature}°C</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Mode</Text>
          <Text style={styles.modeValue}>{mode}</Text>
        </View>

        <View style={styles.modeButtonsContainer}>
          {["Takeoff", "Float", "Hover", "AltHold"].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeButton, mode === m && styles.activeModeButton]}
              onPress={() => handleModeChange(m)}
            >
              <Text style={styles.modeButtonText}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
         

          <TouchableOpacity
            style={[styles.actionButton, styles.landingButton]}
            onPress={handleEmergencyLanding}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Landing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.endJourneyButton]}
            onPress={handleEndJourney}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>End the Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.emergencyButton]}
            onPress={handleRTL}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Execute FailSafe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View></> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "black", fontWeight:"800", fontSize:40, textAlign:"center" }}>Journey not started yet</Text>
        <Text style={{ color: "black"}}>Please start a journey</Text>
      </View>}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#30D5C8",
    textAlign: "center",
    fontFamily: "Inter-Bold",
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
  },
  activeModeButton: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  actionButtonsContainer: {
    marginTop: 20,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  emergencyButton: {
    backgroundColor: "#FF5252",
  },
  landingButton: {
    backgroundColor: "#30D5C8",
  },
  endJourneyButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter-Medium",
  },
})

