import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Link } from "expo-router";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          router.replace('/(root)/(tabs)');
        }
      } catch (error) {
        console.error("Erreur vérification token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    console.log('Tentative de connexion avec :');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    try {
      const response = await fetch('http://10.19.4.2:8001/login', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${username}:${password}`),
          'Content-Type': 'application/json',
        },
      });

      console.log(`Statut réponse: ${response.status}`);

      if (response.status === 200) {
        const data = await response.json();
        const token = data.access_token;

        if (!token) {
          console.error('Token non reçu');
          Alert.alert('Erreur', 'Token non reçu du serveur.');
          return;
        }

        await SecureStore.setItemAsync('userToken', token);
        console.log('JWT stocké');

        Alert.alert('Succès', 'Connexion réussie!');
        router.replace('/(root)/(tabs)'); // Redirection avec replace
      } else {
        const errorData = await response.json();
        console.log('Erreur connexion:', errorData);
        Alert.alert('Erreur', errorData.message || 'Identifiants invalides.');
      }
    } catch (error) {
      console.error('Erreur tentative connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Réessayez plus tard.');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-primary-300 flex items-center">
      <Text className="font-bold font-rubik text-secondary mt-10 text-4xl text-center">Log In</Text>
      <Text className="text-white mt-20 text-xl font-rubik">Bienvenue</Text>
      <Text className="text-center text-white font-rubik mt-3">
        Rejoignez FitBody et dépassez vos limites,{"\n"}chaque jour vous rapproche de vos objectifs !
      </Text>
      <View className="w-full bg-terciary mt-20">
        <View className="mx-20">
          <Text className="font-rubik pl-2 pt-5 pb-1">Username or Email</Text>
          <TextInput
            className="w-80 bg-white rounded-2xl pl-4"
            placeholder="email@example.com"
            placeholderTextColor="#232323"
            value={username}
            onChangeText={(text) => {
              console.log(`Username modifié : ${text}`);
              setUsername(text);
            }}
          />
          <Text className="font-rubik pt-5 pb-1 pl-2">Password</Text>
          <View className="w-80 bg-white rounded-2xl flex-row items-center">
            <TextInput
              className="flex-1 pl-4"
              placeholder="************"
              placeholderTextColor="#232323"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={(text) => {
                console.log('Mot de passe modifié');
                setPassword(text);
              }}
            />
            <TouchableOpacity
              className="pr-4"
              onPress={() => {
                setIsPasswordVisible(!isPasswordVisible);
                console.log(`Visibilité du mot de passe : ${!isPasswordVisible ? 'Visible' : 'Masqué'}`);
              }}
            >
              <Text>{isPasswordVisible ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          <View className="w-80 flex-row justify-end mt-1 mb-5">
            <TouchableOpacity>
              <Text className="text-sm">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View>
        <TouchableOpacity onPress={handleLogin}>
          <Text className="text-white font-rubik-bold text-2xl mt-16 py-3 px-20 bg-primary-100 rounded-full border-solid border-primary-200 border-2">
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-0 w-full flex items-center mb-8 px-12">
        <View className="flex-row items-center">
          <Text className="text-white">Don't have an account?{' '}</Text>
          <TouchableOpacity>
            <Link href={'/(auth)/sign-up'}>
            <Text className="text-secondary">Sign Up</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;