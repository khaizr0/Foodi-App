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

   const baseData = [
    { id: 1, name: "Pizza Phô Mai", description: "Pizza thập cẩm", price: 9.99, rating: 4.5, category: "Pizza", image: require("../../assets/Product-images/pizza.png") },
    { id: 2, name: "Bánh Mì Thịt", description: "Bánh mì truyền thống", price: 2.99, rating: 4.8, category: "Bánh Mì", image: require("../../assets/Product-images/pizza.png") },
    { id: 3, name: "Burger Bò", description: "Burger phô mai bò", price: 5.99, rating: 4.3, category: "Burger", image: require("../../assets/Product-images/pizza.png") },
    { id: 4, name: "Nước Cam", description: "Nước cam tươi", price: 1.99, rating: 4.7, category: "Đồ uống", image: require("../../assets/Product-images/pizza.png") },
  ];

  const [products, setProducts] = useState(baseData);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const maxPages = 1;

  useEffect(() => {
    filterProducts();
  }, [searchValue, selectedCategory]);

  const filterProducts = () => {
    let filtered = baseData.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    setProducts(filtered);
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
    <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { product: item })} className="bg-white w-[48%] shadow-sm mb-4 rounded-md">
      <Image source={item.image} className="w-full h-24 rounded-t-md" resizeMode="cover" />
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

  const renderFooter = () => loadingMore ? <View className="py-4"><ActivityIndicator size="small" color="#EF4444" /></View> : null;

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-16 pb-4">
        <Text className="text-4xl font-bold text-gray-800">Món ngon</Text>
        <Text className="text-4xl font-bold text-gray-800 -mt-1">dành cho bạn</Text>
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput placeholder="Tìm kiếm" value={searchValue} onChangeText={setSearchValue} className="flex-1 ml-2 text-sm text-gray-700" />
        </View>
      </View>

      <View className="mb-2">
        {/* Danh mục chính */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} onPress={() => setSelectedCategory(cat)} className="mr-6">
              <Text className={`text-base font-semibold ${cat === selectedCategory ? "text-red-500" : "text-gray-500"}`}>{cat}</Text>
              {cat === selectedCategory && <View className="w-full h-1 bg-red-500 mt-1 rounded" />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Other Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-2">
          {otherCategories.map((cat, idx) => (
            <TouchableOpacity key={idx} className="bg-gray-200 px-4 py-2 rounded-full mr-4">
              <Text className="text-sm font-medium text-gray-700">{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={{ justifyContent: "space-evenly", marginBottom: 8 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
