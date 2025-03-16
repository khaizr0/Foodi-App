import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // Quản lý promo code và mức giảm giá
  const [discount, setDiscount] = useState(0);

  // Tính toán
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.0; 
  const total = subtotal - discount + deliveryFee;

  // Hàm điều hướng sang màn hình Checkout
  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  // Render từng sản phẩm trong giỏ
  const renderItem = ({ item }) => {
    return (
      <View className="flex-row items-center py-3 border-b border-gray-200">
        {/* Ảnh sản phẩm */}
        <Image
          source={item.image}
          className="w-16 h-16 mr-3"
          resizeMode="cover"
        />
        {/* Tên và giá */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-700">
            {item.name}
          </Text>
          <Text className="text-red-500 font-bold">
            ${item.price.toFixed(2)}
          </Text>
        </View>
        {/* Nút +/- số lượng */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2"
          >
            <Ionicons name="remove-circle-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
          <Text className="mx-1">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2"
          >
            <Ionicons name="add-circle-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
        {/* Nút xóa */}
        <TouchableOpacity
          onPress={() => removeFromCart(item.id)}
          className="ml-3"
        >
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tiêu đề với đường viền dưới */}
      <View className="px-4 pt-16 pb-4 border-b border-gray-200">
        <Text className="text-4xl font-bold text-gray-800">
          Order Details
        </Text>
      </View>
      <View className="flex-1 bg-white p-4">
        {/* Danh sách sản phẩm */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-gray-500 mt-2">Your cart is empty.</Text>
          }
        />
  
        {/* Tính tiền */}
        <View className="bg-gray-50 rounded-xl p-4 mt-4">
          {/* Subtotal */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800">{`$${subtotal.toFixed(2)}`}</Text>
          </View>
          {/* Promo */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Promo Code</Text>
            <Text className="text-gray-800">{`-$${discount.toFixed(2)}`}</Text>
          </View>
          {/* Delivery */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery</Text>
            <Text className="text-gray-800">{`$${deliveryFee.toFixed(2)}`}</Text>
          </View>
          {/* Ngăn cách */}
          <View className="border-t border-gray-200 my-2" />
          {/* Total */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold text-red-500">{`$${total.toFixed(2)}`}</Text>
          </View>
        </View>
  
        {/* Nút Checkout */}
        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-red-500 p-4 rounded-full mt-4"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
