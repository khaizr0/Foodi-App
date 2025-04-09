import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params;

  const handleCancelOrder = () => {
    Alert.alert("Hủy đơn hàng", "Bạn có chắc chắn muốn hủy đơn hàng này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: () => {
          Alert.alert("Đơn hàng đã bị hủy");
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-300 bg-white shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Chi tiết đơn hàng #{order.orderCode}
        </Text>
      </View>

      <ScrollView className="p-4 bg-white">
        {/* Danh sách món */}
        {order.items.map((item, index) => (
          <View key={index} className="mb-4 border-b border-gray-300 pb-4">
            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
            <Text className="text-base text-gray-600 mt-1">{item.description}</Text>

            {item.toppings?.length > 0 && (
              <View className="mt-2">
                <Text className="text-base text-gray-700 font-semibold">Toppings:</Text>
                {item.toppings.map((topping, idx) => (
                  <Text key={idx} className="text-gray-600 text-base">
                    + {topping.name} (${topping.price?.toFixed(2) || "0.00"})
                  </Text>
                ))}
              </View>
            )}

            <View className="mt-2 flex-row justify-between">
              <Text className="text-base text-gray-600">Số lượng: {item.quantity}</Text>
              <Text className="text-lg font-bold text-red-500">{item.price.toLocaleString()}đ</Text>
            </View>
          </View>
        ))}

        {/* Thông tin đơn hàng */}
        <View className="bg-white p-4 rounded-lg shadow-md mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Thông tin đơn hàng</Text>

          <Text className="text-base text-gray-600 mb-1">
            Mã đơn hàng: <Text className="font-bold text-gray-800">{order.orderCode}</Text>
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Ngày đặt hàng: <Text className="font-bold text-gray-800">{new Date(order.orderTime).toLocaleString()}</Text>
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Trạng thái: <Text className="font-bold text-blue-500">{order.status}</Text>
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Địa chỉ giao hàng: <Text className="font-bold text-gray-800">{order.customer.address}</Text>
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Khách hàng: <Text className="font-bold text-gray-800">{order.customer.name}</Text>
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Ghi chú: <Text className="italic text-gray-700">{order.notes || "Không có"}</Text>
          </Text>
        </View>

        {/* Tổng tiền */}
        <View className="bg-white p-4 rounded-lg shadow-md mt-4">
          <Text className="text-lg font-bold text-gray-800">Tổng số tiền</Text>
          <Text className="text-2xl font-bold text-red-500">
            {order.priceDetails?.total?.toLocaleString()}đ
          </Text>
        </View>
      </ScrollView>

      {/* Nút hủy đơn */}
      <TouchableOpacity onPress={handleCancelOrder} className="bg-red-500 p-4 rounded-full mx-4 mb-4 items-center shadow-md">
        <Text className="text-white text-lg font-semibold">Hủy đơn hàng</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
