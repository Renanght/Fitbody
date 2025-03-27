import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { settings } from '@/constants/data';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface SettingsItemsProps {
  icon: ImageSourcePropType;
  title: string;
  onPress: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemsProps) => (
  <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
    <View className='flex flex-row items-center gap-3'>
      <Image source={icon} className='size-6' />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className='size-5' />}
  </TouchableOpacity>
);

const Profile = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      console.log('Token supprimé');
      router.replace('/sign-in');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      Alert.alert("Erreur", "Erreur lors de la déconnexion. Veuillez réessayer.");
    }
  };

  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <Image source={icons.bell} className='size-5' />
        </View>

        <View className='flex-row justify-center flex mt-5'>
          <View className='flex flex-col items-center relative mt-5'>
            <Image source={images.avatar} className='size-44 rounded-full relative' />
            <TouchableOpacity className='absolute bottom-11 right-2'>
              <Image source={icons.edit} className='size-9' />
            </TouchableOpacity>
            <Text className='text-2xl font-rubik-bold mt-2'>Renan GOHAUT</Text>
          </View>
        </View>

        <View className='flex flex-col mt-10'>
          <SettingsItem icon={icons.calendar} title='My Bookings' onPress={() => {
            // Naviguer vers la page "My Bookings"
            router.push("/my-bookings"); // Exemple: utilisez le nom de votre route
          }} />
          <SettingsItem icon={icons.wallet} title='Payments' onPress={() => {
            // Naviguer vers la page "Payments"
            router.push("/payments"); // Exemple: utilisez le nom de votre route
          }} />
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          {settings.slice(2).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              onPress={() => {
                // Gérer la navigation pour les autres éléments de settings
                if (item.title === "Notifications") {
                  router.push("/notifications");
                } else if (item.title === "Privacy") {
                  router.push("/privacy");
                }
                else if (item.title === "Profile") {
                  router.push("/(root)/(settings)/descprofile");
                }
              }}
            />
          ))}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          <SettingsItem
            icon={icons.logout}
            title='Logout'
            textStyle='text-danger'
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;