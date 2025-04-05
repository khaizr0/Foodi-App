import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function OrderTrackingScreen({ route, navigation }) {
  const { cartItems } = route.params || [];

  const handleDone = () => {
    navigation.replace("MainTabs");
  };

  return (
    <View className="flex-1 bg-white p-4 items-center justify-center">
      <Text className="text-2xl font-bold text-red-500 mb-4">
        Đã thanh toán thành công
      </Text>
      <Text className="text-gray-600 mb-8">
        Chúng tôi đang chuẩn bị món ăn của bạn. Vui lòng chờ!
      </Text>
      <TouchableOpacity
        onPress={handleDone}
        className="bg-red-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">Quay về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}
