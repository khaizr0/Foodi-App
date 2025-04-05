import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu không khớp");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "customer" }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thông báo", "Đăng ký thành công");
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Đăng ký thất bại", data.error);
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-2xl font-bold text-red-500 mb-6">Đăng ký</Text>
      
      <TextInput
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        autoCapitalize="none"
        keyboardType="email-address"
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="border border-gray-300 rounded px-4 py-2 mb-6"
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-red-500 py-3 rounded-full mb-3"
      >
        <Text className="text-white text-center font-semibold">Đăng ký</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className="text-red-500 text-center">Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
