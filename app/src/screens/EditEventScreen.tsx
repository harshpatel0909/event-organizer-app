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
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "../services/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditEventScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setDate(new Date(data.date));
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
    if (!title.trim() || !description.trim() || !date) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }

    setUpdating(true);
    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, {
        title,
        description,
        date: date.toISOString(),
        updatedAt: new Date().toISOString(),
      });
      Alert.alert("Success", "Event updated successfully.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update event.");
    } finally {
      setUpdating(false);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(date!.getHours());
      newDate.setMinutes(date!.getMinutes());
      setDate(newDate);
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(date!);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inner}
        >
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <Text style={styles.title}>Edit Event</Text>
            <Text style={styles.subtitle}>Update your event details</Text>
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

                <View style={[styles.inputContainer, { alignItems: "flex-start" }]}>
                  <Icon name="document-text-outline" size={20} color="#ccc" style={[styles.icon, { marginTop: 8 }]} />
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Edit description"
                    placeholderTextColor="#ccc"
                    multiline
                    textAlignVertical="top"
                    numberOfLines={3}
                    style={[styles.input, { height: 60 }]}
                  />
                </View>

                <View style={styles.dateTimeContainer}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Icon name="calendar-outline" size={18} color="#ccc" style={styles.icon} />
                    <Text style={styles.dateTimeText}>
                      {date?.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Icon name="time-outline" size={18} color="#ccc" style={styles.icon} />
                    <Text style={styles.dateTimeText}>
                      {date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                    is24Hour={true}
                  />
                )}

                <TouchableOpacity
                  style={[styles.updateButton, updating && { opacity: 0.7 }]}
                  onPress={handleUpdate}
                  disabled={updating}
                >
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
      </TouchableWithoutFeedback>
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
    marginBottom: 30,
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  dateTimeText: {
    color: '#fff',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: "#00c6ff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
