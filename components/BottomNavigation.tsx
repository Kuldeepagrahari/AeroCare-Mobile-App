"use client"

import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Link, usePathname } from "expo-router"
import { useTheme } from "./ThemeProvider"
import { Home, Activity, MapPin, User } from "./SafeIcons"

interface BottomNavigationProps {
  active?: "home" | "order" | "tracking" | "command"
}

export default function BottomNavigation({ active = "home" }: BottomNavigationProps) {
  const pathname = usePathname()
  const { isDark } = useTheme()

  // If active prop is not provided, try to determine from pathname
  const determineActive = () => {
    if (active !== "home") return active

    if (pathname.includes("/tracking")) return "tracking"
    if (pathname.includes("/command")) return "command"
    if (pathname.includes("/order")) return "buy"
    return "home"
  }

  const activeTab = determineActive()
  const activeColor = "#30D5C8"
  const inactiveColor = isDark ? "#777" : "#999"
  const backgroundColor = isDark ? "#1a1a1a" : "#fff"
  const borderColor = isDark ? "#333" : "#eee"

  return (
    <View style={[styles.container, { backgroundColor, borderTopColor: borderColor }]}>
      <Link href="/(tabs)/home" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color={activeTab === "home" ? activeColor : inactiveColor} />
          <Text
            style={[
              styles.navText,
              activeTab === "home" && styles.activeNavText,
              { color: activeTab === "home" ? activeColor : inactiveColor },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(tabs)/buy" asChild>
        <TouchableOpacity style={styles.navItem}>
          <Activity size={24} color={activeTab === "buy" ? activeColor : inactiveColor} />
          <Text
            style={[
              styles.navText,
              activeTab === "buy" && styles.activeNavText,
              { color: activeTab === "buy" ? activeColor : inactiveColor },
            ]}
          >
            Order
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(tabs)/tracking" asChild>
        <TouchableOpacity style={styles.navItem}>
          <MapPin size={24} color={activeTab === "tracking" ? activeColor : inactiveColor} />
          <Text
            style={[
              styles.navText,
              activeTab === "tracking" && styles.activeNavText,
              { color: activeTab === "tracking" ? activeColor : inactiveColor },
            ]}
          >
            Track
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(tabs)/command" asChild>
        <TouchableOpacity style={styles.navItem}>
          <User size={24} color={activeTab === "command" ? activeColor : inactiveColor} />
          <Text
            style={[
              styles.navText,
              activeTab === "command" && styles.activeNavText,
              { color: activeTab === "command" ? activeColor : inactiveColor },
            ]}
          >
            Command
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop:50
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },
  activeNavText: {
    fontFamily: "Inter-Medium",
  },
})
