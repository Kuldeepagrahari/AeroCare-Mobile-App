"use client"

import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "./ThemeProvider"
import { Ionicons } from "@expo/vector-icons"

interface DroneStatsProps {
  battery: number
  speed: number
  range: number
  wind: number
}

export default function DroneStats({ battery, speed, range, wind }: DroneStatsProps) {
  const { isDark } = useTheme()
  const accentColor = "#30D5C8"
  const backgroundColor = isDark ? "#2a2a2a" : "#f5f5f5"
  const textColor = isDark ? "#fff" : "#333"
  const labelColor = isDark ? "#aaa" : "#666"

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={[styles.statItem, { backgroundColor }]}>
          <Ionicons name="battery-full" size={24} color={accentColor} />
          <Text style={[styles.statLabel, { color: labelColor }]}>Current Battery</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{battery}%</Text>
        </View>

        <View style={[styles.statItem, { backgroundColor }]}>
          <Ionicons name="speedometer" size={24} color={accentColor} />
          <Text style={[styles.statLabel, { color: labelColor }]}>Max Speed</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{speed} km/h</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statItem, { backgroundColor }]}>
          <Ionicons name="globe" size={24} color={accentColor} />
          <Text style={[styles.statLabel, { color: labelColor }]}>Max Range</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{range} km</Text>
        </View>

        <View style={[styles.statItem, { backgroundColor }]}>
          <Ionicons name="thunderstorm" size={24} color={accentColor} />
          <Text style={[styles.statLabel, { color: labelColor }]}>Safe Wind</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{wind} km/h</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  statsContainer: {
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: {
    width: "48%",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: "Inter-Bold",
  },
})
