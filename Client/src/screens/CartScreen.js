import React, { useState, useContext } from "react";
import { View, Text, Image, Alert, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  // Quản lý mã giảm giá hoặc khuyến mãi
  const [discount, setDiscount] = useState(0);

  // Tính tổng phụ dựa trên topping
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const toppingPrice = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
      : 0;
    const itemTotal = (item.price + toppingPrice) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const deliveryFee = 1.0;
  const total = cartSubtotal - discount + deliveryFee;

  // Điều hướng sang trang Thanh toán
  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleClearCart = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa tất cả", onPress: () => clearCart() }
      ]
    );
  };

  // Hiển thị từng sản phẩm trong giỏ hàng
  const renderItem = ({ item }) => {
    // Tính giá topping và tổng giá của sản phẩm
    const toppingPrice = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
      : 0;
    const itemTotal = (item.price + toppingPrice) * item.quantity;

    return (
      <View className="flex-row items-center py-3 border-b border-gray-200">
        {/* Ảnh sản phẩm */}
        <Image
          source={{ uri: item.imageUrl }}
          className="w-16 h-16 mr-3"
          resizeMode="cover"
        />

        {/* Tên sản phẩm, topping, giá */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-700">
            {item.name}
          </Text>

          {/* Hiển thị topping (nếu có) */}
          {item.selectedToppings && item.selectedToppings.length > 0 && (
            <View className="mt-1">
              {item.selectedToppings.map((top) => (
                <Text key={top.id} className="text-xs text-gray-600">
                  + {top.name} (${top.price.toFixed(2)})
                </Text>
              ))}
            </View>
          )}

          {/* Tổng giá cho sản phẩm này */}
          <Text className="text-red-500 font-bold mt-1">
            ${itemTotal.toFixed(2)}
          </Text>
        </View>

        {/* Nút tăng/giảm số lượng */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} className="px-2">
            <Ionicons name="remove-circle-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
          <Text className="mx-2">{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="px-2">
            <Ionicons name="add-circle-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Nút xóa sản phẩm */}
        <TouchableOpacity onPress={() =>
            Alert.alert(
              "Xác nhận",
              "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
              [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => removeFromCart(item.id) }
              ]
            )
          }
          className="ml-3"
        >
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tiêu đề */}
      <View className="px-4 pt-16 pb-4 border-b border-gray-200">
        <Text className="text-4xl font-bold text-gray-800">Giỏ hàng của tôi</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} className="p-2 bg-gray-200 rounded-lg">
            <Text className="text-gray-700 font-semibold">Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 bg-white p-4">
        {/* Danh sách sản phẩm */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-gray-500 mt-2">Giỏ hàng của bạn đang trống.</Text>
          }
        />

        {/* Thông tin thanh toán */}
        <View className="bg-gray-50 rounded-xl p-4 mt-4">
          {/* Tổng phụ */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Tổng phụ</Text>
            <Text className="text-gray-800">${cartSubtotal.toFixed(2)}</Text>
          </View>
          {/* Giảm giá */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giảm giá</Text>
            <Text className="text-gray-800">-${discount.toFixed(2)}</Text>
          </View>
          {/* Phí giao hàng */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phí giao hàng</Text>
            <Text className="text-gray-800">${deliveryFee.toFixed(2)}</Text>
          </View>
          {/* Ngăn cách */}
          <View className="border-t border-gray-200 my-2" />
          {/* Tổng cộng */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Tổng cộng</Text>
            <Text className="text-lg font-bold text-red-500">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Nút Thanh toán */}
        <TouchableOpacity
            onPress={handleCheckout}
            disabled={cartItems.length === 0} // Vô hiệu hóa khi giỏ hàng trống
            className={`p-4 rounded-full mt-4 ${
              cartItems.length === 0 ? "bg-gray-300" : "bg-red-500"
            }`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Thanh toán
            </Text>          
        </TouchableOpacity>
      </View>
    </View>
  );
}