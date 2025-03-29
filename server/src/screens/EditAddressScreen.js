import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EditAddressScreen({ route, navigation }) {
  const { address: currentAddress } = route.params; // Dữ liệu địa chỉ cần chỉnh sửa
  const [name, setName] = useState(currentAddress.name);
  const [phone, setPhone] = useState(currentAddress.phone);
  const [address, setAddress] = useState(currentAddress.address);

  const handleSave = () => {
    // TODO: Gọi API hoặc cập nhật context để lưu thay đổi địa chỉ
    alert("Địa chỉ đã được cập nhật!");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Chỉnh sửa địa chỉ
        </Text>
      </View>

      {/* Form chỉnh sửa địa chỉ */}
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
            Lưu thay đổi
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
