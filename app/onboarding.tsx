"use client"

import { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

const { width } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Welcome to AeroCare!",
    description: "Revolutionizing medical deliveries with drones. Faster, safer, and smarter healthcare logistics.",
    image: require("@/assets/drone_msg.png"),
  },
  {
    id: "2",
    title: "Deliver Life-Saving Essentials",
    description: "From organs to vaccines, ensure critical supplies reach their destination on time.",
    image: require("../assets/drone_msg.png"),
  },
  {
    id: "3",
    title: "Track Your Drones Live",
    description: "Monitor drone routes, payload status, and ETAs with precision. For Real Time Tracking turn on live location.",
    image: require("../assets/drone_msg.png"),
  },
  {
    id: "4",
    title: "Control Made Easy",
    description: "Schedule, prioritize, and manage all deliveries with just a few taps.",
    image: require("../assets/drone_msg.png"),
  },
  {
    id: "5",
    title: "Let's Save Lives Together",
    description: "Get started and redefine healthcare logistics.",
    image: require("../assets/drone_msg.png"),
  },
]


export default function OnboardingScreen() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = slides[currentSlideIndex]

  const handleNext = () => {
    if (currentSlideIndex === slides.length - 1) {
      router.replace("/(tabs)/home")
    } else {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handleSkip = () => {
    router.replace("/(tabs)/home")
  }

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, { backgroundColor: index === currentSlideIndex ? "#30D5C8" : "#ccc" }]}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>AeroCare</Text>
        <Text style={styles.headerSubtitle}>Swift. Safe. Life-Saving Deliveries</Text>
      </View> */}

      <View style={styles.imageContainer}>
        <Image source={currentSlide.image} style={styles.image} />
      </View>

      {renderPagination()}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {currentSlideIndex === slides.length - 1 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : currentSlideIndex === 2 ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Allow live location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#30D5C8",
    fontFamily: "Inter-Bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#4A6572",
    fontFamily: "Inter-Regular",
  },
  imageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: 250,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  contentContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#30D5C8",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Inter-Bold",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: "Inter-Regular",
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#30D5C8",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  skipButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
})

