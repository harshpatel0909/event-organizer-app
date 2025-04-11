import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EditEventScreen from "../screens/EditEventScreen";
import FavoriteEventsScreen from "../screens/FavoriteEventsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#0f2027" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerBackTitleVisible: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: "Create Event" }} />
          <Stack.Screen name="EditEvent" component={EditEventScreen} options={{ title: "Edit Event" }} />
          <Stack.Screen name="Favorites" component={FavoriteEventsScreen} options={{ title: "Favorite Events" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In", headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
        </>
      )}
    </Stack.Navigator>
  );
}
