import React from "react";
import { View, Text, TouchableOpacity, FlatList, Linking } from "react-native";

export default function StoreInfoScreen() {
  // Dữ liệu nhiều chi nhánh
  const branches = [
    {
      id: "1",
      title: "KFC Nguyễn Ánh Thủ",
      address:
        "KFC Nguyễn Ánh Thủ 2, 787 Đ. Nguyễn Ánh Thủ, P, Quận 12, Hồ Chí Minh 70000",
      phone: "+1 234 567 890",
      hours: "10:00 AM - 10:00 PM",
      mapsLink:
        "https://www.google.com/maps/dir//KFC+Nguy%E1%BB%85n+%E1%BA%A2nh+Th%E1%BB%A7+2,+787+%C4%90.+Nguy%E1%BB%85n+%E1%BA%A2nh+Th%E1%BB%A7,+P,+Qu%E1%BA%ADn+12,+H%E1%BB%93+Ch%C3%AD+Minh+70000/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x31752baa777cdde9:0xa20c43cf548305c1?sa=X&ved=1t:57443&ictx=111",
    },
    {
      id: "2",
      title: "KFC Lê Văn Sỹ",
      address: "KFC Lê Văn Sỹ, 123 Đường Lê Văn Sỹ, Quận 3, Hồ Chí Minh, 70000",
      phone: "+1 987 654 321",
      hours: "10:00 AM - 9:00 PM",
      mapsLink: "https://www.google.com/maps/place/KFC+Le+Van+Sy",
    },
    {
      id: "3",
      title: "KFC Nguyễn Trãi",
      address: "KFC Nguyễn Trãi, 456 Đường Nguyễn Trãi, Quận 1, Hồ Chí Minh, 70000",
      phone: "+1 555 666 777",
      hours: "10:00 AM - 10:30 PM",
      mapsLink: "https://www.google.com/maps/place/KFC+Nguyen+Trai",
    },
  ];

  const handleOpenMap = (url) => {
    Linking.openURL(url);
  };

  // Hàm render từng chi nhánh
  const renderBranch = ({ item }) => {
    return (
      <View className="bg-gray-50 rounded-xl p-4 shadow-md mb-4">
        <Text className="text-xl font-bold text-red-500 mb-2">
          {item.title}
        </Text>
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          Address:
        </Text>
        <Text className="text-gray-700 mb-2">{item.address}</Text>
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          Phone:
        </Text>
        <Text className="text-gray-700 mb-2">{item.phone}</Text>
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          Opening Hours:
        </Text>
        <Text className="text-gray-700 mb-4">{item.hours}</Text>
        <TouchableOpacity
          onPress={() => handleOpenMap(item.mapsLink)}
          className="bg-red-500 p-4 rounded-full"
        >
          <Text className="text-white text-center font-semibold">
            View on Google Maps
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header với tiêu đề mới */}
      <View className="px-4 pt-16 pb-4 border-b border-gray-200 mb-4">
        <Text className="text-4xl font-bold text-gray-800">
          Our Branches
        </Text>
      </View>
      {/* Danh sách chi nhánh */}
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranch}
      />
    </View>
  );
}
