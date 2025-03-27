import { View, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

import icons from '@/constants/icons';

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: any; title: string }) => (
  <View className="flex items-center mt-3">
    <Image
      source={icon}
      className="w-6 h-6"
      style={{ tintColor: focused ? '#E2F163' : '#666876' }}
      resizeMode="contain"
    />
    <Text
      className={`text-xs text-center mt-1 ${
        focused ? 'text-[#E2F163] font-semibold' : 'text-[#666876] font-normal'
      }`}
    >
      {title}
    </Text>
  </View>
);

const TabLayout = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    router.replace('/sign-in');
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        animation: 'fade',
        tabBarStyle: {
          backgroundColor: '#B3A0FF',
          borderTopColor: '#0061FF1A',
          borderTopWidth: 1,
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.dumbell} focused={focused} title="Workout" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.progress} focused={focused} title="Progress" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.person} focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;