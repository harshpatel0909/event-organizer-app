import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function FavoriteButton({ isFavorite, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 10 }}>
      <Text style={{ fontSize: 18 }}>{isFavorite ? "💖" : "🤍"}</Text>
    </TouchableOpacity>
  );
}
