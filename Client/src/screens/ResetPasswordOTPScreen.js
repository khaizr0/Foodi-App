import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function ResetPasswordOTPScreen({ navigation, route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/reset-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", data.message, [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      } else {
        Alert.alert("Lỗi", data.error);
      }
    } catch (error) {
      console.log("Error in handleResetPassword:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-2xl font-bold text-red-500 mb-6">Nhập OTP và Mật khẩu mới</Text>

      <TextInput
        placeholder="Nhập OTP"
        value={otp}
        onChangeText={setOtp}
        className="border border-gray-300 rounded px-4 py-2 mb-4"
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Nhập mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="border border-gray-300 rounded px-4 py-2 mb-6"
      />

      <TouchableOpacity onPress={handleResetPassword} className="bg-red-500 py-3 rounded-full">
        <Text className="text-white text-center font-semibold">Cập nhật mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
}
