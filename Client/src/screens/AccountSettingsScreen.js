import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AccountSettingsScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://10.0.2.2:5000/api/profile-info", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            name: data.username || "Người dùng",
            phone: data.phone || "Chưa có số điện thoại",
          });
        } else {
          console.log("Không thể lấy thông tin người dùng");
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin:", error.message);
      }
    };

    fetchUserInfo();
  }, []);

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
        const response = await fetch("http://10.0.2.2:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        <View className="ml-4">
          <Text className="text-white text-xl font-bold">{userInfo.name}</Text>
          <Text className="text-white text-sm mt-1">{userInfo.phone}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white p-4">
        <TouchableOpacity
          onPress={() => handlePress("Đơn Mua")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="cart-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đơn Mua</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("Quản lý địa chỉ")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="location-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Quản lý địa chỉ giao hàng</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("Đánh giá món ăn")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="star-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đánh giá món ăn</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("Đổi mật khẩu")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="lock-closed-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("Cập nhật hồ sơ")}
          className="flex-row items-center bg-gray-200 p-4 rounded-lg mb-4 shadow-md"
        >
          <Ionicons name="person-outline" size={24} color="#374151" className="mr-4" />
          <Text className="text-gray-800 flex-1 text-lg font-semibold">Cập nhật hồ sơ</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
        </TouchableOpacity>

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
