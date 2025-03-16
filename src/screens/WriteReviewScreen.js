import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WriteReviewScreen({ route, navigation }) {
  const { item } = route.params;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={24}
            color="#FBBF24"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmitReview = () => {
    // TODO: Xử lý logic gửi review (có thể gọi API)
    alert("Đã gửi đánh giá!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Tiêu đề */}
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
          Đánh giá {item.name}
        </Text>
      </View>

      {/* Nội dung */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#374151" }}>
          Đánh giá sao
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          {renderStars()}
        </View>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#374151" }}>
          Nhận xét
        </Text>
        <TextInput
          placeholder="Viết nhận xét của bạn tại đây..."
          value={reviewText}
          onChangeText={setReviewText}
          style={{
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 8,
            padding: 12,
            height: 120,
            textAlignVertical: "top",
          }}
          multiline
        />
        <TouchableOpacity
          onPress={handleSubmitReview}
          style={{
            backgroundColor: "#EF4445",
            paddingVertical: 16,
            borderRadius: 999,
            marginTop: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            Gửi đánh giá
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}