import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

import ManageFoods from "../screens/AdminManageFoods";
import ManageOrders from "../screens/AdminManageOrders";
import ManageAccounts from "../screens/AdminManageAccount";
import ManageRevenue from "../screens/AdminManageRevenue";
import FoodsDetailScreen from "../screens/FoodsDetailScreen"; 
import OrdersDetailScreen from "../screens/OrdersDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export default function AppNavigator() {
 return (
   <Stack.Navigator initialRouteName="Splash">
     {/* Các màn hình khởi tạo */}
     <Stack.Screen
       name="Splash"
       component={SplashScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="Login"
       component={LoginScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="Register"
       component={RegisterScreen}
       options={{ headerShown: false }}
     />

     {/* MainTabs chứa bottom navigation */}
     <Stack.Screen
       name="MainTabs"
       component={MainTabs}
       options={{ headerShown: false }}
     />

     <Stack.Screen
       name="ProductDetail"
       component={ProductDetailScreen}
       options={{ title: "Chi tiết sản phẩm" }}
     />
     <Stack.Screen
       name="Checkout"
       component={CheckoutScreen}
       options={{ title: "Thanh toán" }}
     />
     <Stack.Screen
       name="OrderTracking"
       component={OrderTrackingScreen}
       options={{ title: "Theo dõi đơn hàng" }}
     />

     {/* Các màn hình từ mục "Me" */}
     <Stack.Screen
       name="OrderStatusScreen"
       component={OrderStatusScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="AddressManagementScreen"
       component={AddressManagementScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="ReviewScreen"
       component={ReviewScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="ChangePasswordScreen"
       component={ChangePasswordScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="UpdateProfileScreen"
       component={UpdateProfileScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen 
       name="WriteReviewScreen" 
       component={WriteReviewScreen} 
       options={{ headerShown: false }} 
     />

     {/* Các màn hình quản lý địa chỉ */}
     <Stack.Screen
       name="AddAddressScreen"
       component={AddAddressScreen}
       options={{ headerShown: false }}
     />
     <Stack.Screen
       name="EditAddressScreen"
       component={EditAddressScreen}
       options={{ headerShown: false }}
     />

     {/* Màn hình chi tiết đơn hàng */}
     <Stack.Screen
       name="OrderDetailScreen"
       component={OrderDetailScreen}
       options={{ headerShown: false }}
     />
   </Stack.Navigator>
 );
}

const OrderStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen
              name="QuanLiDonHang"
              component={ManageOrders}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="OrderDetail"
              component={OrdersDetailScreen}
              options={{
                  title: 'Chi tiết đơn hàng',
                  headerStyle: {
                      backgroundColor: '#4682B4', // Xanh đậm đồng bộ
                  },
                  headerTintColor: 'rgb(255,255,224)', // Chữ vàng sáng
                  headerTitleStyle: {
                      fontWeight: '700',
                      fontSize: 22,
                  },
              }}
          />
      </Stack.Navigator>
  );
};

// Stack cho quản lý món ăn
const FoodStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen
              name="QuanLiMonAn"
              component={ManageFoods}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="FoodDetail"
              component={FoodsDetailScreen}
              options={{
                  title: 'Chi tiết món ăn',
                  headerStyle: {
                      backgroundColor: '#4682B4', // Xanh đậm đồng bộ
                  },
                  headerTintColor: 'rgb(255,255,224)', // Chữ vàng sáng
                  headerTitleStyle: {
                      fontWeight: '700',
                      fontSize: 22,
                  },
              }}
          />
      </Stack.Navigator>
  );
};

// Stack cho quản lý tài khoản
const AccountStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen
              name="QuanLiTaiKhoan"
              component={ManageAccounts}
              options={{ headerShown: false }}
          />
      </Stack.Navigator>
  );
};
// Stack cho doanh thu
const RevenueStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RevenueScreen"
        component={ManageRevenue}
        options={{
          title: 'Doanh thu',
          headerStyle: {
            backgroundColor: '#4682B4',
          },
          headerTintColor: 'rgb(255,255,224)',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 22,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export const App = () => {
  return (
      <NavigationContainer>
          <Tab.Navigator
              screenOptions={({ route }) => ({
                  tabBarIcon: ({ color, size }) => {
                      let iconName;
                      if (route.name === 'Đơn Hàng') {
                          iconName = 'clipboard-list';
                      } else if (route.name === 'Món Ăn') {
                          iconName = 'food';
                      } else if (route.name === 'Tài Khoản') {
                          iconName = 'account';
                      }
                      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#20B2AA', // Xanh ngọc thay cho tím
                  tabBarInactiveTintColor: '#666',
                  tabBarStyle: {
                      backgroundColor: '#FFF8DC', // Ngà nhẹ đồng bộ với card
                      borderTopColor: '#FFD700', // Viền vàng
                      borderTopWidth: 2,
                  },
              })}
          >
              <Tab.Screen name="Đơn Hàng" component={OrderStack} />
              <Tab.Screen name="Món Ăn" component={FoodStack} />
              <Tab.Screen name="Tài Khoản" component={AccountStack} />
              <Tab.Screen name="Doanh thu"
                          component={RevenueStack}
                          options={{
                              tabBarIcon: ({ color, size }) => (
                              <MaterialCommunityIcons name="chart-pie" size={size} color={color} />
                              ),
                          }}/>
          </Tab.Navigator>
      </NavigationContainer>
  );
};
