import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const Privacy = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-4">Politique de Confidentialité</Text>
        <Text className="text-base leading-6 mb-4">
          Votre vie privée est importante pour nous. Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles.
        </Text>
        <Text className="text-xl font-bold mt-4">1. Données collectées</Text>
        <Text className="text-base leading-6 mt-2">
          Nous collectons uniquement les données nécessaires au bon fonctionnement de l'application, telles que votre nom et votre adresse e-mail.
        </Text>
        <Text className="text-xl font-bold mt-4">2. Utilisation des données</Text>
        <Text className="text-base leading-6 mt-2">
          Vos données sont utilisées pour améliorer nos services et vous offrir une meilleure expérience utilisateur.
        </Text>
        <Text className="text-xl font-bold mt-4">3. Partage des données</Text>
        <Text className="text-base leading-6 mt-2">
          Nous ne partageons vos données avec des tiers qu'avec votre consentement explicite ou si requis par la loi.
        </Text>
        <Text className="text-xl font-bold mt-4">4. Sécurité</Text>
        <Text className="text-base leading-6 mt-2">
          Nous prenons des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.
        </Text>
        <Text className="text-base leading-6 mt-4">
          Pour toute question, contactez-nous à jerome.gorin@unilasalle.fr.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Privacy;
