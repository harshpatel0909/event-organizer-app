import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import moment from "moment";

export default function FavoriteEventsScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const favRef = collection(db, "users", userId, "favorites");

    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        formattedDate: moment(doc.data().date).format("MMM D, YYYY h:mm A"),
      }));
      setFavorites(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const handleRemoveFromFavorites = async (id: string) => {
    Alert.alert(
      "Remove from Favorites", 
      "Are you sure you want to remove this event from your favorites?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              if (userId) {
                await deleteDoc(doc(db, "users", userId, "favorites", id));
              }
            } catch (error) {
              console.error("Error removing from favorites:", error);
              Alert.alert(
                "Error", 
                "Failed to remove from favorites. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <Animatable.View animation="fadeInUp" duration={600} style={styles.eventCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.dateRow}>
          <Icon name="calendar-outline" size={14} color="#aaa" />
          <Text style={styles.eventDate}>{item.formattedDate}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <View style={styles.iconStatic}>
          <Icon name="heart" size={20} color="#fff" />
        </View>
        <TouchableOpacity
          style={[styles.iconButton, styles.deleteButton]}
          onPress={() => handleRemoveFromFavorites(item.id)}
        >
          <Icon name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <Text style={styles.header}>❤️ Favorite Events</Text>

      {loading ? (
        <ActivityIndicator color="#00c6ff" size="large" />
      ) : favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite events yet.</Text>
      ) : (
        <FlatList
          data={favorites}
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
  header: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  eventCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDescription: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  eventDate: {
    color: "#aaa",
    fontSize: 13,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    alignSelf: "flex-start",
    gap: 8,
  },
  iconStatic: {
    backgroundColor: "#ff69b4",
    padding: 10,
    borderRadius: 50,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },
  noFavoritesText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});