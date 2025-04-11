"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native"
import { router } from "expo-router"
import { Feather } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"

export default function RegisterScreen() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    terms: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", username: "", password: "", terms: "" }

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!username) {
      newErrors.username = "Username is required"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must accept the Terms of Service"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleRegister = () => {
    if (validateForm()) {
      // In a real app, you would register the user here
      router.replace("/onboarding")
    }
  }

  const handleLogin = () => {
    router.push("/auth/login")
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Image source={require("@/assets/drone-logo.png")} style={styles.logo} />
        <Text style={styles.titleText}>Create your new account</Text>
        <Text style={styles.subtitleText}>Create an account to start looking for the food you like</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="youremail@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.inputLabel}>User Name</Text>
        <TextInput
          style={[styles.input, errors.username ? styles.inputError : null]}
          placeholder="Your name"
          value={username}
          onChangeText={setUsername}
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

        <Text style={styles.inputLabel}>Password</Text>
        <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#666" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <View style={styles.termsContainer}>
          <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeToTerms(!agreeToTerms)}>
            {agreeToTerms && <Feather name="check" size={16} color="#30D5C8" />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I Agree with <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
        {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

        <TouchableOpacity
          style={[styles.registerButton, !agreeToTerms && styles.disabledButton]}
          onPress={handleRegister}
          disabled={!agreeToTerms}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or sign in with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require("@/assets/google-icon.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require("@/assets/facebook-icon.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require("@/assets/apple-icon.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.haveAccountText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
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
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#30D5C8",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    flex: 1,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  termsLink: {
    color: "#30D5C8",
    fontFamily: "Inter-Medium",
  },
  registerButton: {
    backgroundColor: "#30D5C8",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
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
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
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
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  haveAccountText: {
    color: "#666",
    fontFamily: "Inter-Regular",
  },
  loginText: {
    color: "#30D5C8",
    fontWeight: "bold",
    fontFamily: "Inter-Medium",
  },
})
