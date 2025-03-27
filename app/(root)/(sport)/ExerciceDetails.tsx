import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AwesomeAlert from 'react-native-awesome-alerts';

const ExerciceDetails = () => {
    const { imageUrl, title } = useLocalSearchParams();
    const [description, setDescription] = useState<string>('');
    const [conseils, setConseils] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSuccess, setAlertSuccess] = useState(false);

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                console.log('Token JWT récupéré:', token);

                if (!token) {
                    console.error('Token JWT non trouvé.');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.post(
                    'https://sport-coach-api.lab.rioc.fr/ConseilsExos',
                    { exercice: title },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Réponse API:', response.data);
                setDescription(response.data.description || '');
                setConseils(response.data.conseils || '');
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'exercice:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExerciseDetails();
    }, [title]);

    const parseDescription = (text: string): string => {
        return text ? text.split('$').join('\n') : '';
    };

    const handleAddToProgram = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                console.error('Token JWT non trouvé.');
                return;
            }

            const response = await axios.post(
                'http://10.19.4.2:8001/user/exercises/add',
                { "exercise_name": title },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setAlertMessage('Ajouté avec succès');
                setAlertSuccess(true);
            } else {
                throw new Error('Erreur lors de l\'ajout');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'exercice au programme:', error);
            setAlertMessage('Erreur lors de l\'ajout');
            setAlertSuccess(false);
        } finally {
            setAlertVisible(true);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Image source={{ uri: imageUrl as string }} className="w-full h-80 rounded-lg mb-5" />
                        <Text className="text-2xl font-bold mb-2 text-gray-800">{title as string}</Text>
                        <Text className="text-base text-gray-600 leading-6">
                            {description ? parseDescription(description) : ''}
                        </Text>
                        <Text className="text-base text-gray-600 leading-6 mt-4">{conseils}</Text>
                        <TouchableOpacity
                            className="bg-blue-500 py-3 px-6 rounded-full mt-8"
                            onPress={handleAddToProgram}
                        >
                            <Text className="text-white font-bold">Ajouter à mon programme</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Sweet Alert */}
            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title={alertSuccess ? 'Succès' : 'Erreur'}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alertSuccess ? '#4CAF50' : '#F44336'}
                onConfirmPressed={() => setAlertVisible(false)}
            />
        </SafeAreaView>
    );
};

export default ExerciceDetails;
