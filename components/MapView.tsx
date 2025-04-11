"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Platform, View, Text, StyleSheet, Dimensions } from "react-native"
import { useTheme } from "./ThemeProvider"
import WebView from "react-native-webview"
import { GOOGLE_MAPS_API_KEY } from "@/constants/ApiKeys"

// Define types for our cross-platform map
export interface Coordinate {
  latitude: number
  longitude: number
}

export interface Marker {
  id: string
  coordinate: Coordinate
  title?: string
  description?: string
  color?: string
  custom?: boolean
  element?: React.ReactNode
}

export interface Path {
  id: string
  coordinates: Coordinate[]
  strokeColor?: string
  strokeWidth?: number
}

export interface Region {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

interface MapViewProps {
  style?: any
  initialRegion?: Region
  region?: Region
  markers?: Marker[]
  paths?: Path[]
  showsUserLocation?: boolean
  onRegionChange?: (region: Region) => void
  onPress?: (coordinate: Coordinate) => void
  onMarkerPress?: (markerId: string) => void
}

// Create a cross-platform MapView component
export default function MapView({
  style,
  initialRegion,
  region,
  markers = [],
  paths = [],
  showsUserLocation = false,
  onRegionChange,
  onPress,
  onMarkerPress,
}: MapViewProps) {
  const { isDark } = useTheme()
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: 250,
  })

  // Update dimensions on window resize (for web)
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({
        width: window.width,
        height: 250,
      })
    })

    return () => subscription.remove()
  }, [])

  // On web, we'll use a WebView with Google Maps
  if (Platform.OS === "web") {
    // Create HTML content for the Google Maps WebView
    const createMapHTML = () => {
      const center = region ||
        initialRegion || { latitude: 0, longitude: 0, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }

      // Convert markers to JS objects for the HTML
      const markersJS = markers.map((marker) => {
        return {
          id: marker.id,
          position: { lat: marker.coordinate.latitude, lng: marker.coordinate.longitude },
          title: marker.title || "",
          color: marker.color || "#FF0000",
        }
      })

      // Convert paths to JS objects for the HTML
      const pathsJS = paths.map((path) => {
        return {
          id: path.id,
          coordinates: path.coordinates.map((coord) => ({ lat: coord.latitude, lng: coord.longitude })),
          strokeColor: path.strokeColor || "#007bff",
          strokeWeight: path.strokeWidth || 4,
          strokeOpacity: 0.8,
        }
      })

      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <style>
              body, html, #map {
                height: 100%;
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            <div id="map"></div>
            <script>
              // Map initialization
              let map;
              let markers = [];
              let paths = [];
              
              function initMap() {
                map = new google.maps.Map(document.getElementById("map"), {
                  center: { lat: ${center.latitude}, lng: ${center.longitude} },
                  zoom: ${Math.log2(360 / center.latitudeDelta)},
                  disableDefaultUI: true,
                  styles: ${isDark ? JSON.stringify(darkMapStyle) : "[]"}
                });
                
                // Add markers
                const markersData = ${JSON.stringify(markersJS)};
                markersData.forEach(markerData => {
                  const marker = new google.maps.Marker({
                    position: markerData.position,
                    map: map,
                    title: markerData.title,
                    icon: markerData.color === "#4285F4" ? {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: markerData.color,
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#FFFFFF",
                      scale: 8
                    } : markerData.color === "#FF9800" ? {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: markerData.color,
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#FFFFFF",
                      scale: 8
                    } : null
                  });
                  
                  marker.addListener("click", () => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: "markerPress",
                      markerId: markerData.id
                    }));
                  });
                  
                  markers.push(marker);
                });
                
                // Add paths
                const pathsData = ${JSON.stringify(pathsJS)};
                pathsData.forEach(pathData => {
                  const path = new google.maps.Polyline({
                    path: pathData.coordinates,
                    geodesic: true,
                    strokeColor: pathData.strokeColor,
                    strokeOpacity: pathData.strokeOpacity,
                    strokeWeight: pathData.strokeWeight
                  });
                  
                  path.setMap(map);
                  paths.push(path);
                });
                
                // Add map click listener
                map.addListener("click", (e) => {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "mapPress",
                    coordinate: {
                      latitude: e.latLng.lat(),
                      longitude: e.latLng.lng()
                    }
                  }));
                });
                
                // Add region change listener
                map.addListener("idle", () => {
                  const center = map.getCenter();
                  const bounds = map.getBounds();
                  const ne = bounds.getNorthEast();
                  const sw = bounds.getSouthWest();
                  
                  const latDelta = ne.lat() - sw.lat();
                  const lngDelta = ne.lng() - sw.lng();
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "regionChange",
                    region: {
                      latitude: center.lat(),
                      longitude: center.lng(),
                      latitudeDelta: latDelta,
                      longitudeDelta: lngDelta
                    }
                  }));
                });
              }
            </script>
            <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
          </body>
        </html>
      `
    }

    // Handle messages from the WebView
    const handleMessage = (event:any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data)

        if (data.type === "mapPress" && onPress) {
          onPress(data.coordinate)
        } else if (data.type === "markerPress" && onMarkerPress) {
          onMarkerPress(data.markerId)
        } else if (data.type === "regionChange" && onRegionChange) {
          onRegionChange(data.region)
        }
      } catch (error) {
        console.error("Error parsing WebView message:", error)
      }
    }

    return (
      <View style={[styles.container, style]}>
        <WebView
          style={styles.webview}
          originWhitelist={["*"]}
          source={{ html: createMapHTML() }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0" }]}>
              <Text style={{ color: isDark ? "#fff" : "#333" }}>Loading map...</Text>
            </View>
          )}
        />
      </View>
    )
  }

  // On native platforms, we'll dynamically import react-native-maps
  try {
    // Dynamic import for native platforms
    const RNMaps = require("react-native-maps")
    const { default: RNMapView, Marker, Polyline, PROVIDER_GOOGLE } = RNMaps

    return (
      <RNMapView
        style={style}
        initialRegion={initialRegion}
        region={region}
        showsUserLocation={showsUserLocation}
        provider={PROVIDER_GOOGLE}
        onRegionChange={onRegionChange}
        onPress={(e) => onPress && onPress(e.nativeEvent.coordinate)}
        customMapStyle={isDark ? darkMapStyle : []}
      >
        {markers.map((marker) =>
          marker.custom ? (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => onMarkerPress && onMarkerPress(marker.id)}
            >
              {marker.element}
            </Marker>
          ) : (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              pinColor={marker.color}
              onPress={() => onMarkerPress && onMarkerPress(marker.id)}
            />
          ),
        )}

        {paths.map((path) => (
          <Polyline
            key={path.id}
            coordinates={path.coordinates}
            strokeColor={path.strokeColor || "#007bff"}
            strokeWidth={path.strokeWidth || 4}
          />
        ))}
      </RNMapView>
    )
  } catch (error) {
    console.warn("Failed to load react-native-maps:", error)

    // Fallback if react-native-maps fails to load
    return (
      <View style={[styles.loadingContainer, style, { backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0" }]}>
        <Text style={[styles.webMapText, { color: isDark ? "#fff" : "#333" }]}>Map Unavailable</Text>
        <Text style={[styles.webMapSubtext, { color: isDark ? "#aaa" : "#666" }]}>
          Please check your installation of react-native-maps
        </Text>
      </View>
    )
  }
}

// Dark mode style for Google Maps
const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  webMapText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  webMapSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
})
