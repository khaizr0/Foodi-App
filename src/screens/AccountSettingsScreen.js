import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AccountSettingsScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-red-500 mb-4">
        Account Settings
      </Text>
      {/* Các mục cài đặt tài khoản, ví dụ: đổi mật khẩu, cập nhật thông tin, đăng xuất,... */}
      <TouchableOpacity
        onPress={() => alert("Change Password pressed")}
        className="bg-gray-200 p-3 rounded-lg mb-4"
      >
        <Text className="text-gray-800 text-center">Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert("Update Profile pressed")}
        className="bg-gray-200 p-3 rounded-lg mb-4"
      >
        <Text className="text-gray-800 text-center">Update Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert("Logout pressed")}
        className="bg-red-500 p-3 rounded-full"
      >
        <Text className="text-white text-center font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
