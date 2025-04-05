// File: HomeScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  // State cho tìm kiếm và lọc theo vùng
  const [searchValue, setSearchValue] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");
  const regions = ["Tất cả", "Bắc", "Trung", "Nam"];

  const otherCategories = ["Món chính", "Món phụ", "Giải Khát", "Ăn Vặt"];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const maxPages = 1;  // Điều chỉnh theo số trang mà API hỗ trợ

  // Gọi API khi component mount hoặc khi searchValue, selectedRegion thay đổi
  useEffect(() => {
    fetchProducts();
  }, [searchValue, selectedRegion]);

  // Hàm fetchProducts: Gọi API và lọc theo tên sản phẩm và vùng (region)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Sử dụng địa chỉ IP thích hợp cho Android Emulator: http://10.0.2.2
      const response = await fetch("http://10.0.2.2:5000/api/foods");
      const data = await response.json();
      
      // Lọc theo tên sản phẩm
      let filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      // Lọc theo vùng nếu không chọn "Tất cả"
      if (selectedRegion !== "Tất cả") {
        filtered = filtered.filter((item) => item.region === selectedRegion);
      }
      
      setProducts(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Hàm loadMore: Giả lập tải thêm dữ liệu khi cuộn đến cuối danh sách
  const loadMore = async () => {
    if (loadingMore || page >= maxPages) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/foods?page=${page + 1}`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Hàm renderProduct: Render mỗi sản phẩm dưới dạng một item trong danh sách
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
      className="bg-white w-[48%] shadow-sm mb-4 rounded-md"
    >
      <Image
        source={{ uri: item.imageUrl }} // Sử dụng trường imageUrl
        className="w-full h-24 rounded-t-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-500">{item.description}</Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-red-500 font-bold">${item.price.toFixed(2)}</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-xs">{item.rating}</Text>
            <Ionicons name="star" size={12} color="#FBBF24" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Hàm renderFooter: Hiển thị ActivityIndicator khi đang tải thêm dữ liệu
  const renderFooter = () =>
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="small" color="#EF4444" />
      </View>
    ) : null;

  return (
    <View className="flex-1 bg-white">
      {/* Header và thanh tìm kiếm */}
      <View className="px-4 pt-16 pb-4">
        <Text className="text-4xl font-bold text-gray-800">Món ngon</Text>
        <Text className="text-4xl font-bold text-gray-800 -mt-1">dành cho bạn</Text>
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm"
            value={searchValue}
            onChangeText={setSearchValue}
            className="flex-1 ml-2 text-sm text-gray-700"
          />
        </View>
      </View>

      {/* Danh mục lọc theo vùng */}
      <View className="mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {regions.map((region, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedRegion(region)}
              className="mr-6"
            >
              <Text className={`text-base font-semibold ${region === selectedRegion ? "text-red-500" : "text-gray-500"}`}>
                {region}
              </Text>
              {region === selectedRegion && <View className="w-full h-1 bg-red-500 mt-1 rounded" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-2">
          {otherCategories.map((cat, idx) => (
            <TouchableOpacity key={idx} className="bg-gray-200 px-4 py-2 rounded-full mr-4">
              <Text className="text-sm font-medium text-gray-700">{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <ActivityIndicator size="large" color="#EF4444" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => (item.id ? item.id.toString() : item._id.toString())}
          numColumns={2}
          renderItem={renderProduct}
          columnWrapperStyle={{ justifyContent: "space-evenly", marginBottom: 8 }}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}
