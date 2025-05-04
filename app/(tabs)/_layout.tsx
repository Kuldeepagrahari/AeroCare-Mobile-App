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
          bottom: 5,
          marginTop:20,
          marginLeft: '2.5%',
          width:'95%',
          height: 60,
          right: 16,
          backgroundColor: "white",
          borderRadius: 20,
          borderWidth: 5,
          borderTopWidth:4,

          borderColor: '#30D5C8',
          padding:"10%",
          paddingVertical: 10,
          elevation: 10, // Android shadow
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowOffset: {width: 0, height: 5},
          shadowRadius: 10,
        },
        tabBarActiveTintColor: "black",      // Active icon & text color
        tabBarInactiveTintColor: "gray",       // Inactive icon & text color
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
        name="command"
        options={{
          title: 'Control',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="settings" color={color} />
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
