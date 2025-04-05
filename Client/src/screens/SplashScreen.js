import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image
        source={require("../../assets/logo.png")}
        className="w-32 h-32 mb-4"
        resizeMode="contain"
      />
      <Text className="text-red-500 text-2xl font-bold">Food App</Text>
    </View>
  );
}