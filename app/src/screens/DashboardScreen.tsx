import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../services/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

export default function DashboardScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Load events
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!userId) return;

    const favRef = collection(db, "users", userId, "favorites");

    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const favMap: { [key: string]: boolean } = {};
      snapshot.docs.forEach((doc) => {
        favMap[doc.id] = true;
      });
      setFavorites(favMap);
    });

    return unsubscribe;
  }, [userId]);

  const handleDelete = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await deleteDoc(doc(db, "events", id));
          if (userId) {
            await deleteDoc(doc(db, "users", userId, "favorites", id));
          }
        },
      },
    ]);
  };

  const handleEdit = (id: string) => {
    navigation.navigate("EditEvent", { eventId: id });
  };

  const toggleFavorite = async (event: any) => {
    if (!userId) return;
    const favRef = doc(db, "users", userId, "favorites", event.id);
    const docSnap = await getDoc(favRef);

    if (docSnap.exists()) {
      await deleteDoc(favRef); 
    } else {
      await setDoc(favRef, {
        eventId: event.id,
        title: event.title,
        createdAt: new Date(),
      }); 
    }
  };

  const renderItem = ({ item }: any) => {
    const isFavorited = favorites[item.id];

    return (
      <Animatable.View animation="fadeInUp" duration={600} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
          >
            <Icon
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color={isFavorited ? "#ff69b4" : "#ccc"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
            <Icon name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Icon name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("CreateEvent")}>
          <View style={styles.iconCircle}>
            <Icon name="add-circle-outline" size={24} color="#00c6ff" />
          </View>
          <Text style={styles.iconButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Favorites")}>
          <View style={styles.iconCircle}>
            <Icon name="heart-outline" size={24} color="#00c6ff" />
          </View>
          <Text style={styles.iconButtonText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => signOut(auth)}>
          <View style={styles.iconCircle}>
            <Icon name="log-out-outline" size={24} color="#ff6666" />
          </View>
          <Text style={styles.iconButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <Text style={styles.sectionSubtitle}>Tap the icons to manage each event</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#00c6ff" size="large" />
      ) : events.length === 0 ? (
        <Text style={styles.noEventsText}>No events found.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconButton: {
    alignItems: "center",
  },
  iconCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 6,
  },
  iconButtonText: {
    color: "#ccc",
    fontSize: 12,
  },
  middleSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: "#ccc",
    fontSize: 14,
  },
  eventCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#00c6ff",
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  noEventsText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
