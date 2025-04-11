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
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import moment from "moment";

export default function CreateEventScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddEvent = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Authentication Error", "You must be logged in.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert("Validation", "Please enter title and description.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "users", userId, "events"), {
        title,
        description,
        date: date.toISOString(),
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Event created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      setDate(newDate);
    }
  };

  const formatDate = (date: Date) => moment(date).format("MMM D, YYYY h:mm A");

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inner}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Animatable.View animation="fadeInDown" style={styles.header}>
              <Text style={styles.title}>Create New Event</Text>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              delay={300}
              style={styles.formContainer}
            >
              <View style={styles.inputContainer}>
                <Icon
                  name="calendar-outline"
                  size={20}
                  color="#aaa"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Event Title *"
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  onChangeText={setTitle}
                  value={title}
                />
              </View>

              <View
                style={[styles.inputContainer, { alignItems: "flex-start" }]}
              >
                <Icon
                  name="document-text-outline"
                  size={20}
                  color="#aaa"
                  style={[styles.icon, { marginTop: 8 }]}
                />
                <TextInput
                  placeholder="Event Description *"
                  placeholderTextColor="#aaa"
                  style={[
                    styles.input,
                    { height: 80, textAlignVertical: "top" },
                  ]}
                  onChangeText={setDescription}
                  value={description}
                  multiline
                />
              </View>

              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateTimeButton}
                >
                  <Icon
                    name="calendar-outline"
                    size={18}
                    color="#aaa"
                    style={styles.icon}
                  />
                  <Text style={styles.dateTimeText}>
                    {date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={styles.dateTimeButton}
                >
                  <Icon
                    name="time-outline"
                    size={18}
                    color="#aaa"
                    style={styles.icon}
                  />
                  <Text style={styles.dateTimeText}>
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.selectedDateTime}>{formatDate(date)}</Text>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={onChangeTime}
                  is24Hour={true}
                />
              )}

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleAddEvent}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon
                      name="save-outline"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.buttonText}>Save Event</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  inner: { flex: 1 },
  scrollContainer: { paddingBottom: 20 },
  header: { marginBottom: 20, alignItems: "center" },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  formContainer: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 16,
    borderRadius: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#444",
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingVertical: 6,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#fff", fontSize: 15 },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  dateTimeText: { color: "#fff", fontSize: 14 },
  selectedDateTime: {
    color: "#00c6ff",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: "#00c6ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
