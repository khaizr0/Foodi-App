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
  // Trạng thái tìm kiếm và danh mục
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const categories = ["Pizza", "Burgers", "Mexican", "Asian", "Drinks"];

  // Dữ liệu sản phẩm (baseData)
  const baseData = [
    {
      id: 1,
      name: "Cheese Pizza",
      description: "Mixed pizza",
      price: 9.99,
      rating: 4.5,
      image: require("../../assets/Product-images/pizza.png"),
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Mixed pizza",
      price: 9.99,
      rating: 4.5,
      image: require("../../assets/Product-images/pizza.png"),
    },
    {
      id: 3,
      name: "Veggie Pizza",
      description: "Mixed pizza",
      price: 8.99,
      rating: 4.2,
      image: require("../../assets/Product-images/pizza.png"),
    },
    {
      id: 4,
      name: "Chicken Pizza",
      description: "Mixed pizza",
      price: 10.99,
      rating: 4.7,
      image: require("../../assets/Product-images/pizza.png"),
    },
  ];

  // State quản lý danh sách sản phẩm, trang và trạng thái tải dữ liệu
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Giới hạn số trang (vì chỉ có 1 trang dữ liệu)
  const maxPages = 1;

  // Load dữ liệu sản phẩm lần đầu
  useEffect(() => {
    setProducts(baseData);
  }, []);

  // Hàm tải thêm (infinite scroll)
  const loadMore = () => {
    if (loadingMore || page >= maxPages) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 1000);
  };

  // Render mỗi sản phẩm
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
      className="bg-white rounded-lg m-2 w-[44%] shadow-sm overflow-hidden"
    >
      <Image source={item.image} className="w-full h-24" resizeMode="cover" />
      <View className="p-2">
        <Text className="text-base font-semibold text-gray-800">
          {item.name}
        </Text>
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

  // Render footer khi đang tải dữ liệu
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#EF4444" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Delicious food for you
        </Text>
        {/* Thanh tìm kiếm */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="search"
            value={searchValue}
            onChangeText={setSearchValue}
            className="flex-1 ml-2 text-sm text-gray-700"
          />
          <TouchableOpacity onPress={() => alert("Filter pressed")}>
            <Ionicons
              name="options"
              size={20}
              color="#EF4444"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh mục */}
      <View className="mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {categories.map((cat, idx) => {
            const isActive = cat === selectedCategory;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedCategory(cat)}
                className="mr-6"
              >
                <Text className={`text-base font-semibold ${isActive ? "text-red-500" : "text-gray-500"}`}>
                  {cat}
                </Text>
                {isActive && <View className="w-full h-1 bg-red-500 mt-1 rounded" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Danh sách sản phẩm dạng grid 2 cột với infinite scroll */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 80 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
