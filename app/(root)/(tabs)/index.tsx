import { Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Svg, Circle, G, Text as SvgText, Path } from 'react-native-svg';

// Typage des propriétés
type DayAbbreviation = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam" | "Dim";

interface ApiActivityDay {
  date: string;
  heart_rate?: number;
  steps?: number;
  calories?: number;
  distance?: number;
  active_minutes?: number;
}

interface ActivityStats {
  heartRate: number;
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRateGoal: number;
  stepsGoal: number;
}

const daysShort: DayAbbreviation[] = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Composant de jauge circulaire corrigé
const CircularProgress = ({ 
  value, 
  maxValue, 
  radius = 50, 
  strokeWidth = 8,
  color,
  innerColor,
  displayValue,
  unit,
  fontSize = 36
}: {
  value: number;
  maxValue: number;
  radius?: number;
  strokeWidth?: number;
  color: string;
  innerColor: string;
  displayValue: string | number;
  unit?: string;
  fontSize?: number;
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = Math.min(Math.max(value / maxValue, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
      {/* Cercle de fond */}
      <Circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="#333333"
        strokeWidth={strokeWidth}
        opacity={0.2}
        fill="transparent"
      />
      
      {/* Cercle de progression */}
      <G rotation="-90" origin={`${radius}, ${radius}`}>
        <Circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </G>
      
      {/* Cercle intérieur */}
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth - 5}
        fill={innerColor}
      />
      
      {/* Texte central */}
      <SvgText
        x={radius}
        y={radius + fontSize / 3}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fill="white"
      >
        {displayValue}
      </SvgText>
      
      {/* Unité */}
      {unit && (
        <SvgText
          x={radius}
          y={radius + fontSize / 1.5}
          textAnchor="middle"
          fontSize={fontSize / 2}
          fill="#A0A0A0"
        >
          {unit}
        </SvgText>
      )}
    </Svg>
  );
};

export default function Index() {
  const [activityDays, setActivityDays] = useState<DayAbbreviation[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    heartRate: 85,
    steps: 7500,
    calories: 420,
    distance: 5.2,
    activeMinutes: 45,
    heartRateGoal: 120,
    stepsGoal: 10000
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'cardio' | 'steps'>('cardio');

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        
        if (!token) {
          throw new Error('Token non disponible');
        }

        const response = await axios.get<ApiActivityDay[]>('/api/user/activity_days', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Traitement des données
        const days: DayAbbreviation[] = response.data.map((item) => {
          const date = new Date(item.date);
          return daysShort[date.getDay() === 0 ? 6 : date.getDay() - 1];
        });

        // Calcul des statistiques
        const stats = response.data.reduce((acc, curr) => ({
          heartRate: acc.heartRate + (curr.heart_rate || 0),
          steps: acc.steps + (curr.steps || 0),
          calories: acc.calories + (curr.calories || 0),
          distance: acc.distance + (curr.distance || 0),
          activeMinutes: acc.activeMinutes + (curr.active_minutes || 0),
          count: acc.count + 1
        }), { 
          heartRate: 0, 
          steps: 0, 
          calories: 0, 
          distance: 0, 
          activeMinutes: 0, 
          count: 0 
        });

        setActivityDays(days);
        setStats({
          heartRate: stats.count > 0 ? Math.round(stats.heartRate / stats.count) : 0,
          steps: stats.steps,
          calories: stats.calories,
          distance: stats.distance,
          activeMinutes: stats.activeMinutes,
          heartRateGoal: 120,
          stepsGoal: 10000
        });
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  const completedCount = activityDays.length;

  const formatDistance = (distance: number) => {
    return distance.toFixed(2).replace('.', ',');
  };

  return (
    <SafeAreaView className='h-full bg-gray-900 p-5'>
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-between mb-5">
        <View className="flex flex-row items-center">
          <Image source={images.avatar} className="size-16 rounded-full" />
          <View className="ml-2">
            <Text className="font-rubik-bold text-white">Hi, Renan</Text>
            <Text className="font-rubik-light text-gray-400">You're doing good today!</Text>
          </View>
        </View>
        <View className="flex flex-row">
          <Image source={icons.search} className='size-5 mr-5' />
          <Image source={icons.bell2} className='size-5' />
        </View>
      </View>

      {/* Weekly Card */}
      <View className="bg-gray-800 rounded-2xl p-5 shadow-md mb-8">
        <View className="flex flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-white">Cette Semaine</Text>
          {!loading && (
            <Text className="text-lg font-semibold text-gray-300">
              {completedCount}/7
            </Text>
          )}
        </View>
        
        {error && (
          <Text className="text-red-500 text-sm mb-3">{error}</Text>
        )}

        <View className="flex flex-row justify-between">
          {daysShort.map((day) => (
            <View key={day} className="items-center">
              <Text className="text-sm text-gray-300 mb-1">{day}</Text>
              {loading ? (
                <View className="size-6" />
              ) : (
                <Image
                  source={activityDays.includes(day) ? icons.checkV : icons.checkG}
                  className="size-6"
                />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Jauge principale */}
      <View className="items-center mb-8">
        <CircularProgress 
          value={selectedMetric === 'cardio' ? stats.heartRate : stats.steps}
          maxValue={selectedMetric === 'cardio' ? stats.heartRateGoal : stats.stepsGoal}
          radius={80}
          strokeWidth={12}
          color={selectedMetric === 'cardio' ? "#4FFFB4" : "#4B97FF"}
          innerColor="#222222"
          displayValue={selectedMetric === 'cardio' ? stats.heartRate : stats.steps}
          unit={selectedMetric === 'cardio' ? "BPM" : "Pas"}
          fontSize={46}
        />
      </View>

      {/* Sélecteur de métrique */}
      <View className="flex flex-row justify-center space-x-8 mb-8">
        <TouchableOpacity 
          onPress={() => setSelectedMetric('cardio')}
          className={`p-3 rounded-full ${selectedMetric === 'cardio' ? 'bg-gray-700' : ''}`}
        >
          <View className="flex flex-row items-center">
            <View className="h-6 w-6 mr-2">
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Path 
                  d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" 
                  fill="#4FFFB4"
                />
              </Svg>
            </View>
            <Text className="text-base font-medium text-white">Cardio</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setSelectedMetric('steps')}
          className={`p-3 rounded-full ${selectedMetric === 'steps' ? 'bg-gray-700' : ''}`}
        >
          <View className="flex flex-row items-center">
            <View className="h-6 w-6 mr-2">
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Path 
                  d="M13.5,5.5C14.59,5.5 15.5,4.59 15.5,3.5C15.5,2.41 14.59,1.5 13.5,1.5C12.41,1.5 11.5,2.41 11.5,3.5C11.5,4.59 12.41,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z" 
                  fill="#4B97FF"
                />
              </Svg>
            </View>
            <Text className="text-base font-medium text-white">Pas</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Statistiques secondaires */}
      <View className="flex flex-row justify-between px-4">
        <View className="items-center">
          <Text className="text-3xl font-bold text-blue-300">
            {stats.calories}
          </Text>
          <Text className="text-gray-400">kcal</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-3xl font-bold text-blue-300">
            {formatDistance(stats.distance)}
          </Text>
          <Text className="text-gray-400">km</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-3xl font-bold text-blue-300">
            {stats.activeMinutes}
          </Text>
          <Text className="text-gray-400">Minutes actives</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}