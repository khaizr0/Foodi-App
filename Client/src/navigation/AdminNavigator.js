import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Screens
import ManageFoods from "../screens/AdminManageFoods";
import ManageOrders from "../screens/AdminManageOrders";
import ManageAccounts from "../screens/AdminManageAccount";
import ManageRevenue from "../screens/AdminManageRevenue";
import FoodsDetailScreen from "../screens/FoodsDetailScreen";
import OrdersDetailScreen from "../screens/OrdersDetailScreen";
import AdminAccountSettings from "../screens/AdminAccountSettings";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const OrderStack = ({ role }) => {
  console.log('OrderStack role:', role);
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="QuanLiDonHang" 
        options={{ headerShown: false }}
      >
        {(props) => <ManageOrders {...props} role={role} />}
      </Stack.Screen>
      <Stack.Screen
        name="OrderDetail"
        component={OrdersDetailScreen}
        options={{
          title: 'Chi tiết đơn hàng',
          headerStyle: { backgroundColor: '#4682B4' },
          headerTintColor: 'rgb(255,255,224)',
          headerTitleStyle: { fontWeight: '700', fontSize: 22 },
        }}
      />
    </Stack.Navigator>
  );
};

const FoodStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="QuanLiMonAn" component={ManageFoods} options={{ headerShown: false }} />
    <Stack.Screen
      name="FoodDetail"
      component={FoodsDetailScreen}
      options={{
        title: 'Chi tiết món ăn',
        headerStyle: { backgroundColor: '#4682B4' },
        headerTintColor: 'rgb(255,255,224)',
        headerTitleStyle: { fontWeight: '700', fontSize: 22 },
      }}
    />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="QuanLiTaiKhoan" component={ManageAccounts} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AccountSetting = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminAccountSettingsScreen" component={AdminAccountSettings} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const RevenueStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RevenueScreen"
      component={ManageRevenue}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AdminNavigator = ({ route }) => {
  const role = route?.params?.role || 'admin';
  console.log('AdminNavigator received role:', role);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Đơn Hàng') iconName = 'clipboard-list';
          else if (route.name === 'Món Ăn') iconName = 'food';
          else if (route.name === 'Tài Khoản') iconName = 'account';
          else if (route.name === 'Doanh thu') iconName = 'chart-pie';
          else if (route.name === 'Cài Đặt') iconName = 'cog-outline';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#20B2AA',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFF8DC',
          borderTopColor: '#FFD700',
          borderTopWidth: 2,
        },
      })}
    >
      <Tab.Screen name="Đơn Hàng">
        {() => <OrderStack role={role} />}
      </Tab.Screen>
      {role !== 'shipper' && (
        <Tab.Screen name="Món Ăn" component={FoodStack} />
      )}
      {role !== 'employee' && role !== 'shipper' && (
        <Tab.Screen name="Tài Khoản" component={AccountStack} />
      )}
      {role !== 'employee' && role !== 'shipper' && (
        <Tab.Screen name="Doanh thu" component={RevenueStack} />
      )}
      <Tab.Screen name="Cài Đặt" component={AccountSetting} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
