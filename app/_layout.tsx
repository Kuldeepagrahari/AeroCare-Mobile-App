"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
// import { useSafeScreenProps } from "../hooks/useSafeScreenProps"

import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
// import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SafeAreaProvider } from "react-native-safe-area-context"
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <SafeAreaProvider>
    {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
      <ThemeProvider>
        <StatusBar style="auto" />
        {/* const { getSafeProps } = useSafeScreenProps() */}
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
          // getCustomScreenProps={getSafeProps}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen name="location" options={{ headerShown: false }} />
          <Stack.Screen name="booking/confirmed" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    {/* </GestureHandlerRootView> */}
    </SafeAreaProvider>
  )
}
