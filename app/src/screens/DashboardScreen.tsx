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
import moment from "moment";

export default function DashboardScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const eventRef = collection(db, "users", userId, "events");
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        formattedDate: moment(doc.data().date).format("MMM D, YYYY h:mm A"),
      }));
      setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

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
          if (!userId) return;
          await deleteDoc(doc(db, "users", userId, "events", id));
          await deleteDoc(doc(db, "users", userId, "favorites", id));
        },
      },
    ]);
  };

  const handleEdit = (id: string) => {
    navigation.navigate("EditEvent", { eventId: id });
  };

  const toggleFavorite = async (event: any) => {
    if (!userId || !event?.id) {
      Alert.alert("Error", "Unable to update favorites. Please sign in again.");
      return;
    }

    setFavoriteLoadingId(event.id);

    try {
      const favRef = doc(db, "users", userId, "favorites", event.id);
      const docSnap = await getDoc(favRef);

      if (docSnap.exists()) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          eventId: event.id,
          title: event.title || "",
          date: event.date || "",
          description: event.description || "",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while updating favorites.");
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const renderItem = ({ item }: any) => {
    const isFavorited = favorites[item.id];

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={styles.eventCard}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
            disabled={favoriteLoadingId === item.id}
          >
            {favoriteLoadingId === item.id ? (
              <ActivityIndicator size="small" color="#ff69b4" />
            ) : (
              <Icon
                name={isFavorited ? "heart" : "heart-outline"}
                size={20}
                color={isFavorited ? "#ff69b4" : "#ccc"}
              />
            )}
          </TouchableOpacity>
        </View>

        {item.description && (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.eventFooter}>
          <View style={styles.dateContainer}>
            <Icon name="calendar-outline" size={14} color="#aaa" />
            <Text style={styles.eventDate}>{item.formattedDate}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item.id)}
            >
              <Icon name="pencil-outline" size={16} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Icon name="trash-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <View style={styles.iconCircle}>
            <Icon name="add-circle-outline" size={24} color="#00c6ff" />
          </View>
          <Text style={styles.iconButtonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Favorites")}
        >
          <View style={styles.iconCircle}>
            <Icon name="heart-outline" size={24} color="#00c6ff" />
          </View>
          <Text style={styles.iconButtonText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => signOut(auth)}
        >
          <View style={styles.iconCircle}>
            <Icon name="log-out-outline" size={24} color="#ff6666" />
          </View>
          <Text style={styles.iconButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        <Text style={styles.sectionSubtitle}>
          Tap the icons to manage each event
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#00c6ff" size="large" />
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-outline" size={48} color="#aaa" />
          <Text style={styles.noEventsText}>No events found</Text>
          <Text style={styles.noEventsSubtext}>
            Tap the + button to create your first event
          </Text>
        </View>
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconButton: { alignItems: "center", width: 80 },
  iconCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 6,
  },
  iconButtonText: { color: "#ccc", fontSize: 12 },
  middleSection: { marginBottom: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: { color: "#aaa", fontSize: 14 },
  eventCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: { color: "#fff", fontSize: 16, fontWeight: "600", flex: 1 },
  eventDescription: { color: "#ddd", fontSize: 14, marginBottom: 12 },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: { flexDirection: "row", alignItems: "center" },
  eventDate: { color: "#aaa", fontSize: 13, marginLeft: 6 },
  favoriteButton: { padding: 6 },
  actionButtons: { flexDirection: "row", gap: 8 },
  editButton: {
    backgroundColor: "#00c6ff",
    padding: 8,
    borderRadius: 8,
    width: 36,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 8,
    width: 36,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  noEventsText: {
    color: "#ccc",
    fontSize: 18,
    marginTop: 16,
    fontWeight: "500",
  },
  noEventsSubtext: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
