import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  
  // Mảng topping mẫu (AddOn)
  const [toppings] = useState([
    { id: "1", name: "Khoai tây chiên", price: 0.99 },
    { id: "2", name: "Phô mai thêm", price: 1.49 },
    { id: "3", name: "Hamburger", price: 1.99 },
    { id: "4", name: "Coca", price: 0.79 },
  ]);
  
  // Lưu trữ topping đã chọn
  const [selectedToppings, setSelectedToppings] = useState([]);
  
  const { addToCart } = useContext(CartContext);

  // Mẫu dữ liệu đánh giá
  const [reviews] = useState([
    { id: "1", user: "Nguyen Van A", rating: 5, comment: "Sản phẩm rất ngon, giao hàng nhanh!", date: "10/03/2025" },
    { id: "2", user: "Tran Thi B", rating: 4, comment: "Chất lượng tốt, nhưng giao hàng hơi chậm.", date: "05/03/2025" },
    { id: "3", user: "Le Van C", rating: 5, comment: "Đóng gói cẩn thận, món ăn vẫn nóng khi nhận được.", date: "01/03/2025" },
  ]);

  // Thêm/loại bỏ topping khỏi selectedToppings
  const toggleTopping = (topping) => {
    const isSelected = selectedToppings.some((t) => t.id === topping.id);
    if (isSelected) {
      console.log("Bỏ chọn topping:", topping);
      setSelectedToppings((prev) => prev.filter((t) => t.id !== topping.id));
    } else {
      console.log("Chọn topping:", topping);
      setSelectedToppings((prev) => [...prev, topping]);
    }
    console.log("Selected Toppings:", selectedToppings);
  };

  // Tính tổng giá topping đã chọn
  const toppingPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);

  // Tổng giá = (giá sản phẩm + topping) * quantity
  const totalPrice = (product.price + toppingPrice) * quantity;

  // Render các ngôi sao theo rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={14} 
          color={i <= rating ? "#FBBF24" : "#D1D5DB"} 
        />
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    console.log("handleAddToCart - product:", product, "quantity:", quantity, "selectedToppings:", selectedToppings);
    addToCart({ ...product, selectedToppings }, quantity);
    navigation.navigate("MainTabs", { screen: "Cart" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white pb-20">
        {/* Ảnh sản phẩm */}
        <Image
          source={product.image}
          className="w-full h-64 mb-4"
          resizeMode="contain"
        />

        <View className="px-4">
          {/* Tên món */}
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {product.name}
          </Text>
          {/* Thông tin rating, category */}
          <View className="flex-row items-center mb-2">
            {/* Rating */}
            <Ionicons name="star" size={16} color="#FBBF24" />
            <Text className="ml-1 text-sm text-gray-600">
              {product.rating?.toFixed(1) || 4.5} ({product.reviews || 34})
            </Text>
            <Text className="mx-2 text-sm text-gray-500">|</Text>
            {/* Category */}
            <Text className="text-sm text-gray-600">
              {product.category || "Món chính"}
            </Text>
            {product.isChefPick && (
              <>
                <Text className="mx-2 text-sm text-gray-500">|</Text>
                <Text className="text-sm text-green-600 font-bold">
                  LỰA CHỌN CỦA ĐẦU BẾP
                </Text>
              </>
            )}
          </View>

          {/* Mô tả sản phẩm */}
          <Text className="text-base text-gray-500 mb-4">
            {product.description?.slice(0, 60)}...
            <Text className="text-blue-500"> đọc thêm</Text>
          </Text>
          <Text className="text-xl text-red-500 mb-2">
            ${product.price.toFixed(2)}
          </Text>
          
          {/* Chọn số lượng */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => {
                setQuantity((prev) => {
                  const newQty = Math.max(1, prev - 1);
                  console.log("Giảm số lượng:", newQty);
                  return newQty;
                });
              }}
              className="bg-gray-200 px-4 py-2 rounded-l"
            >
              <Text className="text-xl font-bold">-</Text>
            </TouchableOpacity>
            <Text className="px-4 py-2 border-t border-b border-gray-200">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setQuantity((prev) => {
                  const newQty = prev + 1;
                  console.log("Tăng số lượng:", newQty);
                  return newQty;
                });
              }}
              className="bg-gray-200 px-4 py-2 rounded-r"
            >
              <Text className="text-xl font-bold">+</Text>
            </TouchableOpacity>
          </View>

          {/* Mục AddOn / Topping */}
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Thêm món
          </Text>
          <FlatList
            data={toppings}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Tắt cuộn nếu bạn muốn cuộn cha
            renderItem={({ item }) => {
              const isSelected = selectedToppings.some((t) => t.id === item.id);
              return (
                <TouchableOpacity
                  onPress={() => toggleTopping(item)}
                  className="flex-row items-center justify-between p-2 mb-1 border-b border-gray-100"
                >
                  <Text className="text-gray-700">{item.name}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 mr-2">
                      ${item.price.toFixed(2)}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkbox" size={20} color="#EF4444" />
                    ) : (
                      <Ionicons name="square-outline" size={20} color="#9CA3AF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Tổng giá = (product.price + toppingPrice) * quantity */}
          <View className="mt-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800">
              Tổng cộng:{" "}
              <Text className="text-red-500">
                ${totalPrice.toFixed(2)}
              </Text>
            </Text>
          </View>

          {/* PHẦN ĐÁNH GIÁ SẢN PHẨM */}
          <View className="mt-8 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Đánh giá sản phẩm
            </Text>
            
            {/* Tổng quan đánh giá */}
            <View className="flex-row items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center">
                <Text className="text-3xl font-bold text-gray-800 mr-2">
                  {product.rating?.toFixed(1) || 4.5}
                </Text>
                <View className="flex-col">
                  <View className="flex-row mb-1">
                    {renderStars(product.rating || 4.5)}
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {product.reviews || 34} đánh giá
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Danh sách đánh giá */}
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="mb-4 pb-4 border-b border-gray-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-semibold text-gray-800">{item.user}</Text>
                    <Text className="text-gray-500 text-sm">{item.date}</Text>
                  </View>
                  <View className="flex-row mb-2">
                    {renderStars(item.rating)}
                  </View>
                  <Text className="text-gray-700">{item.comment}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-gray-500 text-center py-4">
                  Chưa có đánh giá nào cho sản phẩm này.
                </Text>
              }
            />
            
            {/* Nút xem thêm đánh giá */}
            {reviews.length > 0 && (
              <TouchableOpacity className="mt-2">
                <Text className="text-center text-blue-500 font-semibold">
                  Xem tất cả đánh giá ({product.reviews || 34})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Add to Cart Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-red-500 p-4 rounded-full"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Thêm vào giỏ hàng - ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
