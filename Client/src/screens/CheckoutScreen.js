import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";

// Địa chỉ IP cố định cho Android Emulator
const BASE_URL = "http://10.0.2.2:5000";

export default function CheckoutScreen({ navigation }) {
  const { cartItems, clearCart } = useContext(CartContext);

  // State cho thông tin đơn hàng
  const [note, setNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Danh sách địa chỉ và chi nhánh (giữ nguyên)
  const [addresses] = useState([
    { id: "1", name: "John Doe", phone: "0123456789", address: "123 Main St" },
    { id: "2", name: "Jane Smith", phone: "0987654321", address: "456 Secondary St" },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);

  const [branches] = useState([
    { id: "1", title: "KFC Nguyễn Ánh Thủ", address: "787 Đ. Nguyễn Ánh Thủ" },
    { id: "2", title: "KFC Lê Văn Sỹ", address: "123 Đường Lê Văn Sỹ" },
  ]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id);

  // Tính toán subtotal (bao gồm topping)
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const toppingPrice = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
      : 0;
    const itemTotal = (item.price + toppingPrice) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const deliveryFee = 1.0;
  // Tính discountValue dựa trên voucher đã được áp dụng
  const discountValue = appliedVoucher
    ? cartSubtotal * (appliedVoucher.discountPercentage / 100)
    : 0;
  const total = cartSubtotal - discountValue + deliveryFee;

  // Hàm xử lý áp dụng voucher, sử dụng BASE_URL tương tự HomeScreen
  const handleApplyVoucher = async () => {
    if (appliedVoucher) {
      Alert.alert(
        "Voucher đã được áp dụng",
        "Mỗi đơn hàng chỉ được nhập 1 voucher duy nhất."
      );
      return;
    }
    if (!voucherInput.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã voucher");
      return;
    }
  
    try {
      const response = await fetch(
        `${BASE_URL}/api/vouchers/${voucherInput.trim().toUpperCase()}`
      );
      // Đọc dữ liệu response một lần duy nhất
      const voucherData = await response.json();
      console.log("Voucher data:", voucherData);
      
      if (!response.ok) {
        Alert.alert(
          "Voucher không hợp lệ",
          voucherData.error || "Voucher không tồn tại"
        );
        return;
      }
      if (voucherData.used) {
        Alert.alert("Voucher đã được sử dụng", "Voucher này đã được sử dụng.");
        return;
      }
      setAppliedVoucher(voucherData);
      Alert.alert(
        "Áp dụng voucher thành công",
        `Voucher giảm ${voucherData.discountPercentage}% cho đơn hàng của bạn.`
      );
    } catch (error) {
      console.error("Error applying voucher:", error);
      Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
    }
  };
  

  // Hàm fetchVoucherData để gọi API từ endpoint BASE_URL
  const fetchVoucherData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/voucher`);
      if (!response.ok) {
        Alert.alert("Lỗi", "Không thể lấy dữ liệu voucher");
        return;
      }
      const data = await response.json();
      console.log("Voucher data:", data);
      Alert.alert("Thông báo", "Dữ liệu voucher đã được lấy thành công.");
    } catch (error) {
      console.error("Error fetching voucher data:", error);
      Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const handlePlaceOrder = () => {
    if (appliedVoucher) {
      fetch(
        `${BASE_URL}/api/vouchers/${voucherInput.trim().toUpperCase()}/use`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((err) => console.error("Error updating voucher:", err));
    }
    clearCart();
    if (paymentMethod === "cash") {
      navigation.replace("OrderTracking");
    } else if (paymentMethod === "card") {
      navigation.replace("QRPayment");
    }
  };

  // Hàm render item cho danh sách sản phẩm
  const renderItem = ({ item }) => {
    const toppingPrice = item.selectedToppings
      ? item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
      : 0;
    const itemTotal = (item.price + toppingPrice) * item.quantity;

    return (
      <View className="flex-row items-center py-3 border-b border-gray-200">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 mr-3 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-700">
            {item.name} x {item.quantity}
          </Text>
          {item.selectedToppings && item.selectedToppings.length > 0 && (
            <View className="mt-1">
              {item.selectedToppings.map((top) => (
                <Text key={top.id} className="text-xs text-gray-600">
                  + {top.name} (${top.price.toFixed(2)})
                </Text>
              ))}
            </View>
          )}
          <Text className="text-red-500 font-bold mt-1">
            ${itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="bg-white p-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-bold text-red-500 mb-4">Thanh toán</Text>
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Ghi chú khách hàng
          </Text>
          <TextInput
            placeholder="Có yêu cầu đặc biệt nào không?"
            value={note}
            onChangeText={setNote}
            className="bg-white border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Mã giảm giá
          </Text>
          <View className="flex-row items-center">
            <TextInput
              placeholder="Nhập mã giảm giá"
              value={voucherInput}
              onChangeText={setVoucherInput}
              editable={!appliedVoucher}
              className="flex-1 bg-white border border-gray-300 rounded-l px-3 py-2"
            />
            <TouchableOpacity
              onPress={handleApplyVoucher}
              className="bg-red-500 px-4 py-2 rounded-r"
            >
              <Text className="text-white font-semibold">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Các phần khác của giao diện checkout */}
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Chọn địa chỉ giao hàng
          </Text>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                onPress={() => setSelectedAddress(addr.id)}
                className={`p-3 mb-2 border rounded-lg ${
                  selectedAddress === addr.id ? "border-red-500" : "border-gray-200"
                }`}
              >
                <Text className="text-gray-800 font-semibold">{addr.name}</Text>
                <Text className="text-gray-600 text-sm">{addr.phone}</Text>
                <Text className="text-gray-700">{addr.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Chọn chi nhánh
          </Text>
          <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
            {branches.map((branch) => (
              <TouchableOpacity
                key={branch.id}
                onPress={() => setSelectedBranch(branch.id)}
                className={`p-3 mb-2 border rounded-lg ${
                  selectedBranch === branch.id ? "border-red-500" : "border-gray-200"
                }`}
              >
                <Text className="text-gray-800 font-semibold">{branch.title}</Text>
                <Text className="text-gray-600 text-sm">{branch.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">
            Phương thức thanh toán
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setPaymentMethod("cash")}
              className={`flex-1 p-3 mr-2 border rounded-lg ${
                paymentMethod === "cash"
                  ? "border-red-500 bg-red-100"
                  : "border-gray-200"
              }`}
            >
              <Text className="text-gray-800 font-semibold">Tiền mặt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod("card")}
              className={`flex-1 p-3 border rounded-lg ${
                paymentMethod === "card"
                  ? "border-red-500 bg-red-100"
                  : "border-gray-200"
              }`}
            >
              <Text className="text-gray-800 font-semibold">Mã QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mt-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Tổng phụ</Text>
            <Text className="text-gray-800">${cartSubtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phí giao hàng</Text>
            <Text className="text-gray-800">$1.00</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Giảm giá voucher</Text>
            <Text className="text-gray-800">-${discountValue.toFixed(2)}</Text>
          </View>
          <View className="border-t border-gray-200 my-2" />
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-bold">Tổng cộng</Text>
            <Text className="text-lg font-bold text-red-500">${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
        <View>
          <Text className="text-sm text-gray-500">Tổng thanh toán</Text>
          <Text className="text-xl font-bold text-red-500">${total.toFixed(2)}</Text>
        </View>
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
