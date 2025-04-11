import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await signOut(auth);
      Alert.alert("Success", "Account created successfully! Please log in.");
      navigation.navigate("SignIn");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={300}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Icon
              name="mail-outline"
              size={20}
              color="#ccc"
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#ccc"
              style={styles.icon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              style={styles.input}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#ccc"
              style={styles.icon}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInText}>
              Already have an account? <Text style={styles.link}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#ccc",
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
  },
  signUpButton: {
    backgroundColor: "#00c6ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    color: "#ccc",
  },
  link: {
    color: "#00c6ff",
    fontWeight: "bold",
  },
});
