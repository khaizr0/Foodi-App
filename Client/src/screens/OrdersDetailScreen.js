import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Thêm axios để gọi API
import { Alert } from 'react-native'; // Thêm Alert để thông báo


const OrdersDetailScreen = ({ route }) => {
  const { order } = route.params; // Lấy dữ liệu đơn hàng từ params
  const [currentOrder, setCurrentOrder] = useState(order); // State để quản lý đơn hàng
  const navigation = useNavigation();

  const handleConfirm = async (orderId) => {
    try {
      const response = await axios.put(`http://192.168.1.117:5000/api/orders/${orderId}/confirm`);
      console.log('Server response:', response.data);
      setCurrentOrder({ ...currentOrder, status: 'Đang chờ giao' }); // Cập nhật trạng thái trong state
      Alert.alert('Thành công', 'Đơn hàng đã được xác nhận thành "Đang chờ giao".');
    } catch (error) {
      console.error('Error confirming order:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Đơn hàng #{currentOrder.orderId}</Text>
            <Text style={styles.subtitle}>Khách hàng: {currentOrder.customer.name}</Text>
            <Text style={styles.detail}>Số điện thoại: {currentOrder.customer.phone}</Text>
            <Text style={styles.detail}>Địa chỉ: {currentOrder.customer.address}</Text>
            <Text style={styles.detail}>Mã đơn: {currentOrder.orderCode}</Text>
            <Text style={styles.detail}>Thời gian đặt: {new Date(currentOrder.orderTime).toLocaleString()}</Text>
            <Text style={styles.detail}>Thời gian giao: {currentOrder.deliveryTime || 'Chưa xác định'}</Text>
            <Text style={[styles.status, { color: currentOrder.status === 'Hoàn thành' ? '#32CD32' : currentOrder.status === 'Đã hủy' ? '#FF4500' : '#FFD700' }]}>
              Trạng thái: {currentOrder.status}
            </Text>
            <Text style={styles.notes}>Ghi chú: {currentOrder.notes || 'Không có'}</Text>

            <Text style={styles.itemsTitle}>Danh sách món:</Text>
            {currentOrder.items && currentOrder.items.length > 0 ? (
              currentOrder.items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemName}>{item.name} (x{item.quantity})</Text>
                  <Text style={styles.itemDescription}>{item.description || 'Không có mô tả'}</Text>
                  <Text style={styles.itemPrice}>Giá: {item.price.toLocaleString()} VND</Text>
                  {item.discount > 0 && (
                    <Text style={styles.itemDiscount}>Giảm: {item.discount.toLocaleString()} VND</Text>
                  )}
                  {item.toppings && item.toppings.length > 0 && (
                    <View>
                      <Text style={styles.toppingTitle}>Toppings:</Text>
                      {item.toppings.map((topping, idx) => (
                        <Text key={idx} style={styles.toppingText}>
                          - {topping.name}: {topping.price.toLocaleString()} VND
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noItems}>Không có món nào trong đơn hàng.</Text>
            )}

            <Text style={styles.priceTitle}>Chi tiết giá:</Text>
            <Text style={styles.priceDetail}>Tạm tính: {currentOrder.priceDetails.subtotal?.toLocaleString() || 0} VND</Text>
            <Text style={styles.priceDetail}>Thuế: {currentOrder.priceDetails.tax?.toLocaleString() || 0} VND</Text>
            <Text style={styles.priceDetail}>Giảm giá: {currentOrder.priceDetails.discount?.toLocaleString() || 0} VND</Text>
            <Text style={styles.priceTotal}>Tổng cộng: {currentOrder.priceDetails.total.toLocaleString()} VND</Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            {currentOrder.status === 'Đang xử lí' && (
              <Button
                mode="contained"
                onPress={() => handleConfirm(currentOrder._id)}
                style={styles.confirmButton}
              >
                Xác nhận
              </Button>
            )}
          </Card.Actions>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

// Cập nhật StyleSheet
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4682B4',
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#4682B4',
    marginTop: 2,
  },
  itemDiscount: {
    fontSize: 14,
    color: '#FF4500',
    marginTop: 2,
  },
  toppingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 5,
  },
  toppingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  noItems: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4682B4',
    marginTop: 15,
    marginBottom: 10,
  },
  priceDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  priceTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actions: {
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#4682B4',
  },
});

export default OrdersDetailScreen;