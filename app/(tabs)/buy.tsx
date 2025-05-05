"use client"

import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useColorScheme } from "react-native"
import { ChevronLeft, Heart, Share2, Star } from "lucide-react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import ScreenWrapper from '@/components/ScreenWrapper';
export default function DetailScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  return (
    <ScreenWrapper>
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/drone_msg.png")} style={styles.image} resizeMode="contain" />
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                size={20}
                color={isFavorite ? "#ff4757" : isDark ? "#fff" : "#000"}
                fill={isFavorite ? "#ff4757" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }]}
            >
              <Share2 size={20} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.contentContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
      
          <View style={styles.header}>
  <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>VTOL Drone</Text>
  <Text style={[styles.price, { color: isDark ? "#fff" : "#000" }]}>1,80,000/-</Text>
</View>

<View style={styles.ratingContainer}>
  <View style={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        color={star <= 5 ? "#ffc107" : isDark ? "#444" : "#ddd"}
        fill={star <= 5 ? "#ffc107" : "transparent"}
      />
    ))}
  </View>
  <Text style={[styles.ratingText, { color: isDark ? "#ccc" : "#666" }]}>5.0</Text>
</View>

<Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Description</Text>
<Text style={[styles.description, { color: isDark ? "#ccc" : "#666" }]}>
  This next-gen VTOL drone is specially designed for critical vaccine delivery across cities, states, and even the most
  remote regions like Ladakh and northern terrains. With vertical takeoff and landing capability, it operates in rugged,
  high-altitude areas where traditional transport is difficult. Built with precision medical-grade insulation for vaccines,
  real-time telemetry, and AI-based route optimization, it's the future of healthcare logistics.
</Text>

<Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Specifications</Text>
<View style={styles.specContainer}>
  <View style={styles.specItem}>
    <Text style={[styles.specLabel, { color: isDark ? "#ccc" : "#666" }]}>Payload Capacity</Text>
    <Text style={[styles.specValue, { color: isDark ? "#fff" : "#000" }]}>Up to 5kg</Text>
  </View>
  <View style={styles.specItem}>
    <Text style={[styles.specLabel, { color: isDark ? "#ccc" : "#666" }]}>Range</Text>
    <Text style={[styles.specValue, { color: isDark ? "#fff" : "#000" }]}>300+ km</Text>
  </View>
  <View style={styles.specItem}>
    <Text style={[styles.specLabel, { color: isDark ? "#ccc" : "#666" }]}>Flight Endurance</Text>
    <Text style={[styles.specValue, { color: isDark ? "#fff" : "#000" }]}>Up to 4 hours</Text>
  </View>
  <View style={styles.specItem}>
    <Text style={[styles.specLabel, { color: isDark ? "#ccc" : "#666" }]}>Terrain Adaptation</Text>
    <Text style={[styles.specValue, { color: isDark ? "#fff" : "#000" }]}>High Altitude</Text>
  </View>
  <View style={styles.specItem}>
    <Text style={[styles.specLabel, { color: isDark ? "#ccc" : "#666" }]}>Material</Text>
    <Text style={[styles.specValue, { color: isDark ? "#fff" : "#000" }]}>Carbon Fiber Composite</Text>
  </View>
</View>

<View style={styles.quantityContainer}>
  <Text style={[styles.quantityLabel, { color: isDark ? "#fff" : "#000" }]}>Quantity</Text>
  <View style={styles.quantityControls}>
    <TouchableOpacity
      style={[styles.quantityButton, { backgroundColor: isDark ? "#333" : "#e0e0e0" }]}
      onPress={() => setQuantity(Math.max(1, quantity - 1))}
    >
      <Text style={[styles.quantityButtonText, { color: isDark ? "#fff" : "#000" }]}>-</Text>
    </TouchableOpacity>
    <Text style={[styles.quantityValue, { color: isDark ? "#fff" : "#000" }]}>{quantity}</Text>
    <TouchableOpacity
      style={[styles.quantityButton, { backgroundColor: isDark ? "#333" : "#e0e0e0" }]}
      onPress={() => setQuantity(quantity + 1)}
    >
      <Text style={[styles.quantityButtonText, { color: isDark ? "#fff" : "#000" }]}>+</Text>
    </TouchableOpacity>
  </View>
</View>

        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}>
        <TouchableOpacity style={[styles.addToCartButton, { backgroundColor: "#30D5C8" }]}>
          <Text style={styles.addToCartText}>Add to Cart - {(180000 * quantity)} /- </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    fontFamily: "Inter-Medium",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: "Inter-Regular",
  },
  specContainer: {
    marginBottom: 24,
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  specLabel: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  specValue: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 16,
    fontFamily: "Inter-Medium",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addToCartButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "Inter-Medium",
  },
})
