import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CartContext } from "../context/CartContext"; // Import context

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext); // Lấy hàm addToCart

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.navigate("Cart");
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Image
        source={product.image}
        className="w-full h-64 mb-4"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        {product.name}
      </Text>
      <Text className="text-base text-gray-500 mb-4">
        {product.description}
      </Text>
      <Text className="text-xl text-red-500 mb-2">
        ${product.price.toFixed(2)}
      </Text>

      {/* Chọn số lượng */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="bg-gray-200 px-4 py-2 rounded-l"
        >
          <Text className="text-xl font-bold">-</Text>
        </TouchableOpacity>
        <Text className="px-4 py-2 border-t border-b border-gray-200">
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => setQuantity((prev) => prev + 1)}
          className="bg-gray-200 px-4 py-2 rounded-r"
        >
          <Text className="text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleAddToCart}
        className="bg-red-500 p-4 rounded-full"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Add to Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
}
