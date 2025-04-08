import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://192.168.1.28:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", data.message, [
          { text: "OK", onPress: () => navigation.navigate("ResetPasswordOTPScreen", { email }) }
        ]);
      } else {
        Alert.alert("Lỗi", data.error);
      }
    } catch (error) {
      console.log("Error in handleForgotPassword:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-2xl font-bold text-red-500 mb-6">Quên mật khẩu</Text>
      <TextInput
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        className="border border-gray-300 rounded px-4 py-2 mb-6"
      />
      <TouchableOpacity onPress={handleForgotPassword} className="bg-red-500 py-3 rounded-full">
        <Text className="text-white text-center font-semibold">Gửi yêu cầu</Text>
      </TouchableOpacity>
    </View>
  );
}
