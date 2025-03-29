import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const dummyOrder = {
  id: "12345",
  orderCode: "ORD20240316",
  orderDate: "16 Tháng 3, 2025",
  status: "Đang chờ xử lý",
  note: "Để trước cửa",
  deliveryAddress: "123 Main St, New York, NY",
  storeName: "Thiên đường ẩm thực",
  total: 24.45,
  paymentMethod: "Thẻ tín dụng",
  products: [
    {
      id: 1,
      name: "Pizza phô mai",
      price: 9.99,
      image: require("../../assets/Product-images/pizza.png"),
      toppings: [],
    },
    {
      id: 2,
      name: "Pizza",
      price: 14.46,
      image: require("../../assets/Product-images/pizza.png"),
      toppings: [
        { name: "Khoai tây chiên", price: 0.99 },
        { name: "Phô mai thêm", price: 1.49 },
        { name: "Bánh burger", price: 1.99 },
      ],
    },
  ],
};

export default function OrderDetailScreen({ route, navigation }) {
  const order = dummyOrder;

  const handleCancelOrder = () => {
    Alert.alert("Hủy đơn hàng", "Bạn có chắc chắn muốn hủy đơn hàng này không?", [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: () => {
          Alert.alert("Đơn hàng đã bị hủy");
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Tiêu đề */}
      <View className="flex-row items-center p-4 border-b border-gray-300 bg-white shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-red-500 ml-4">
          Chi tiết đơn hàng #{order?.orderCode || order?.id}
        </Text>
      </View>

      {/* Nội dung */}
      <ScrollView className="p-4 bg-white">
        {order.products.map((product) => (
          <View key={product.id} className="flex-row items-start mb-4 border-b border-gray-300 pb-4">
            <Image source={product.image} className="w-16 h-16 rounded-lg" resizeMode="cover" />
            <View className="ml-4 flex-1">
              <Text className={`text-lg font-bold ${product.toppings?.length > 0 ? "text-gray-700" : ""}`}>
                {product.toppings?.length > 0 ? "- " : ""}{product.name}
              </Text>
              {product.toppings?.length > 0 && (
                <View className="mt-1">
                  {product.toppings.map((topping, index) => (
                    <Text key={index} className="text-gray-600 text-base">
                      + {topping.name} (${topping.price.toFixed(2)})
                    </Text>
                  ))}
                </View>
              )}
              <Text className="text-red-500 text-lg font-bold mt-1">${product.price.toFixed(2)}</Text>
            </View>
          </View>
        ))}

        {/* Thông tin đơn hàng */}
        <View className="bg-white p-4 rounded-lg shadow-md mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Thông tin đơn hàng</Text>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Mã đơn hàng: 
              <Text className="font-bold text-gray-800"> {order.orderCode}</Text>
            </Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Ngày đặt hàng: 
              <Text className="font-bold text-gray-800"> {order.orderDate}</Text>
            </Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Trạng thái: 
              <Text className="font-bold text-blue-500"> {order.status}</Text>
            </Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Phương thức thanh toán: 
              <Text className="font-bold text-gray-800"> {order.paymentMethod}</Text>
            </Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Cửa hàng: 
              <Text className="font-bold text-gray-800"> {order.storeName}</Text>
            </Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Địa chỉ giao hàng:</Text>
            <Text className="text-base text-gray-800">{order.deliveryAddress}</Text>
          </View>

          <View className="border-t border-gray-200 mt-2 pt-2">
            <Text className="text-gray-600 text-base">Ghi chú:</Text>
            <Text className="text-base italic text-gray-700">{order.note}</Text>
          </View>
        </View>

        {/* Tổng đơn hàng */}
        <View className="bg-white p-4 rounded-lg shadow-md mt-4">
          <Text className="text-lg font-bold text-gray-800">Tổng số tiền</Text>
          <Text className="text-2xl font-bold text-red-500">${order.total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      {/* Nút Hủy Đơn Hàng */}
      <TouchableOpacity onPress={handleCancelOrder} className="bg-red-500 p-4 rounded-full mx-4 mb-4 items-center shadow-md">
        <Text className="text-white text-lg font-semibold">Hủy đơn hàng</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
