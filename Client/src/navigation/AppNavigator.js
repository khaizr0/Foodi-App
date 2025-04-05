import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import OrderStatusScreen from "../screens/OrderStatusScreen";
import AddressManagementScreen from "../screens/AddressManagementScreen";
import ReviewScreen from "../screens/ReviewScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import WriteReviewScreen from "../screens/WriteReviewScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import EditAddressScreen from "../screens/EditAddressScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordOTPScreen from "../screens/ResetPasswordOTPScreen";

import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Chi tiết sản phẩm" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Thanh toán" }} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: "Theo dõi đơn hàng" }} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPasswordOTPScreen" component={ResetPasswordOTPScreen} options={{ headerShown: false }} />

      {/* Màn hình trong mục Me */}
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddressManagementScreen" component={AddressManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} options={{ headerShown: false }} />

      {/* Địa chỉ */}
      <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} options={{ headerShown: false }} />

      {/* Chi tiết đơn hàng */}
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} options={{ headerShown: false }} />

      {/* 👉 Điều hướng tới giao diện admin */}
      <Stack.Screen name="AdminNavigator" component={AdminNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
