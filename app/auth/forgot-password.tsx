"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import BottomNavigation from "@/components/BottomNavigation"
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = () => {
    if (validateEmail()) {
      // In a real app, you would send a password reset email here
      setIsSubmitted(true)
    }
  }

  const handleBackToLogin = () => {
    router.push("/auth/login")
  }

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.contentContainer}>
          <Image source={require("../../assets/email-sent.png")} style={styles.emailSentImage} />
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successMessage}>
            We've sent a password reset link to {email}. Please check your inbox.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backArrow} onPress={handleBackToLogin}>
        <Image source={require("../../assets/back-arrow.png")} style={styles.backArrowIcon} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={require("../../assets/drone-logo.png")} style={styles.logo} />
        <Text style={styles.titleText}>Forgot Password?</Text>
        <Text style={styles.subtitleText}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLoginButton} onPress={handleBackToLogin}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    flex: 1,
    justifyContent: "center",
  },
  backArrow: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backArrowIcon: {
    width: 24,
    height: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Inter-Bold",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontFamily: "Inter-Medium",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#ff4d4f",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  submitButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  backToLoginButton: {
    padding: 15,
    alignItems: "center",
  },
  backToLoginText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  emailSentImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#30D5C8",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Inter-Bold",
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Inter-Regular",
  },
  backButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})
