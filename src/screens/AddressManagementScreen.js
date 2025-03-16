import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddressManagementScreen({ navigation }) {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "John Doe",
      phone: "0123456789",
      address: "123 Main Street, City, Country",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "0987654321",
      address: "456 Secondary Street, City, Country",
    },
  ]);

  const handleDelete = (id) => {
    Alert.alert(
      "Xóa địa chỉ",
      "Bạn có chắc chắn muốn xóa địa chỉ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => setAddresses((prev) => prev.filter((addr) => addr.id !== id)),
        },
      ]
    );
  };

  const handleEdit = (address) => {
    navigation.navigate("EditAddressScreen", { address });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-red-500 ml-4">
          Quản lý địa chỉ
        </Text>
      </View>

      {/* Nội dung danh sách địa chỉ */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses.map((addr) => (
          <View key={addr.id} className="bg-gray-50 p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-bold text-gray-800">{addr.name}</Text>
            <Text className="text-gray-600">{addr.phone}</Text>
            <Text className="text-gray-700">{addr.address}</Text>
            <View className="flex-row justify-end mt-2">
              <TouchableOpacity
                onPress={() => handleEdit(addr)}
                className="flex-row items-center mr-4"
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color="#EF4445"
                />
                <Text className="ml-1 text-sm text-gray-800">Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(addr.id)}
                className="flex-row items-center"
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#EF4445"
                />
                <Text className="ml-1 text-sm text-gray-800">Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* Nút Thêm Địa chỉ mới */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddAddressScreen")}
          className="bg-red-500 p-3 rounded-full mt-2"
        >
          <Text className="text-white text-center font-semibold">
            Thêm địa chỉ mới
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
