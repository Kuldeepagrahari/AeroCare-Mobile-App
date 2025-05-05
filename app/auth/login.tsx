"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useTheme } from "@/components/ThemeProvider"
import { Ionicons } from "@expo/vector-icons"
import BottomNavigation from "@/components/BottomNavigation"
export default function LoginScreen() {
  // const { isDark } = useTheme()
  const isDark = false
  const backgroundColor = isDark ? "#121212" : "#fff"
  const textColor = isDark ? "#fff" : "#333"
  const inputBackgroundColor = isDark ? "#2a2a2a" : "#f5f5f5"
  const placeholderColor = isDark ? "#777" : "#999"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = () => {
    if (validateForm()) {
      // In a real app, you would authenticate here
      router.replace("/onboarding")
    }
  }

  const handleRegister = () => {
    router.push("/auth/register")
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={styles.contentContainer}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/drone-logo.png")} style={styles.logo} resizeMode="cover"/>
        <Text style={[styles.welcomeText, { color: "#30D5C8" }]}>Welcome!</Text>
        <Text style={[styles.subtitleText, { color: isDark ? "#aaa" : "#666" }]}>
          Hello, please sign in to continue!
        </Text>
        <Text style={[styles.orText, { color: isDark ? "#aaa" : "#666" }]}>
          Or{" "}
          <Text style={styles.createAccountText} onPress={handleRegister}>
            Create new account
          </Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.inputLabel, { color: textColor }]}>Email Address</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackgroundColor, color: textColor },
            errors.email ? styles.inputError : null,
          ]}
          placeholder="Enter Email"
          placeholderTextColor={placeholderColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={[styles.inputLabel, { color: textColor }]}>Password</Text>
        <View
          style={[
            styles.passwordContainer,
            { backgroundColor: inputBackgroundColor },
            errors.password ? styles.inputError : null,
          ]}
        >
          <TextInput
            style={[styles.passwordInput, { color: textColor }]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color={isDark ? "#aaa" : "#666"} />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "#ddd" }]} />
          <Text style={[styles.dividerText, { color: isDark ? "#aaa" : "#666" }]}>Or sign in with</Text>
          <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "#ddd" }]} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={[styles.socialButton, { borderColor: isDark ? "#333" : "#ddd" }]}>
            <Ionicons name="logo-google" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { borderColor: isDark ? "#333" : "#ddd" }]}>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { borderColor: isDark ? "#333" : "#ddd" }]}>
            <Ionicons name="logo-apple" size={24} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={[styles.noAccountText, { color: isDark ? "#aaa" : "#666" }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: "Inter-Bold",
  },
  subtitleText: {
    fontSize: 16,
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },
  orText: {
    fontSize: 16,
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },
  createAccountText: {
    color: "#30D5C8",
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Inter-Medium",
  },
  input: {
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
  passwordContainer: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordText: {
    color: "#30D5C8",
    textAlign: "right",
    marginBottom: 20,
    fontFamily: "Inter-Medium",
  },
  signInButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontFamily: "Inter-Regular",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  noAccountText: {
    fontFamily: "Inter-Regular",
  },
  registerText: {
    color: "#30D5C8",
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})
