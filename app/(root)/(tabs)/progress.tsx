import React, { useState, useEffect, useCallback } from "react";
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

  // Formatage du programme pour l'affichage
  const formatProgramContent = (program) => {
    return program
      .replace(/\$/g, '\n• ') // Remplace les $ par des puces
      .replace(/\\n/g, '\n')   // Remplace les \n par des sauts de ligne
      .trim();
  };

  // Extraction du titre (première ligne avant le premier $)
  const getProgramTitle = (program) => {
    return program.split('$')[0].trim() || "Programme sans titre";
  };

  // Fetch training programs
  const fetchProgrammes = useCallback(async () => {
    console.log("Fetching programmes...");
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
        const result = await response.json();
        console.log("API Response:", result);
        
        if (result.programmes && Array.isArray(result.programmes)) {
          setProgrammes(result.programmes);
        } else {
          console.error("Format de réponse inattendu:", result);
          setProgrammes([]);
        }
      } else {
        console.error("Error fetching programmes:", response.status);
        Alert.alert("Erreur", "Impossible de récupérer vos programmes");
        setProgrammes([]);
      }
    } catch (error) {
      console.error("Error fetching programmes:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la récupération de vos programmes");
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new program
  const handleNewProgram = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        Alert.alert("Erreur", "Vous devez être connecté pour créer un programme");
        return;
      }
      
      const response = await fetch("https://sport-coach-api.lab.rioc.fr/ProgrammePerso", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
      });
      
      if (response.ok) {
        Alert.alert("Succès", "Programme créé avec succès");
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

  // Load programs when segment changes
  useEffect(() => {
    if (selectedSegment === "mesEntrainements") {
      fetchProgrammes();
    }
  }, [selectedSegment, fetchProgrammes]);

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
            
            <Text className="text-primary-200 text-lg mb-4 px-4">Mes Entraînements</Text>
            
            {loading ? (
              <Text className="text-white text-center my-4">Chargement...</Text>
            ) : programmes.length > 0 ? (
              programmes.map((programme, index) => (
                <TouchableOpacity
                  key={`program-${programme.id || index}`}
                  onPress={() => router.push({
                    pathname: "/ProgrammeDetails",
                    params: {
                      id: programme.id,
                      title: getProgramTitle(programme.program),
                      content: formatProgramContent(programme.program),
                      date: programme.created_at
                    }
                  })}
                  className="bg-white/5 rounded-lg shadow-sm mb-4 p-4 mx-4 border border-white/10"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-lg text-[#B3A0FF] font-bold">
                        {getProgramTitle(programme.program)}
                      </Text>
                      <Text className="text-gray-400 text-sm mt-1">
                        Créé le: {new Date(programme.created_at).toLocaleDateString()}
                      </Text>
                      <Text numberOfLines={2} className="text-gray-300 text-sm mt-2">
                        {formatProgramContent(programme.program).split('\n')[0]}
                      </Text>
                    </View>
                    <Image source={icons.rightArrowGrey} className="size-5" />
                  </View>
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