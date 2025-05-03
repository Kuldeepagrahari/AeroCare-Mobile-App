"use client"

import { useEffect } from "react"
import { View, Image, StyleSheet, Text } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import BottomNavigation from "@/components/BottomNavigation"
import { useTheme } from "@/components/ThemeProvider"

export default function SplashScreen() {
  // const { isDark } = useTheme()
  const isDark = false

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      router.replace("/auth/login")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: "#30D5C8" }]}>
      <StatusBar style="light" />
      <Image source={require("@/assets/drone-logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>AeroCare</Text>
      <Text style={styles.subtitle}>Swift. Safe. Life-Saving Deliveries</Text>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    opacity: 1,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
})
