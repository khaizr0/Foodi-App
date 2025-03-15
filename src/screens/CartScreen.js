import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { CartContext } from "../context/CartContext"; // Import context

export default function CartScreen({ navigation }) {
  const { cartItems } = useContext(CartContext); // Lấy cartItems từ context

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-red-500 mb-4">My Cart</Text>
      {cartItems.length === 0 ? (
        <Text className="text-gray-500">Cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="flex-row justify-between mb-3">
              <Text className="text-base text-gray-700">
                {item.name} x {item.quantity}
              </Text>
              <Text className="text-base text-gray-700">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}

      <View className="border-t border-gray-200 mt-4 pt-4">
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-700">Total</Text>
          <Text className="text-lg font-semibold text-gray-700">
            ${totalPrice.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-red-500 p-4 rounded-full"
          disabled={cartItems.length === 0}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
