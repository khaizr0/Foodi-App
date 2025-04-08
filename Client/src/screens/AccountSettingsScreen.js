import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AccountSettingsScreen({ navigation }) {
  const handlePress = async (label) => {
    if (label === "Đơn Mua") {
      navigation.navigate("OrderStatusScreen");
    } else if (label === "Đổi mật khẩu") {
      navigation.navigate("ChangePasswordScreen");
    } else if (label === "Cập nhật hồ sơ") {
      navigation.navigate("UpdateProfileScreen");
    } else if (label === "Quản lý địa chỉ") {
      navigation.navigate("AddressManagementScreen");
    } else if (label === "Đánh giá món ăn") {
      navigation.navigate("ReviewScreen");
    } else if (label === "Đăng xuất") {
      try {
        const response = await fetch("http://192.168.1.28:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          Alert.alert("Thông báo", "Đăng xuất thành công");
          navigation.replace("Login");
        } else {
          const data = await response.json();
          Alert.alert("Lỗi", data.error || "Không thể đăng xuất");
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-red-500 p-4 pt-12 flex-row items-center">
        <View className="relative">
          <Image
            source={require("../../assets/icon.png")}
            className="w-16 h-16 rounded-full border-2 border-white"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => alert("Thay đổi ảnh đại diện")}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full"
          >
            <Ionicons name="camera-outline" size={16} color="#333" />
          </TouchableOpacity>
        </View>
        <View className="ml-4">
          <Text className="text-white text-xl font-bold">Adam Stoeme</Text>
          <Text className="text-white text-sm mt-1">+21355555550</Text>
        </View>
      </View>

      {/* Nội dung tùy chọn */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white p-4">
        {/* Đơn Mua */}
        <TouchableOpacity
          onPress={() => handlePress("Đơn Mua")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="cart-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đơn Mua</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Quản lý địa chỉ giao hàng */}
        <TouchableOpacity
          onPress={() => handlePress("Quản lý địa chỉ")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="location-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Quản lý địa chỉ giao hàng</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Đánh giá món ăn */}
        <TouchableOpacity
          onPress={() => handlePress("Đánh giá món ăn")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="star-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đánh giá món ăn</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Đổi mật khẩu */}
        <TouchableOpacity
          onPress={() => handlePress("Đổi mật khẩu")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="lock-closed-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Cập nhật hồ sơ */}
        <TouchableOpacity
          onPress={() => handlePress("Cập nhật hồ sơ")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="person-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Cập nhật hồ sơ</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Đăng xuất */}
        <TouchableOpacity
          onPress={() => handlePress("Đăng xuất")}
          className="bg-red-500 p-4 rounded-full mt-6 shadow-md"
        >
          <Text className="text-white text-center text-lg font-semibold">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}