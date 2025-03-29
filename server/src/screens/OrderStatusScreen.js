import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const orders = [
  {
    id: "1",
    orderDate: "2023-03-01",
    status: "Đã giao",
    total: 25.99,
  },
  {
    id: "2",
    orderDate: "2023-03-05",
    status: "Đang xử lý",
    total: 15.49,
  },
];

export default function OrderStatusScreen({ navigation }) {
  const renderOrder = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("OrderDetailScreen", { order: item })}
      className="p-4 border-b border-gray-200"
    >
      <View className="flex-row justify-between">
        <Text className="text-lg font-semibold text-gray-800">
          Đơn hàng #{item.id}
        </Text>
        <Text className="text-sm text-gray-600">{item.orderDate}</Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-base text-gray-800">{item.status}</Text>
        <Text className="text-base font-bold text-red-500">
          ${item.total.toFixed(2)}
        </Text>
      </View>
      <View className="mt-2">
        <Text className="text-blue-500">Xem chi tiết</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-red-500">Đơn Mua</Text>
      </View>
      <FlatList data={orders} keyExtractor={(item) => item.id} renderItem={renderOrder} />
    </SafeAreaView>
  );
}
