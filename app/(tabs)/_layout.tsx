import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // ❌ Hides bottom tab bar
      }}
    >
      {/* No tabs are shown here */}
    </Tabs>
  );
}
