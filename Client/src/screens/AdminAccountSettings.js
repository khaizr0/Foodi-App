import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Alert, StyleSheet } from "react-native";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    margin: 15,
    borderRadius: 15,
    backgroundColor: '#FFF8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    padding: 20,
  },
  profileInfo: {
    marginBottom: 20,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#FF4500',
    marginTop: 20,
  },
});

export default function AdminAccountSettings({ navigation }) {
  const [adminInfo, setAdminInfo] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch("http://10.0.2.2:5000/api/profile-info", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setAdminInfo({
            name: data.username || "Quản trị viên",
            email: data.email || "Chưa có email",
            phone: data.phone || "Chưa có số điện thoại",
          });
        } else {
          console.log("Không thể lấy thông tin tài khoản");
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin:", error.message);
      }
    };

    fetchAdminInfo();
  }, []);

  const handlePress = async (label) => {
    if (label === "Đổi mật khẩu") {
      navigation.navigate("ChangePasswordScreen");
    } else if (label === "Cập nhật hồ sơ") {
      navigation.navigate("UpdateProfileScreen");
    } else if (label === "Đăng xuất") {
      try {
        const response = await fetch("http://10.0.2.2:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          Alert.alert("Thông báo", "Đăng xuất thành công");
          navigation.replace("Login");
        } else {
          const data = await response.json();
          Alert.alert("Lỗi", data.error || "Không thể đăng xuất");
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message);
      }
    }
  };

  return (
    <LinearGradient colors={['#4A90E2', '#81C784']} style={styles.gradient}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông tin tài khoản</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileText, { fontWeight: 'bold', fontSize: 18 }]}>
                Tên người dùng: {adminInfo.name}
              </Text>
              <Text style={styles.profileText}>Email: {adminInfo.email}</Text>
              <Text style={styles.profileText}>Số điện thoại: {adminInfo.phone}</Text>
            </View>

            <Button 
              mode="contained" 
              onPress={() => handlePress("Cập nhật hồ sơ")}
              style={styles.button}
              icon={() => <Ionicons name="person-outline" size={20} color="white" />}
            >
              Cập nhật hồ sơ
            </Button>

            <Button 
              mode="contained" 
              onPress={() => handlePress("Đổi mật khẩu")}
              style={styles.button}
              icon={() => <Ionicons name="lock-closed-outline" size={20} color="white" />}
            >
              Đổi mật khẩu
            </Button>

            <Button 
              mode="contained" 
              onPress={() => handlePress("Đăng xuất")}
              style={[styles.button, styles.logoutButton]}
              icon={() => <Ionicons name="log-out-outline" size={20} color="white" />}
            >
              Đăng xuất
            </Button>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}