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
    console.log("🚀 DEBUG: Début de fetchProgrammes");
    try {
      setLoading(true);
      console.log("🚀 DEBUG: Récupération du token...");
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.log("❌ ERROR: Token non trouvé");
        Alert.alert("Erreur", "Vous devez être connecté pour voir vos programmes");
        return;
      }
      
      console.log("🚀 DEBUG: Token récupéré, longueur:", token.length);
      console.log("🚀 DEBUG: Envoi de la requête à l'API...");
      console.log("🚀 DEBUG: URL de l'API:", "http://10.19.4.2:8001/ProgrammesPerso");
      
      const response = await fetch("http://10.19.4.2:8001/ProgrammesPerso", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log("🚀 DEBUG: Réponse reçue, status:", response.status);
      
      if (response.ok) {
        console.log("✅ SUCCESS: Réponse OK (status", response.status, ")");
        const textResponse = await response.text();
        console.log("🚀 DEBUG: Réponse brute:", textResponse);
        
        try {
          const data = JSON.parse(textResponse);
          console.log("🚀 DEBUG: Données JSON parsées:", JSON.stringify(data, null, 2));
          
          // Vérifier la structure des données
          if (data) {
            console.log("🚀 DEBUG: Structure des données:", Object.keys(data));
            
            if (data.programmes) {
              console.log("✅ SUCCESS: Programmes trouvés, nombre:", data.programmes.length);
              setProgrammes(data.programmes);
            } else if (data.message && Array.isArray(data)) {
              console.log("🚀 DEBUG: Format alternatif détecté, utilisation du tableau directement");
              setProgrammes(data);
            } else {
              console.log("❌ ERROR: Clé 'programmes' non trouvée dans les données");
              console.log("🚀 DEBUG: Tentative d'utilisation des données telles quelles");
              setProgrammes(Array.isArray(data) ? data : []);
            }
          } else {
            console.log("❌ ERROR: Données reçues null ou undefined");
            Alert.alert("Erreur", "Données vides reçues du serveur");
          }
        } catch (parseError) {
          console.error("❌ ERROR: Erreur de parsing JSON:", parseError);
          console.log("❌ ERROR: Réponse non-JSON:", textResponse.substring(0, 200) + "...");
          Alert.alert("Erreur", "Format de réponse invalide");
        }
      } else {
        console.error("❌ ERROR: Échec de la requête API, status:", response.status);
        console.log("❌ ERROR: Tentative de lecture du corps d'erreur...");
        try {
          const errorBody = await response.text();
          console.log("❌ ERROR: Corps de l'erreur:", errorBody);
        } catch (e) {
          console.log("❌ ERROR: Impossible de lire le corps de l'erreur");
        }
        Alert.alert("Erreur", `Impossible de récupérer vos programmes (${response.status})`);
      }
    } catch (error) {
      console.error("❌ ERROR: Exception lors de la récupération des programmes:", error);
      console.log("❌ ERROR: Message d'erreur:", error.message);
      console.log("❌ ERROR: Stack trace:", error.stack);
      Alert.alert("Erreur", "Une erreur est survenue lors de la récupération de vos programmes");
    } finally {
      console.log("🚀 DEBUG: Fin de fetchProgrammes, désactivation du chargement");
      setLoading(false);
    }
  };

  // Create new program and navigate
  const handleNewProgram = async () => {
    console.log("🚀 DEBUG: Début de handleNewProgram");
    try {
      console.log("🚀 DEBUG: Récupération du token...");
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.log("❌ ERROR: Token non trouvé");
        Alert.alert("Erreur", "Vous devez être connecté pour créer un programme");
        return;
      }
      
      console.log("🚀 DEBUG: Token récupéré, longueur:", token.length);
      console.log("🚀 DEBUG: Envoi de la requête POST...");
      
      // Send the POST request first
      const response = await fetch("http://127.0.0.1:8000/ProgrammePerso", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Add your payload here if needed
        }),
      });
      
      console.log("🚀 DEBUG: Réponse reçue, status:", response.status);
      
      if (response.ok) {
        console.log("✅ SUCCESS: Programme créé avec succès");
        // Success alert instead of navigation
        Alert.alert("Succès", "Programme créé avec succès");
        // Refresh the programs list
        console.log("🚀 DEBUG: Rafraîchissement de la liste des programmes...");
        fetchProgrammes();
      } else {
        console.error("❌ ERROR: Échec de la création du programme, status:", response.status);
        console.log("❌ ERROR: Tentative de lecture du corps d'erreur...");
        try {
          const errorBody = await response.text();
          console.log("❌ ERROR: Corps de l'erreur:", errorBody);
        } catch (e) {
          console.log("❌ ERROR: Impossible de lire le corps de l'erreur");
        }
        Alert.alert("Erreur", "Impossible de créer un nouveau programme");
      }
    } catch (error) {
      console.error("❌ ERROR: Exception lors de la création du programme:", error);
      console.log("❌ ERROR: Message d'erreur:", error.message);
      console.log("❌ ERROR: Stack trace:", error.stack);
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du programme");
    }
  };

  // Fonction pour extraire la première partie du programme (comme un titre)
  const getProgramTitle = (programText) => {
    console.log("🚀 DEBUG: getProgramTitle appelé avec:", programText ? programText.substring(0, 30) + "..." : "null");
    if (!programText) return "Programme sans titre";
    
    // Prendre la première partie du texte avant le premier séparateur "$"
    const firstPart = programText.split('$')[0].trim();
    console.log("🚀 DEBUG: Première partie extraite:", firstPart);
    
    // Si c'est trop long, le réduire
    return firstPart.length > 30 ? firstPart.substring(0, 27) + '...' : firstPart;
  };

  // Gérer le clic sur un programme
  const handleProgramClick = (programme) => {
    console.log("🚀 DEBUG: handleProgramClick appelé avec programme ID:", programme?.id);
    
    if (!programme || !programme.program) {
      console.log("❌ ERROR: Programme ou détails de programme manquants");
      console.log("🚀 DEBUG: Contenu du programme:", JSON.stringify(programme, null, 2));
      Alert.alert("Erreur", "Détails du programme non disponibles");
      return;
    }

    console.log("🚀 DEBUG: Contenu du programme:", programme.program.substring(0, 50) + "...");
    
    // Extraire les exercices du programme
    const exercises = programme.program.split('$').map(ex => ex.trim()).filter(ex => ex);
    console.log("🚀 DEBUG: Exercices extraits:", exercises);
    
    // Rediriger vers les détails avec les paramètres appropriés
    console.log("🚀 DEBUG: Préparation de la navigation...");
    console.log("🚀 DEBUG: Paramètres:", {
      programId: programme.id,
      exercises: JSON.stringify(exercises)
    });
    
    router.push({
      pathname: '/(root)/(sport)/ExerciceDetails',
      params: {
        programId: programme.id,
        exercises: JSON.stringify(exercises)
      },
    });
    console.log("✅ SUCCESS: Navigation lancée");
  };

  // Load programs when segment changes to "mesEntrainements"
  useEffect(() => {
    console.log("🚀 DEBUG: useEffect appelé, segment actuel:", selectedSegment);
    if (selectedSegment === "mesEntrainements") {
      console.log("🚀 DEBUG: Segment 'mesEntrainements' détecté, chargement des programmes...");
      fetchProgrammes();
    }
  }, [selectedSegment]);

  console.log("🚀 DEBUG: Rendu du composant, nombre de programmes:", programmes.length);
  if (programmes.length > 0) {
    console.log("🚀 DEBUG: Premier programme:", JSON.stringify(programmes[0], null, 2));
  }

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
          onPress={() => {
            console.log("🚀 DEBUG: Segment 'mesDonnees' sélectionné");
            setSelectedSegment("mesDonnees");
          }}
        >
          <Text className="text-white font-bold">Mes Données</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 items-center py-2 mx-1 rounded-lg ${selectedSegment === "mesEntrainements" ? "bg-[#B3A0FF]" : "bg-primary-100"}`}
          onPress={() => {
            console.log("🚀 DEBUG: Segment 'mesEntrainements' sélectionné");
            setSelectedSegment("mesEntrainements");
          }}
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
              onPress={() => {
                console.log("🚀 DEBUG: Bouton 'Nouveau Programme' pressé");
                handleNewProgram();
              }}
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
            ) : (
              <>
                <Text className="text-yellow-400 mb-2">DEBUG: Nombre de programmes: {programmes.length}</Text>
                {programmes.length > 0 ? (
                  programmes.map((programme, index) => {
                    console.log(`🚀 DEBUG: Rendu du programme ${index}:`, programme?.id);
                    return (
                      <TouchableOpacity
                        key={`program-${programme?.id || index}`}
                        onPress={() => {
                          console.log(`🚀 DEBUG: Programme ${index} cliqué`);
                          handleProgramClick(programme);
                        }}
                        className="flex flex-row items-center justify-between mx-4 mb-4 px-4 py-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <View className="flex flex-row items-center gap-3">
                          <Text className="text-lg font-rubik-medium text-white">Programme {index + 1}</Text>
                          <Text className="text-sm text-gray-400">{getProgramTitle(programme?.program)}</Text>
                        </View>
                        <Image source={icons.rightArrowGrey} className="size-5" />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <>
                    <Text className="text-white text-center my-4">Aucun programme trouvé</Text>
                    <Text className="text-yellow-400 text-center">Vérifiez les logs pour plus d'informations</Text>
                  </>
                )}
              </>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Progress;