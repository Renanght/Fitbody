import { Text, View, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import icons from '@/constants/icons';

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const completedDays = ["Lun", "Mar", "Mer", "Jeu"];
const completedCount = completedDays.length;

export default function Index() {
  return (
    <SafeAreaView className='h-full bg-primary-300 p-5'>
      {/* Header */}
      <View className="w-full flex flex-row items-center justify-between mb-5">
        <View className="flex flex-row items-center">
          <Image source={images.avatar} className="size-16" />
          <View className="ml-2">
            <Text className="font-rubik-bold text-secondary">Hi, Renan</Text>
            <Text className="font-rubik-light text-primary-200">You're doing good today!</Text>
          </View>
        </View>
        <View className="flex flex-row">
          <Image source={icons.search} className='size-5 mr-5' />
          <Image source={icons.bell2} className='size-5' />
        </View>
      </View>

      {/* Weekly Card */}
      <View className="bg-white rounded-2xl p-5 shadow-md">
        {/* Header */}
        <View className="flex flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-primary-600">Cette Semaine</Text>
          <Text className="text-lg font-semibold text-primary-400">{completedCount}/7</Text>
        </View>
        {/* Days Progress */}
        <View className="flex flex-row justify-between">
          {days.map((day) => (
            <View key={day} className="items-center">
              <Text className="text-sm text-primary-600 mb-1">{day}</Text>
              <Image
                source={completedDays.includes(day) ? icons.checkV : icons.checkG}
                className="size-6"
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
