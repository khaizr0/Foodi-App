import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function OrderStatusScreen({ navigation }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get("http://10.0.2.2:5000/api/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách đơn hàng:",
        error.response?.data || error.message
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("OrderDetailScreen", { order: item })}
      className="p-4 border-b border-gray-200"
    >
      <View className="flex-row justify-between">
        <Text className="text-lg font-semibold text-gray-800">
          Đơn hàng #{item.orderCode || item._id}
        </Text>
        <Text className="text-sm text-gray-600">
          {new Date(item.orderTime).toLocaleDateString()}
        </Text>
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-base text-gray-800">{item.status}</Text>
        <Text className="text-base font-bold text-red-500">
          ${item.priceDetails?.total.toFixed(2)}
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
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-red-500">Đơn Mua</Text>
      </View>
      <FlatList data={orders} keyExtractor={(item) => item._id} renderItem={renderOrder} />
    </SafeAreaView>
  );
}
