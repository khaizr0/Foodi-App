import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Nếu không truyền role thì mặc định là customer
        body: JSON.stringify({ username, email, password, role: "customer" }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Thông báo", "Đăng ký thành công");
        // Sau đăng ký, tự động điều hướng sang màn hình đăng nhập hoặc MainTabs (tùy theo yêu cầu)
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
        onChangeText={setEmail}
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
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
