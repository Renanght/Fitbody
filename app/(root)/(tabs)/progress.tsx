import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import icons from "@/constants/icons";

const cardData = [
  { title: "Poids", value: "68.3", unit: "Kg", chartType: "line", data: [70, 69, 68.5, 68, 68.3] },
  { title: "Calories brûlées", value: "314", unit: "Kcal", chartType: "bar", data: [300, 320, 310, 290, 314] },
  { title: "IMC", value: "22.5", unit: "", chartType: "line", data: [23, 22.8, 22.6, 22.4, 22.5] },
];

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(255, 153, 0, ${opacity})`,
  strokeWidth: 2,
};

const renderChart = (type, data) => {
  if (type === "line") {
    return (
      <LineChart
        data={{ labels: ["", "", "", "", ""], datasets: [{ data }] }}
        width={120}
        height={50}
        chartConfig={chartConfig}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
      />
    );
  } else if (type === "bar") {
    return (
      <BarChart
        data={{ labels: ["", "", "", "", ""], datasets: [{ data }] }}
        width={120}
        height={50}
        chartConfig={chartConfig}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        showBarTops={false}
      />
    );
  }
};

const Progress = () => {
  const [selectedSegment, setSelectedSegment] = useState("mesDonnees");
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch training programs
  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        Alert.alert("Erreur", "Vous devez être connecté pour voir vos programmes");
        return;
      }
      
      const response = await fetch("http://10.19.4.2:8001/ProgrammesPerso", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProgrammes(data);
      } else {
        console.error("Error fetching programmes:", response.status);
        Alert.alert("Erreur", "Impossible de récupérer vos programmes");
      }
    } catch (error) {
      console.error("Error fetching programmes:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la récupération de vos programmes");
    } finally {
      setLoading(false);
    }
  };

  // Create new program and navigate
  const handleNewProgram = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        Alert.alert("Erreur", "Vous devez être connecté pour créer un programme");
        return;
      }
      
      // Send the POST request first
      const response = await fetch("https://sport-coach-api.lab.rioc.fr/ProgrammePerso", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Add your payload here if needed
        }),
      });
      
      if (response.ok) {
        // Success alert instead of navigation
        Alert.alert("Succès", "Programme créé avec succès");
        // Refresh the programs list
        fetchProgrammes();
      } else {
        console.error("Error creating program:", response.status);
        Alert.alert("Erreur", "Impossible de créer un nouveau programme");
      }
    } catch (error) {
      console.error("Error creating program:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du programme");
    }
  };

  // Load programs when segment changes to "mesEntrainements"
  useEffect(() => {
    if (selectedSegment === "mesEntrainements") {
      fetchProgrammes();
    }
  }, [selectedSegment]);

  return (
    <SafeAreaView className="bg-primary-300 flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center mt-5 px-5 pb-3">
        <Text className="text-primary-200 font-bold text-3xl">Progress</Text>
        <Image source={icons.search} className="w-6 h-6" />
      </View>

      {/* Segments */}
      <View className="flex-row justify-around my-5 mx-4">
        <TouchableOpacity
          className={`flex-1 items-center py-2 mx-1 rounded-lg ${selectedSegment === "mesDonnees" ? "bg-[#B3A0FF]" : "bg-primary-100"}`}
          onPress={() => setSelectedSegment("mesDonnees")}
        >
          <Text className="text-white font-bold">Mes Données</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 items-center py-2 mx-1 rounded-lg ${selectedSegment === "mesEntrainements" ? "bg-[#B3A0FF]" : "bg-primary-100"}`}
          onPress={() => setSelectedSegment("mesEntrainements")}
        >
          <Text className="text-white font-bold">Mes Entraînements</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <View className="flex-1 px-5">
        {selectedSegment === "mesDonnees" ? (
          <ScrollView className="flex-1">
            <View className="p-4">
              {cardData.map((item, index) => (
                <TouchableOpacity
                  key={`data-card-${index}`}
                  onPress={() => router.push(`/${item.title.replace(/\s/g, "")}`)}
                  className="bg-white/5 rounded-lg shadow-sm mb-4 p-4 border border-white/10"
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-500 text-sm">{item.title}</Text>
                      <Text className="text-2xl text-[#B3A0FF] font-bold">{item.value}</Text>
                      <Text className="text-gray-500 text-xs">{item.unit}</Text>
                    </View>
                    {renderChart(item.chartType, item.data)}
                    <Image source={icons.rightArrowGrey} className="size-5" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView className="flex-1">
            <TouchableOpacity
              onPress={handleNewProgram}
              className="flex flex-row items-center justify-between mx-4 mb-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10"
            >
              <View className="flex flex-row items-center gap-3">
                <Text className="text-lg font-rubik-medium text-white">Nouveau Programme</Text>
              </View>
              <Image source={icons.add} className="size-5" />
            </TouchableOpacity>
            
            <Text className="text-primary-200 text-lg mb-4">Mes Entraînements</Text>
            
            {loading ? (
              <Text className="text-white text-center my-4">Chargement...</Text>
            ) : programmes.length > 0 ? (
              programmes.map((programme, index) => (
                <TouchableOpacity
                  key={`program-${programme.id || index}`}
                  onPress={() => router.push(`/Programme/${programme.id}`)}
                  className="flex flex-row items-center justify-between mx-4 mb-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <View className="flex flex-row items-center gap-3">
                    <Text className="text-lg font-rubik-medium text-white">{programme.name || `Programme ${index + 1}`}</Text>
                  </View>
                  <Image source={icons.rightArrowGrey} className="size-5" />
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-white text-center my-4">Aucun programme trouvé</Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Progress;