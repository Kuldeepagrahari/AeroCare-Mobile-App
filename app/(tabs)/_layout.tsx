import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { Ionicons } from '@expo/vector-icons';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function IconSymbol({ name, size = 24, color = '#30D5C8' }:any) {
  return <Ionicons name={name} size={size} color={color} />;
}
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          marginTop:20,
          marginLeft: '5%',
          width:'90%',
          height: 60,
          right: 16,
          backgroundColor: 'white',
          borderRadius: 30,
          borderWidth: 5,

          borderColor: '#30D5C8',
          padding:"10%",
          paddingVertical: 10,
          elevation: 10, // Android shadow
          shadowColor: '#30D5C8',
          shadowOpacity: 0.5,
          shadowOffset: {width: 5, height: 5},
          shadowRadius: 10,
        },
        tabBarActiveTintColor: "#30D5C8",      // Active icon & text color
        tabBarInactiveTintColor: "#999",       // Inactive icon & text color
        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Track',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="navigate" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="command"
        options={{
          title: 'Control',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          title: 'Buy',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="cart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
