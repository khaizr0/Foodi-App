import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddressManagementScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    console.log("Gọi API GET để lấy danh sách địa chỉ");
    fetch("http://10.0.2.2:5000/api/addresses", {
      credentials: "include",
    })
      .then((response) => {
        console.log("Phản hồi lấy danh sách địa chỉ:", response);
        if (!response.ok) {
          throw new Error("Lỗi tải danh sách địa chỉ");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Danh sách địa chỉ nhận được:", data);
        setAddresses(data);
      })
      .catch((error) =>
        console.error("Lỗi tải danh sách địa chỉ", error)
      );
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Xóa địa chỉ", "Bạn có chắc chắn muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          console.log("Gọi API DELETE với id:", id);
          fetch(`http://10.0.2.2:5000/api/addresses/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((response) => {
              console.log("Phản hồi xóa địa chỉ:", response);
              if (!response.ok) {
                throw new Error("Lỗi xóa địa chỉ");
              }
              return response.json();
            })
            .then(() => {
              console.log("Xóa địa chỉ thành công");
              setAddresses((prev) => prev.filter((addr) => addr._id !== id));
            })
            .catch((error) => {
              console.error("Chi tiết lỗi xóa địa chỉ:", error);
              Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa địa chỉ");
            });
        },
      },
    ]);
  };

  const handleEdit = (address) => {
    navigation.navigate("EditAddressScreen", { address });
  };

  const handleSelect = (address) => {
    navigation.navigate("Checkout", { selectedAddress: address });
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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses.map((addr) => (
          <TouchableOpacity
            key={addr._id}
            onPress={() => handleSelect(addr)}
          >
            <View className="bg-gray-50 p-4 rounded-lg shadow mb-4">
              <Text className="text-lg font-bold text-gray-800">
                {addr.name}
              </Text>
              <Text className="text-gray-600">{addr.phone}</Text>
              <Text className="text-gray-700">{addr.address}</Text>
              <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                  onPress={() => handleEdit(addr)}
                  className="flex-row items-center mr-4"
                >
                  <Ionicons name="pencil-outline" size={20} color="#EF4445" />
                  <Text className="ml-1 text-sm text-gray-800">Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(addr._id)}
                  className="flex-row items-center"
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4445" />
                  <Text className="ml-1 text-sm text-gray-800">Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
