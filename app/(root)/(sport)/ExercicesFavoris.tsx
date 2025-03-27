import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

type Exercise = {
    exercise_id: number;
    name: string;
    description: string;
    difficulty: string;
    muscle_group: string;
    created_at: string;
};

const ExercicesFavoris = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (!token) throw new Error('Token not found');

                console.log('Token:', token);

                const response = await fetch('http://10.19.4.2:8001/user/exercises', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseText = await response.text();
                console.log('Response:', responseText);

                if (!response.ok) throw new Error('Failed to fetch exercises');

                const data = JSON.parse(responseText);
                setExercises(data.exercises || []);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    return (
        <SafeAreaView className="bg-primary-300 flex-1">
            <View className="flex-row justify-between items-center mt-5 px-5 pb-3">
                <Text className="text-primary-200 font-bold text-3xl">Favoris</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" className="flex-1" />
            ) : exercises.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">Aucun exercice trouvé</Text>
                </View>
            ) : (
                <FlatList
                    data={exercises}
                    keyExtractor={(item) => item.exercise_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="px-5 py-2 border-b border-white/10"
                            onPress={() => router.push({
                                pathname: '/(root)/(sport)/ExerciceDetails',
                                params: {
                                    title: item.name,
                                },
                            })}
                        >
                            <Text className="text-white text-lg">{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

export default ExercicesFavoris;
