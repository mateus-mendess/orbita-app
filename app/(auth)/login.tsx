import React, { useState } from "react";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthInput } from "../../components/(auth)/AuthInput";
import { AuthToggle } from "../../components/(auth)/AuthToggle";
import { PrimaryButton } from "../../components/shared/PrimaryButton";
import { SocialButton } from "../../components/shared/SocialButton";
// import { useAuth } from '../../hooks/useAuth'; // Placeholder, not used yet

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (isLogin) {
      console.log("Login attempt", { email, password });
      router.replace("/(tabs)");
    } else {
      console.log("Signup attempt", {
        username,
        email,
        password,
        confirmPassword,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top White Curved Card */}
        <View style={styles.topCard}>
          <Image
            source={require("../../assets/image/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />

          {!isLogin && (
            <AuthInput
              label="Name"
              iconName="person-outline"
              placeholder="Enter your name"
              value={username}
              onChangeText={setUsername}
            />
          )}

          <AuthInput
            label="Email"
            iconName="mail-outline"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            label="Password"
            iconName="lock-closed-outline"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => console.log("Forgot password clicked")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {!isLogin && (
            <AuthInput
              label="Confirm password"
              iconName="lock-closed-outline"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          )}

          <PrimaryButton
            title={isLogin ? "Login" : "Sign up"}
            onPress={handleSubmit}
          />

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.separatorLine} />
          </View>

          <View style={styles.socialContainer}>
            <SocialButton
              title="Google"
              iconName="logo-google"
              onPress={() => console.log("Google login")}
            />
            <SocialButton
              title="Apple"
              iconName="logo-apple"
              onPress={() => console.log("Apple login")}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
  },
  topCard: {
    backgroundColor: "#fff",
    height: 250,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  forgotPasswordContainer: {
    alignSelf: "center",
    marginBottom: 6,
    marginTop: 6,
  },
  forgotPasswordText: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  separatorText: {
    color: "#666",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
