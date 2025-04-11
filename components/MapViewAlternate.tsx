"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Platform } from "react-native"
import { WebView } from "react-native-webview"
import { GOOGLE_MAPS_API_KEY } from "@/constants/ApiKeys"

// Define types for our map component
interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  title?: string
  color?: string
}

interface MapPath {
  id: string
  coordinates: Array<{
    lat: number
    lng: number
  }>
  strokeColor?: string
  strokeWidth?: number
}

interface MapViewAlternativeProps {
  style?: any
  center: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }
  markers?: MapMarker[]
  paths?: MapPath[]
  isDark?: boolean
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void
}

export default function MapViewAlternative({
  style,
  center,
  markers = [],
  paths = [],
  isDark = false,
  onMapPress,
}: MapViewAlternativeProps) {
  const webViewRef = useRef<WebView>(null)

  // Update map when center changes
  useEffect(() => {
    if (webViewRef.current && Platform.OS === "web") {
      const updateMapCenter = `
        if (window.map) {
          window.map.setCenter({ lat: ${center.latitude}, lng: ${center.longitude} });
        }
      `
      webViewRef.current.injectJavaScript(updateMapCenter)
    }
  }, [center])

  // Update markers when they change
  useEffect(() => {
    if (webViewRef.current && Platform.OS === "web") {
      const updateMarkers = `
        if (window.map && window.markers) {
          // Clear existing markers
          window.markers.forEach(marker => marker.setMap(null));
          window.markers = [];
          
          // Add new markers
          const markersData = ${JSON.stringify(markers)};
          markersData.forEach(markerData => {
            const marker = new google.maps.Marker({
              position: markerData.position,
              map: window.map,
              title: markerData.title || "",
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
            
            window.markers.push(marker);
          });
        }
      `
      webViewRef.current.injectJavaScript(updateMarkers)
    }
  }, [markers])

  // Update paths when they change
  useEffect(() => {
    if (webViewRef.current && Platform.OS === "web") {
      const updatePaths = `
        if (window.map && window.paths) {
          // Clear existing paths
          window.paths.forEach(path => path.setMap(null));
          window.paths = [];
          
          // Add new paths
          const pathsData = ${JSON.stringify(paths)};
          pathsData.forEach(pathData => {
            const path = new google.maps.Polyline({
              path: pathData.coordinates,
              geodesic: true,
              strokeColor: pathData.strokeColor || "#007bff",
              strokeOpacity: 0.8,
              strokeWeight: pathData.strokeWidth || 4
            });
            
            path.setMap(window.map);
            window.paths.push(path);
          });
        }
      `
      webViewRef.current.injectJavaScript(updatePaths)
    }
  }, [paths])

  // Create HTML content for the Google Maps WebView
  const createMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scal able=no" />
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
              
              window.map = map;
              window.markers = markers;
              window.paths = paths;
              
              // Add markers
              const markersData = ${JSON.stringify(markers)};
              markersData.forEach(markerData => {
                const marker = new google.maps.Marker({
                  position: markerData.position,
                  map: map,
                  title: markerData.title || "",
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
              const pathsData = ${JSON.stringify(paths)};
              pathsData.forEach(pathData => {
                const path = new google.maps.Polyline({
                  path: pathData.coordinates,
                  geodesic: true,
                  strokeColor: pathData.strokeColor || "#007bff",
                  strokeOpacity: 0.8,
                  strokeWeight: pathData.strokeWidth || 4
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
            }
          </script>
          <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
        </body>
      </html>
    `
  }

  // Handle messages from the WebView
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)

      if (data.type === "mapPress" && onMapPress) {
        onMapPress(data.coordinate)
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error)
    }
  }

  // For Android, we'll use a WebView with Google Maps
  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
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
})
