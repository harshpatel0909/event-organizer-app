import React from "react";
import { View, Text, Button } from "react-native";

export default function EventCard({ event, onDelete, onEdit, onFavorite }: any) {
  return (
    <View style={{ marginVertical: 10, padding: 15, backgroundColor: "#eee", borderRadius: 8 }}>
      <Text style={{ fontSize: 16 }}>{event.title}</Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} />
        <Button title="❤️" onPress={onFavorite} />
      </View>
    </View>
  );
}
