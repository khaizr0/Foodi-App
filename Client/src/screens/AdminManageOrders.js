import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, StatusBar, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-paper';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const API_LOCAL = `http://10.0.2.2:5000`;
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_LOCAL}/api/orders`);
      console.log('Orders fetched:', response.data);
      if (Array.isArray(response.data)) {
        // Sort orders by _id (newest first) since _id contains timestamp
        const sortedOrders = [...response.data].sort((a, b) => 
          b._id.localeCompare(a._id)
        );
        setOrders(sortedOrders);
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

  // Xử lý kéo xuống để làm mới
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

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
        status: 'Hoàn thành',
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

  const renderItem = useCallback(
    ({ item }) => {
      const statusColors = {
        'Hoàn thành': '#4CAF50',     // Xanh lá đậm
        'Đã hủy': '#952323',         // Màu đỏ đậm
        'Đang chờ giao': '#FFA000',  // Cam đậm
        'Đang xử lý': '#03A9F4',     // Xanh nước biển
        'Đang giao': '#9C27B0',      // Tím
      };

      const statusColor = statusColors[item.status] || '#FFB433'; // Mặc định nếu không xác định

      return (
        <Card style={styles.card} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
          <View style={styles.cardContent}>
            <View style={styles.orderInfo}>
            <Text style={styles.cardTitle}>Đơn hàng: {item.orderId || item.orderId || 'Không có mã'}</Text>              
            <Text style={styles.cardPrice}>Tổng tiền: {item.priceDetails?.total?.toLocaleString() || '0'} VND</Text>
              <Text style={[styles.cardDescription, { color: statusColor }]}>
                Trạng thái: {item.status || 'Không có trạng thái'}
              </Text>
            </View>
            {item.status === 'Đang xử lý' && (
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
    },
    [navigation]
  );

  const memoizedOrderList = useMemo(() => orders, [orders]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      <LinearGradient colors={['#4A90E2', '#81C784']} style={styles.gradient}>
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
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingTop: 10 }}
            initialNumToRender={10}
            windowSize={5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4A90E2']}
                tintColor="#4A90E2"
                title="Đang tải dữ liệu..."
                titleColor="#4A90E2"
              />
            }
          />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
    paddingTop: 0,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#FFF8DC', // Màu ngà nhẹ
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  orderInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF5733', // Đỏ cam nổi bật
    marginVertical: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
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