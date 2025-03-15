import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CheckoutScreen({ route, navigation }) {
  const { cartItems } = route.params || [];
  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleConfirm = () => {
    // Gửi đơn hàng -> theo dõi
    navigation.replace("OrderTracking", { cartItems });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-red-500 mb-4">Checkout</Text>
      <Text className="text-gray-600 mb-8">
        Enter your address & payment method
      </Text>
      {/* TODO: Form nhập địa chỉ, phương thức thanh toán... */}

      <View className="border-t border-gray-200 mt-4 pt-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Total: ${totalPrice?.toFixed(2)}
        </Text>

        <TouchableOpacity
          onPress={handleConfirm}
          className="bg-red-500 p-4 rounded-full mt-2"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Confirm Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
