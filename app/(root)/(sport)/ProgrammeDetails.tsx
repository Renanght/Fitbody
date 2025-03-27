import React from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import icons from "@/constants/icons";

const ProgrammeDetails = () => {
  const router = useRouter();
  const { id, title, content, date } = useLocalSearchParams();

  return (
    <SafeAreaView className="bg-primary-300 flex-1">
      {/* Header avec flèche retour mirroirée */}
      <View className="flex-row items-center px-5 pb-3 pt-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Image 
            source={icons.rightArrow} 
            className="w-6 h-6 mr-4"
            style={{ transform: [{ scaleX: -1 }] }} // Miroir horizontal
          />
        </TouchableOpacity>
        <Text className="text-primary-200 font-bold text-2xl">{title}</Text>
      </View>

      {/* Contenu du programme */}
      <ScrollView className="flex-1 px-5 pt-4">
        <View className="bg-white/5 rounded-lg p-5 mb-4">
          <Text className="text-gray-400 text-sm mb-2">
            Créé le: {new Date(date).toLocaleDateString()}
          </Text>
          
          <Text className="text-white text-lg whitespace-pre-line">
            {content}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#B3A0FF] rounded-lg p-4 items-center mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProgrammeDetails;