import { Platform, View, Text, StyleSheet } from "react-native"

// Create empty component implementations for web
const WebPlaceholderComponents = {
  MapView: ({ children, style, ...props }:any) => (
    <View style={[styles.webMapPlaceholder, style]}>
      <Text style={styles.webMapText}>Map View (Not available on web)</Text>
      {/* Render children as static elements */}
      {children}
    </View>
  ),
  Marker: ({ children, ...props }:any) => <View>{children}</View>,
  Polyline: () => null,
  PROVIDER_GOOGLE: null,
}

// Only import and export the real components on native platforms
let MapView, Marker, Polyline, PROVIDER_GOOGLE

if (Platform.OS !== "web") {
  try {
    // Use dynamic require to prevent web bundling
    const ReactNativeMaps = require("react-native-maps")
    MapView = ReactNativeMaps.default
    Marker = ReactNativeMaps.Marker
    Polyline = ReactNativeMaps.Polyline
    PROVIDER_GOOGLE = ReactNativeMaps.PROVIDER_GOOGLE
  } catch (error) {
    console.warn("Failed to load react-native-maps:", error)
    // Fallback to placeholders if module fails to load
    MapView = WebPlaceholderComponents.MapView
    Marker = WebPlaceholderComponents.Marker
    Polyline = WebPlaceholderComponents.Polyline
    PROVIDER_GOOGLE = WebPlaceholderComponents.PROVIDER_GOOGLE
  }
} else {
  // Use web placeholders
  MapView = WebPlaceholderComponents.MapView
  Marker = WebPlaceholderComponents.Marker
  Polyline = WebPlaceholderComponents.Polyline
  PROVIDER_GOOGLE = WebPlaceholderComponents.PROVIDER_GOOGLE
}

// Export the components
export { Marker, Polyline, PROVIDER_GOOGLE }
export default MapView

const styles = StyleSheet.create({
  webMapPlaceholder: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 20,
    height: 300,
  },
  webMapText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
})
