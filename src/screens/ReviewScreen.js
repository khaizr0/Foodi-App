import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewScreen({ navigation }) {
  const deliveredItems = [
    {
      id: "1",
      name: "Pizza Phô Mai",
      image: require("../../assets/Product-images/pizza.png"),
      orderDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Burger Gà",
      image: require("../../assets/Product-images/burger.png"),
      orderDate: "2023-02-10",
    },
  ];

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
        source={item.image}
        style={{ width: 64, height: 64, borderRadius: 8, marginRight: 16 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 14, color: "#4B5563" }}>
          Đặt hàng vào ngày {item.orderDate}
        </Text>
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

      {/* Danh sách món đã giao */}
      <FlatList
        data={deliveredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}