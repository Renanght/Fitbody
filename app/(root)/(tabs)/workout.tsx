import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import Swiper from "react-native-swiper";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

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
        if (!token) throw new Error("Aucun token JWT trouvé !");

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const exerciseData = response.data.exercises || response.data;
        if (!exerciseData?.length) throw new Error("Aucun exercice trouvé");

        setExercises(exerciseData);
      } catch (error) {
        console.error("Erreur API:", error);
        Alert.alert("Erreur", error.response?.data?.detail || error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-300">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-300 p-4">
        <Text className="text-white text-center text-lg">
          Impossible de charger les exercices
        </Text>
      </SafeAreaView>
    );
  }

  const categories = exercises.reduce((acc, exo) => {
    acc[exo.muscle_group] = acc[exo.muscle_group] || [];
    acc[exo.muscle_group].push(exo);
    return acc;
  }, {});

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-primary-300">
        <ScrollView 
          className="px-4" 
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mt-4 mb-4">
            <Text className="text-primary-200 font-bold text-3xl">Exercices</Text>
            <Image source={icons.search} className="w-6 h-6" />
          </View>

          {/* Favoris */}
          <TouchableOpacity 
            className="flex-row items-center justify-between mb-6 px-4 py-3 bg-white/5 rounded-lg border border-white/10"
            onPress={() => router.push('/(sport)/ExercicesFavoris')}
          >
            <Text className="text-lg font-medium text-white">Favoris</Text>
            <Image source={icons.stars} className="size-5" />
          </TouchableOpacity>

          {/* Catégories d'exercices */}
          {Object.entries(categories).map(([categorie, items]) => (
            <View key={categorie} className="mb-8">
              {/* Titre de catégorie */}
              <Text className="text-white text-xl font-bold mb-3">
                {categorie}
              </Text>
              
              {/* Swiper des exercices */}
              <Swiper
                height={280}
                showsPagination={false}
                loop={false}
                containerStyle={{ marginHorizontal: -10 }}
              >
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.exercise_id}
                    className="bg-white mx-2 rounded-lg overflow-hidden"
                    style={{ height: 270 }}
                    onPress={() => router.push({
                      pathname: '/(sport)/ExerciceDetails',
                      params: { 
                        imageUrl: item.image,
                        title: item.name,
                        description: item.description,
                        difficulty: item.difficulty,
                        muscleGroup: item.muscle_group
                      }
                    })}
                  >
                    {/* Image de l'exercice */}
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-40"
                      resizeMode="cover"
                    />
                    
                    {/* Contenu texte */}
                    <View className="p-4">
                      {/* Titre de l'exercice */}
                      <Text className="text-gray-900 font-bold text-lg mb-1">
                        {item.name}
                      </Text>
                      
                      {/* Métadonnées */}
                      <View className="flex-row items-center mb-2">
                        <Text className="text-primary-300 text-sm font-medium">
                          {item.difficulty}
                        </Text>
                        <Text className="text-gray-300 mx-2">|</Text>
                        <Text className="text-gray-600 text-sm">
                          {item.muscle_group}
                        </Text>
                      </View>
                      
                      {/* Description */}
                      <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
                        {item.description}
                      </Text>
                      
                      {/* Séparateur et CTA */}
                      <View className="border-t border-gray-200 pt-3">
                        <Text className="text-primary-300 text-xs font-medium">
                          Voir les détails →
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </Swiper>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Workout;