import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); 
  const scrollRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);
  const API_LOCAL = `http://192.168.1.28:5000`;
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_LOCAL}/api/orders`);
      console.log('Orders fetched:', response.data);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
        setError(null); 
      } else {
        throw new Error('Dữ liệu trả về không phải là mảng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng. Vui lòng kiểm tra kết nối hoặc máy chủ.');
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng.');
    }
  };

  const handleConfirm = async (orderId, currentStatus) => {
    if (currentStatus !== 'Đang xử lí') {
      Alert.alert('Thông báo', 'Chỉ có thể xác nhận đơn hàng ở trạng thái "Đang xử lí".');
      return;
    }
    try {
      const response = await axios.put(`${API_LOCAL}/api/orders/${orderId}/confirm`);
      console.log('Server response:', response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'Đang chờ giao' } : order
        )
      );
    } catch (error) {
      console.error('Error confirming order:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelivered = async (orderId, currentStatus) => {
    if (currentStatus !== 'Đang chờ giao') {
      Alert.alert('Thông báo', 'Chỉ có thể đánh dấu đã giao cho đơn hàng ở trạng thái "Đang chờ giao".');
      return;
    }
    try {
      const response = await axios.put(`${API_LOCAL}/api/orders/${orderId}`, {
        status: 'Hoàn thành'
      });
      console.log('Server response:', response.data);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'Hoàn thành' } : order
        )
      );
      Alert.alert('Thành công', 'Giao hàng thành công');
    } catch (error) {
      console.error('Error updating order:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể cập nhật đơn hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  const renderItem = useCallback(({ item }) => {
    const statusColor = item.status === 'Hoàn thành' ? '#32CD32' : item.status === 'Đã hủy' ? '#FF4500' : '#FFD700';
    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('OrderDetail', { order: item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.orderInfo}>
            <Text style={styles.cardTitle}>Khách hàng: {item.customer?.name || 'Không có tên'}</Text>
            <Text style={styles.cardPrice}>Tổng tiền: {item.priceDetails?.total?.toLocaleString() || '0'} VND</Text>
            <Text style={[styles.cardDescription, { color: statusColor }]}>
              Trạng thái: {item.status || 'Không có trạng thái'}
            </Text>
          </View>
          {item.status === 'Đang xử lí' && (
            <Button
              mode="contained"
              onPress={() => handleConfirm(item._id, item.status)}
              style={styles.confirmButton}
            >
              Xác nhận
            </Button>
          )}
          {item.status === 'Đang chờ giao' && (
            <Button
              mode="contained"
              onPress={() => handleDelivered(item._id, item.status)}
              style={styles.deliveredButton}
            >
              Đã giao hàng
            </Button>
          )}
        </View>
      </Card>
    );
  }, [navigation]);

  const memoizedOrderList = useMemo(() => orders, [orders]);

  return (
    <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.gradient}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách đơn hàng</Text>
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : memoizedOrderList.length === 0 ? (
        <Text style={styles.noDataText}>Không có đơn hàng nào.</Text>
      ) : (
        <FlatList
          ref={scrollRef}
          data={memoizedOrderList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()} 
          keyboardShouldPersistTaps="handled"
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DCDCDC',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4682B4',
    marginLeft: 10,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  orderInfo: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardPrice: {
    fontSize: 16,
    color: '#4682B4',
    marginVertical: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4500',
    textAlign: 'center',
    marginTop: 20,
  },
  confirmButton: {
    marginLeft: 10,
    backgroundColor: '#4682B4',
  },
  deliveredButton: {
    marginLeft: 10,
    backgroundColor: '#32CD32',
  },
});

export default ManageOrders;