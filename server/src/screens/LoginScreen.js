import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Log ra email, password để kiểm tra
    console.log("handleLogin called with:", { email, password });

    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Log status và response trả về
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        if (data.account.role === "customer") {
          navigation.replace("MainTabs");
        } else if (data.account.role === "employee") {
          navigation.replace("EmployeeScreen");
        } else if (data.account.role === "admin") {
          navigation.replace("AdminScreen");
        }
      } else {
        Alert.alert("Đăng nhập thất bại", data.error);
      }
    } catch (error) {
      console.log("Error in handleLogin:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-2xl font-bold text-red-500 mb-6">Đăng nhập</Text>
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
        onPress={handleLogin}
        className="bg-red-500 py-3 rounded-full mb-3"
      >
        <Text className="text-white text-center font-semibold">Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-red-500 text-center">Tạo tài khoản mới</Text>
      </TouchableOpacity>
    </View>
  );
}
