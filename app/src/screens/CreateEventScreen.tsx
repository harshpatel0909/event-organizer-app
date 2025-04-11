import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEvent = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Event title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title,
      });
      Alert.alert("Success", "Event created successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.inner}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>Create Event</Text>
          <Text style={styles.subtitle}>Add a new event below</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={300} style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="calendar-outline" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              placeholder="Event Title"
              placeholderTextColor="#ccc"
              style={styles.input}
              onChangeText={setTitle}
              value={title}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleAddEvent} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Event</Text>
            )}
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
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
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
  saveButton: {
    backgroundColor: "#00c6ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
