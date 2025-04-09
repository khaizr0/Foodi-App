import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewScreen({ navigation }) {
  const [reviewItems, setReviewItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewItems = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/reviews/available', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setReviewItems(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching review items", error);
      alert("Lỗi kết nối đến server.");
    }
    setLoading(false);
  };

  // Gọi API mỗi khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchReviewItems();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("WriteReviewScreen", { item })}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : { uri: 'https://via.placeholder.com/150' }}
        style={{ width: 64, height: 64, borderRadius: 8, marginRight: 16 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
          {item.foodName || "Tên món ăn"}
        </Text>
        <Text style={{ fontSize: 14, color: "#4B5563" }}>
          Đặt hàng vào ngày {new Date(item.orderTime).toLocaleDateString()}
        </Text>
        {item.reviewed && (
          <Text style={{ fontSize: 14, color: "green" }}>
            Đã đánh giá
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#374151" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#EF4445",
            marginLeft: 16,
          }}
        >
          Đánh giá món ăn
        </Text>
      </View>

      {/* Danh sách món cần review */}
      {loading ? (
        <ActivityIndicator size="large" color="#EF4445" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={reviewItems}
          keyExtractor={(item) => item.orderId + "_" + item.foodId}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text style={{ textAlign: "center", color: "#4B5563" }}>
                Không có món ăn nào.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
