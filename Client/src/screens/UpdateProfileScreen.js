import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Hàm lấy thông tin hồ sơ từ server
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://10.0.2.2:5000/api/profile-info", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFullName(data.username);
        setEmail(data.email);
        setPhone(data.phone);
        setUserId(data.userId);
      } else {
        Alert.alert("Lỗi", data.error || "Không thể tải thông tin hồ sơ");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Hàm xử lý cập nhật thông tin người dùng
  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Lỗi", "Không xác định được thông tin người dùng");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://10.0.2.2:5000/api/accounts/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: fullName,
          phone: phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thông báo", "Thông tin được cập nhật thành công!");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi cập nhật", data.error || "Không thể cập nhật thông tin");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Thanh header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">Cập nhật hồ sơ</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#EF4444" className="mt-10" />
      ) : (
        <View className="p-4">
          {/* Họ và tên */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-1">Họ và tên</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên"
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>

          {/* Email - bạn có thể đặt readonly nếu không cho phép cập nhật */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email"
              keyboardType="email-address"
              className="border border-gray-300 rounded px-3 py-2"
              editable={false}  // ví dụ: email không editable
            />
          </View>

          {/* Số điện thoại */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800 mb-1">Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>

          {/* Nút Lưu thay đổi */}
          <TouchableOpacity onPress={handleSave} className="bg-red-500 p-4 rounded-full mt-6">
            <Text className="text-white text-center font-semibold text-lg">Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
