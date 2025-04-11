import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

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
      }));
      setFavorites(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const handleUnfavorite = async (id: string) => {
    if (!userId) return;

    const favRef = doc(db, "users", userId, "favorites", id);
    await deleteDoc(favRef);
  };

  const renderItem = ({ item }: any) => (
    <Animatable.View animation="fadeInUp" duration={600} style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleUnfavorite(item.id)}
      >
        <Icon name="heart" size={22} color="#fff" />
      </TouchableOpacity>
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  eventTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  favoriteButton: {
    backgroundColor: "#ff69b4",
    padding: 10,
    borderRadius: 50,
    marginLeft: 12,
  },
  noFavoritesText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
