import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // TODO: Xử lý đăng ký, phân quyền...
    navigation.replace("Home");
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-2xl font-bold text-red-500 mb-6">Đăng ký</Text>

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