import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { CartContext } from "../context/CartContext";

// Địa chỉ IP cố định cho Android Emulator
const BASE_URL = "http://10.0.2.2:5000";

export default function CheckoutScreen({ navigation, route }) {
  const { cartItems, clearCart, user } = useContext(CartContext);

  // State cho thông tin đơn hàng
  const [note, setNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // State để lưu địa chỉ được chọn từ AddressManagementScreen
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Nếu có tham số selectedAddress từ AddressManagementScreen, cập nhật state
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress);
    }
  }, [route.params]);

  // Danh sách chi nhánh (giữ nguyên)
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
  const discountValue = appliedVoucher
    ? cartSubtotal * (appliedVoucher.discountPercentage / 100)
    : 0;
  const total = cartSubtotal - discountValue + deliveryFee;

  // Hàm xử lý áp dụng voucher
  const handleApplyVoucher = async () => {
    console.log("Bắt đầu xử lý voucher với input:", voucherInput);
    if (appliedVoucher) {
      Alert.alert("Voucher đã được áp dụng", "Mỗi đơn hàng chỉ được nhập 1 voucher duy nhất.");
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
      console.log("Phản hồi từ API voucher:", response);
      const voucherData = await response.json();
      console.log("Dữ liệu voucher nhận được:", voucherData);
      if (!response.ok) {
        Alert.alert("Voucher không hợp lệ", voucherData.error || "Voucher không tồn tại");
        return;
      }
      if (voucherData.used) {
        Alert.alert("Voucher đã được sử dụng", "Voucher này đã được sử dụng.");
        return;
      }
      setAppliedVoucher(voucherData);
      Alert.alert("Áp dụng voucher thành công", `Voucher giảm ${voucherData.discountPercentage}% cho đơn hàng của bạn.`);
    } catch (error) {
      console.error("Lỗi áp dụng voucher:", error);
      Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  // Hàm tạo object orderData
  const createOrderData = () => {
    // Kiểm tra để đảm bảo selectedAddress có đầy đủ dữ liệu
    if (!selectedAddress) {
      console.error("selectedAddress không tồn tại khi tạo orderData.");
      return null;
    }
    console.log("Tạo orderData với selectedAddress:", selectedAddress);
    
    return {
      userId: selectedAddress.userID || selectedAddress.userid || (user ? user.id : null),
      customer: {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
      },
      items: cartItems.map((item) => {
        const toppingPrice = item.selectedToppings
          ? item.selectedToppings.reduce((sum, t) => sum + t.price, 0)
          : 0;
        return {
          name: item.name,
          description: item.description || "",
          quantity: item.quantity,
          price: item.price,
          discount: 0,
          toppings: item.selectedToppings || [],
        };
      }),
      priceDetails: {
        subtotal: cartSubtotal,
        tax: 0,
        discount: discountValue,
        total: total,
      },
      notes: note,
      branch: branches.find((b) => b.id === selectedBranch),
      status: "Đang xử lí",
      orderTime: new Date(),
    };
  };

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = async () => {
    console.log("Bắt đầu đặt hàng.");
    try {
      if (!selectedAddress || !selectedAddress.name || !selectedAddress.phone || !selectedAddress.address) {
        console.error("Dữ liệu địa chỉ không hợp lệ:", selectedAddress);
        Alert.alert("Lỗi", "Dữ liệu địa chỉ không hợp lệ. Vui lòng kiểm tra lại");
        return;
      }
  
      const orderData = createOrderData();
      if (!orderData) {
        Alert.alert("Lỗi", "Dữ liệu đơn hàng không hợp lệ.");
        return;
      }
      console.log("Order Data:", orderData);
  
      if (paymentMethod === "cash") {
        const response = await fetch(`${BASE_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
  
        const result = await response.json();
  
        console.log("Fetch response status:", response.status);
        console.log("Fetch response body:", result);
  
        if (!response.ok) {
          console.error("Đặt hàng thất bại:", result);
          Alert.alert("Lỗi", result.error || "Đặt hàng thất bại!");
          return;
        }
        
        if (appliedVoucher) {
          await fetch(`${BASE_URL}/api/vouchers/${voucherInput.trim().toUpperCase()}/use`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });
        }
  
        Alert.alert("Đặt hàng thành công", "Đơn hàng của bạn đã được gửi và đang được xử lý.");
        navigation.replace("OrderTracking");
        clearCart();
      } else if (paymentMethod === "card") {
        navigation.navigate("QRPayment", { orderData });
      }
    } catch (error) {
      console.error("Order error:", error);
      Alert.alert("Lỗi", error.message);
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
          source={{ uri: item.imageUrl }}
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
      <ScrollView className="bg-white p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-2xl font-bold text-red-500 mb-4">Thanh toán</Text>

        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">Ghi chú khách hàng</Text>
          <TextInput
            placeholder="Có yêu cầu đặc biệt nào không?"
            value={note}
            onChangeText={setNote}
            className="bg-white border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <Text className="text-base font-semibold text-gray-800 mb-2">Mã giảm giá</Text>
          <View className="flex-row items-center">
            <TextInput
              placeholder="Nhập mã giảm giá"
              value={voucherInput}
              onChangeText={setVoucherInput}
              editable={!appliedVoucher}
              className="flex-1 bg-white border border-gray-300 rounded-l px-3 py-2"
            />
            <TouchableOpacity onPress={handleApplyVoucher} className="bg-red-500 px-4 py-2 rounded-r">
              <Text className="text-white font-semibold">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phần chọn địa chỉ giao hàng lấy từ AddressManagementScreen */}
        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">Địa chỉ giao hàng</Text>
          {selectedAddress ? (
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-bold text-gray-800">{selectedAddress.name}</Text>
              <Text className="text-gray-600">{selectedAddress.phone}</Text>
              <Text className="text-gray-700">{selectedAddress.address}</Text>
            </View>
          ) : (
            <Text className="text-gray-500 mb-2">Chưa chọn địa chỉ</Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("AddressManagementScreen")}
            className="bg-red-500 p-3 rounded-full mt-2"
          >
            <Text className="text-white text-center font-semibold">Chọn địa chỉ</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">Chọn chi nhánh</Text>
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

        {/* Danh sách sản phẩm */}
        <Text className="text-base font-semibold text-gray-800 mb-2">Danh sách món ăn</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text className="text-gray-500 mt-2">Giỏ hàng của bạn đang trống.</Text>
          }
        />

        <View className="mt-4">
          <Text className="text-base font-semibold text-gray-800 mb-2">Phương thức thanh toán</Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setPaymentMethod("cash")}
              className={`flex-1 p-3 mr-2 border rounded-lg ${
                paymentMethod === "cash" ? "border-red-500 bg-red-100" : "border-gray-200"
              }`}
            >
              <Text className="text-gray-800 font-semibold">Tiền mặt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod("card")}
              className={`flex-1 p-3 border rounded-lg ${
                paymentMethod === "card" ? "border-red-500 bg-red-100" : "border-gray-200"
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
        <TouchableOpacity onPress={handlePlaceOrder} className="bg-red-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
