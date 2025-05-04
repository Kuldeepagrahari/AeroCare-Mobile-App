"use client"

import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native"
import { useEffect, useRef } from "react"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"

export default function BookingConfirmedScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  // Animation for the elements
  const element1Anim = useRef(new Animated.Value(0)).current
  const element2Anim = useRef(new Animated.Value(0)).current
  const element3Anim = useRef(new Animated.Value(0)).current
  const element4Anim = useRef(new Animated.Value(0)).current
  const element5Anim = useRef(new Animated.Value(0)).current
  const element6Anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate the checkmark
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
        // easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()

    // Animate the text
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start()

    // Animate the floating elements
    const animateElements = () => {
      Animated.parallel([
        animateElement(element1Anim, 1000, 0),
        animateElement(element2Anim, 1500, 200),
        animateElement(element3Anim, 1200, 400),
        animateElement(element4Anim, 1400, 600),
        animateElement(element5Anim, 1100, 800),
        animateElement(element6Anim, 1300, 1000),
      ]).start()
    }

    animateElements()
  }, [])

  const animateElement = (anim, duration, delay) => {
    return Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: duration / 2,
            useNativeDriver: true,
            // easing: Easing.inOut(Easing.sine),
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
            // easing: Easing.inOut(Easing.sine),
          }),
        ]),
      ),
    ])
  }

  const handleTrack = () => {
    router.push("/(tabs)/command")
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <Animated.View style={[styles.checkmarkCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Feather name="check" size={36} color="#30D5C8" />
          </Animated.View>

          <View style={styles.animationElements}>
            <Animated.View
              style={[
                styles.element,
                styles.e1,
                {
                  opacity: element1Anim,
                  transform: [{ scale: element1Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.element,
                styles.e2,
                {
                  opacity: element2Anim,
                  transform: [{ scale: element2Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.element,
                styles.e3,
                {
                  opacity: element3Anim,
                  transform: [{ scale: element3Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.element,
                styles.e4,
                {
                  opacity: element4Anim,
                  transform: [{ scale: element4Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.element,
                styles.e5,
                {
                  opacity: element5Anim,
                  transform: [{ scale: element5Anim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.element,
                styles.e6,
                {
                  opacity: element6Anim,
                  transform: [{ scale: element6Anim }],
                },
              ]}
            />
          </View>
        </View>

        <Animated.Text style={[styles.title, { opacity: opacityAnim }]}>Booking Confirmed</Animated.Text>

        <Animated.Text style={[styles.message, { opacity: opacityAnim }]}>
          Our drone is ready to save lives!
        </Animated.Text>

        <Animated.View style={{ opacity: opacityAnim, width: "100%" }}>
          <TouchableOpacity style={styles.trackButton} onPress={handleTrack}>
            <Text style={styles.trackButtonText}>Track</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  animationContainer: {
    position: "relative",
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(48, 213, 200, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -40,
    marginTop: -40,
    zIndex: 10,
  },
  animationElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  element: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#30D5C8",
    opacity: 0.7,
  },
  e1: {
    top: "20%",
    left: "20%",
    width: 15,
    height: 15,
  },
  e2: {
    top: "70%",
    left: "30%",
    width: 8,
    height: 8,
  },
  e3: {
    top: "40%",
    right: "20%",
    width: 12,
    height: 12,
  },
  e4: {
    bottom: "20%",
    right: "30%",
    width: 10,
    height: 10,
  },
  e5: {
    top: "30%",
    left: "50%",
    width: 7,
    height: 7,
  },
  e6: {
    bottom: "30%",
    left: "40%",
    width: 9,
    height: 9,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    fontFamily: "Inter-Bold",
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    fontFamily: "Inter-Regular",
  },
  trackButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    width: "100%",
  },
  trackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})
