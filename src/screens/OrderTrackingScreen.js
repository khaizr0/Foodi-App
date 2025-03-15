import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function OrderTrackingScreen({ route, navigation }) {
  const { cartItems } = route.params || [];

  const handleDone = () => {
    navigation.replace("Home");
  };

  return (
    <View className="flex-1 bg-white p-4 items-center justify-center">
      <Text className="text-2xl font-bold text-red-500 mb-4">
        Tracking your order...
      </Text>
      <Text className="text-gray-600 mb-8">
        We are preparing your food. Please wait!
      </Text>
      <TouchableOpacity
        onPress={handleDone}
        className="bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
