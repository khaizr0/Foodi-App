import React, { useContext } from "react";
import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import { CartContext } from "../context/CartContext";

const BASE_URL = "http://192.168.1.28:5000";

export default function QRPayment({ route, navigation }) {
  const { orderData } = route.params;
  const { clearCart } = useContext(CartContext);

  // Hàm xử lý khi QR được xác nhận (giả lập hành động quét thành công)
  const handleConfirmPayment = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error placing order");
      }

      clearCart();
      navigation.replace("OrderTracking");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      {/* Hiển thị mã QR cá nhân (sử dụng hình ảnh tĩnh) */}
      <Image
        source={require("../../assets/QRPayment.png")}
        className="w-full h-64"
        resizeMode="contain"
      />
      <Text className="text-lg font-bold mt-4">Quét mã QR này để thanh toán</Text>

      {/* Nút xác nhận thanh toán (giả lập quá trình quét mã QR thành công) */}
      <TouchableOpacity
        onPress={handleConfirmPayment}
        className="bg-red-500 px-6 py-3 rounded-lg mt-8"
      >
        <Text className="text-white font-semibold">Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
}
