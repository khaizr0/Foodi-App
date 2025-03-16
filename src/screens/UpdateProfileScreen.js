import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("Adam Stoeme");
  const [email, setEmail] = useState("adam@example.com");
  const [phone, setPhone] = useState("+21355555550");
  const [birthDate, setBirthDate] = useState("1990-01-01");

  const handleSave = () => {
    // TODO: Thực hiện cập nhật thông tin (gọi API, cập nhật context, ...)
    alert("Thông tin được cập nhật thành công!");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Cập nhật hồ sơ
        </Text>
      </View>

      <View className="p-4">
        {/* Họ và tên */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Họ và tên
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
            keyboardType="email-address"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>

        {/* Số điện thoại */}
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

        {/* Ngày tháng năm sinh */}
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Ngày tháng năm sinh
          </Text>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>

        {/* Nút Lưu thay đổi */}
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
