import React, { useState, useEffect } from "react";
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
import { db } from "../services/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

export default function EditEventScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTitle(docSnap.data().title);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, { title });
      Alert.alert("Success", "Event updated successfully.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update event.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>Edit Event</Text>
          <Text style={styles.subtitle}>Update the event title below</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.formContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00c6ff" />
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Icon name="create-outline" size={20} color="#ccc" style={styles.icon} />
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Edit title"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={updating}>
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Update Event</Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
  updateButton: {
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
