import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    // TODO: Gọi API hoặc xử lý cập nhật mật khẩu tại đây
    alert("Đổi mật khẩu thành công!");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Tiêu đề */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Đổi mật khẩu
        </Text>
      </View>

      {/* Nội dung biểu mẫu */}
      <View className="p-4">
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Mật khẩu hiện tại
          </Text>
          <TextInput
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Nhập mật khẩu hiện tại"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Mật khẩu mới
          </Text>
          <TextInput
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </View>
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Xác nhận mật khẩu mới
          </Text>
          <TextInput
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            className="border border-gray-300 rounded px-3 py-2"
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
