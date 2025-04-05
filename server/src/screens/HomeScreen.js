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
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const categories = ["Tất cả", "Miền Trung", "Miền Bắc", "Miền Nam"];
  const otherCategories = ["Món chính", "Món phụ", "Giải Khát", "Ăn Vặt"];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const maxPages = 1;

  useEffect(() => {
    fetchProducts();
  }, [searchValue, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Thay localhost bằng địa chỉ IP của máy tính của bạn
      const response = await fetch("http://192.168.x.x:5000/foods");
      const data = await response.json();

      let filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      if (selectedCategory !== "Tất cả") {
        filtered = filtered.filter((item) => item.region === selectedCategory);
      }
      setProducts(filtered);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || page >= maxPages) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
      className="bg-white w-[48%] shadow-sm mb-4 rounded-md"
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-24 rounded-t-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-xs text-gray-500">{item.description}</Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-red-500 font-bold">${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="small" color="#EF4444" />
      </View>
    ) : null;

  return (
    <View className="flex-1 bg-white">
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

      <View className="mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedCategory(cat)}
              className="mr-6"
            >
              <Text
                className={`text-base font-semibold ${
                  cat === selectedCategory ? "text-red-500" : "text-gray-500"
                }`}
              >
                {cat}
              </Text>
              {cat === selectedCategory && <View className="w-full h-1 bg-red-500 mt-1 rounded" />}
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id.toString()}
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
