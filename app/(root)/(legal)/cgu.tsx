import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const CGU = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-4">Conditions Générales d'Utilisation</Text>
        <Text className="text-base leading-6 mb-4">
          Bienvenue sur notre application. En utilisant cette application, vous acceptez de respecter et d'être lié par les conditions générales suivantes.
        </Text>
        <Text className="text-xl font-bold mt-4">1. Utilisation de l'application</Text>
        <Text className="text-base leading-6 mt-2">
          L'application est destinée à un usage personnel et non commercial. Toute utilisation abusive est interdite.
        </Text>
        <Text className="text-xl font-bold mt-4">2. Propriété intellectuelle</Text>
        <Text className="text-base leading-6 mt-2">
          Tous les contenus présents dans l'application, y compris les textes, images et logos, sont protégés par le droit d'auteur.
        </Text>
        <Text className="text-xl font-bold mt-4">3. Responsabilité</Text>
        <Text className="text-base leading-6 mt-2">
          Nous ne sommes pas responsables des dommages résultant de l'utilisation de cette application.
        </Text>
        <Text className="text-base leading-6 mt-4">
          En cas de questions, veuillez nous contacter à jerome.gorin@unilasalle.fr.
        </Text>
      </View>
    </ScrollView>
  );
};

export default CGU;
