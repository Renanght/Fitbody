import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import Swiper from "react-native-swiper";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const API_URL = "http://10.19.4.2:8001/exercises";

const Workout = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        console.log("🔑 Token récupéré :", token);

        if (!token) {
          throw new Error("Aucun token JWT trouvé !");
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Réponse API :", response.data);

        const exerciseData = response.data.exercises || response.data;
        
        if (!exerciseData || exerciseData.length === 0) {
          throw new Error("Aucun exercice trouvé");
        }

        setExercises(exerciseData);
      } catch (error) {
        console.error("❌ Erreur API :", error.response?.data || error.message);
        
        Alert.alert(
          "Erreur de chargement",
          error.response?.data?.detail || error.message || "Erreur inconnue"
        );
        
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <GestureHandlerRootView className="flex-1 justify-center items-center bg-primary-300">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Chargement des exercices...</Text>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView className="flex-1 justify-center items-center bg-primary-300 p-4">
        <Text className="text-white text-center text-lg">
          Impossible de charger les exercices. Vérifiez votre connexion.
        </Text>
      </GestureHandlerRootView>
    );
  }

  // Regrouper les exercices par groupe musculaire
  const categories = exercises.reduce((acc, exo) => {
    acc[exo.muscle_group] = acc[exo.muscle_group] || [];
    acc[exo.muscle_group].push(exo);
    return acc;
  }, {});

  return (
    <GestureHandlerRootView className="flex-1 bg-primary-300">
      <ScrollView className="px-4 pt-4">
        <Text className="text-white text-2xl font-bold mb-4">💪 Exercices</Text>

        {Object.keys(categories).map((categorie, index) => (
          <View key={categorie} className={`mb-4 ${index === Object.keys(categories).length - 1 ? 'mb-0' : ''}`}>
            <Text className="text-white text-xl font-semibold mb-2">{categorie}</Text>
            <Swiper
              style={{ height: 350 }}
              showsPagination={false}
              loop={true}
            >
              {categories[categorie].map((item) => (
                <TouchableOpacity 
                  key={item.exercise_id} 
                  className="bg-gray-200 p-4 rounded-xl shadow-lg mx-2 items-center"
                  onPress={() => router.push({
                    pathname: '/(sport)/ExerciceDetails',
                    params: {
                      imageUrl: item.image,
                      title: item.name
                    }
                  })}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-40 rounded-lg"
                    resizeMode="cover"
                  />
                  <Text className="text-gray-800 text-lg mt-2 font-semibold text-center">
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 text-sm text-center mt-1">
                    {item.difficulty} | {item.muscle_group}
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-2">
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Workout;