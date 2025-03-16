import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import StoreInfoScreen from "../screens/StoreInfoScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Cấu hình icon cho từng tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Cart") {
            iconName = "cart-outline";
          } else if (route.name === "StoreInfo") {
            iconName = "storefront-outline";
          } else if (route.name === "Me") {
            iconName = "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#EF4444",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="StoreInfo" component={StoreInfoScreen} />
      <Tab.Screen name="Me" component={AccountSettingsScreen} />
    </Tab.Navigator>
  );
}
