import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AddAddressScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    console.log("Bắt đầu gọi API POST với dữ liệu:", { name, phone, address });
    fetch("http://10.0.2.2:5000/api/addresses", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, address }),
    })
      .then((response) => {
        console.log("Phản hồi từ server:", response);
        if (!response.ok) {
          // Log response text trước khi throw lỗi
          response.text().then((text) => {
            console.log("Response text:", text);
          });
          throw new Error("Lỗi khi thêm địa chỉ");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dữ liệu trả về:", data);
        Alert.alert("Thông báo", "Đã thêm địa chỉ mới!");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Chi tiết lỗi:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm địa chỉ");
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Thêm địa chỉ mới
        </Text>
      </View>
      <View className="p-4">
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Họ và tên
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Số điện thoại
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Địa chỉ
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ"
            className="border border-gray-300 rounded px-3 py-2"
            multiline
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="bg-red-500 p-4 rounded-full mt-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Lưu
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
