import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { cartItems, clearCart } = useContext(CartContext);

  // State cho thông tin đơn hàng
  const [paymentMethod, setPaymentMethod] = useState("cod"); 
  const [note, setNote] = useState("");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  // Danh sách địa chỉ
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "John Doe",
      phone: "0123456789",
      address: "123 Main Street, City, Country",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "0987654321",
      address: "456 Secondary Street, City, Country",
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);

  // Danh sách chi nhánh
  const branches = [
    {
      id: "1",
      title: "KFC Nguyễn Ánh Thủ",
      address: "787 Đ. Nguyễn Ánh Thủ, Q12, HCM 70000",
    },
    {
      id: "2",
      title: "KFC Lê Văn Sỹ",
      address: "123 Đường Lê Văn Sỹ, Q3, HCM 70000",
    },
    {
      id: "3",
      title: "KFC Nguyễn Trãi",
      address: "456 Đường Nguyễn Trãi, Q1, HCM 70000",
    },
  ];
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id);

  // Tính toán
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.0; 
  const total = subtotal - discount + deliveryFee; // Dùng 'total' nhất quán

  // Áp dụng voucher
  const handleApplyVoucher = () => {
    if (voucher.trim().toUpperCase() === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  // Đặt hàng
  const handlePlaceOrder = () => {
    clearCart();
    navigation.replace("OrderTracking");
  };

  // Render mỗi sản phẩm
  const renderItem = ({ item }) => (
    <View className="flex-row items-center py-3 border-b border-gray-200">
      <Image
        source={item.image}
        className="w-16 h-16 mr-3 rounded-md"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-700">
          {item.name} x {item.quantity}
        </Text>
        <Text className="text-red-500 font-bold">
          {`$${(item.price * item.quantity).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Nội dung cuộn */}
      <ScrollView
        className="bg-white p-4"
        contentContainerStyle={{ paddingBottom: 120 }} 
        // Chừa khoảng trống cho thanh cố định
      >
        {/* Tiêu đề */}
        <Text className="text-2xl font-bold text-red-500 mb-4">Checkout</Text>

        {/* Danh sách sản phẩm */}
        <FlatList
          data={cartItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text className="text-gray-500 mt-2">No items in cart.</Text>
          }
        />

        {/* Thông tin khách hàng: Note & Voucher */}
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Customer Note
          </Text>
          <TextInput
            placeholder="Any special requests?"
            value={note}
            onChangeText={setNote}
            className="bg-white border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Voucher Code
          </Text>
          <View className="flex-row items-center">
            <TextInput
              placeholder="Enter voucher code"
              value={voucher}
              onChangeText={setVoucher}
              className="flex-1 bg-white border border-gray-300 rounded-l px-3 py-2"
            />
            <TouchableOpacity
              onPress={handleApplyVoucher}
              className="bg-red-500 px-4 py-2 rounded-r"
            >
              <Text className="text-white font-semibold">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chọn địa chỉ */}
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Select Delivery Address
          </Text>
          <ScrollView
            style={{ maxHeight: 160 }}
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                onPress={() => setSelectedAddress(addr.id)}
                className={`p-3 mb-2 border rounded-lg ${
                  selectedAddress === addr.id
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              >
                <Text className="text-gray-800 font-semibold">{addr.name}</Text>
                <Text className="text-gray-600 text-sm">{addr.phone}</Text>
                <Text className="text-gray-700">{addr.address}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate("DeliveryAddressScreen")}
              className="bg-red-500 p-3 rounded-lg mt-2"
            >
              <Text className="text-white text-center font-semibold">
                Add New Address
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Chọn chi nhánh */}
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Select Branch
          </Text>
          <ScrollView
            style={{ maxHeight: 160 }}
            showsVerticalScrollIndicator
            nestedScrollEnabled
          >
            {branches.map((branch) => (
              <TouchableOpacity
                key={branch.id}
                onPress={() => setSelectedBranch(branch.id)}
                className={`p-3 mb-2 border rounded-lg ${
                  selectedBranch === branch.id
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              >
                <Text className="text-gray-800 font-semibold">
                  {branch.title}
                </Text>
                <Text className="text-gray-600 text-sm">{branch.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

       {/* Order Summary */}
        <View className="bg-gray-50 rounded-xl p-4 mt-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800">{`$${subtotal.toFixed(2)}`}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery</Text>
            <Text className="text-gray-800">{`$${deliveryFee.toFixed(2)}`}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Voucher Discount</Text>
            <Text className="text-gray-800">{`-$${discount.toFixed(2)}`}</Text>
          </View>
          <View className="border-t border-gray-200 my-2" />
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold text-red-500">{`$${total.toFixed(2)}`}</Text>
          </View>
        </View>
      </ScrollView>

      {/*Tổng thanh toán + nút Đặt hàng*/}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
        {/* Tổng thanh toán */}
        <View>
          <Text className="text-sm text-gray-500">Tổng thanh toán</Text>
          <Text className="text-xl font-bold text-red-500">
            đ{total.toLocaleString("en-US")}
          </Text>
        </View>

        {/* Nút đặt hàng */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
