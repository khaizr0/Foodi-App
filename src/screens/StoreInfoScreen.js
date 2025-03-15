
import React from "react";
import { View, Text } from "react-native";

export default function StoreInfoScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-red-500 mb-4">
        Store Information
      </Text>
      <Text className="text-base text-gray-700 mb-2">Address: 123 Main St.</Text>
      <Text className="text-base text-gray-700 mb-2">Phone: +1 234 567 890</Text>
      <Text className="text-base text-gray-700">
        Open Hours: 10:00 AM - 10:00 PM
      </Text>
    </View>
  );
}
