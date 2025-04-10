import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ManageRevenue = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://10.0.2.2:5000/api/orders');
        const data = await response.json();
        // Filter only completed orders
        const completedOrders = data.filter(order => order.status === 'Hoàn thành');
        setOrders(completedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .reduce((sum, order) => sum + order.priceDetails.total, 0);

  // Filter orders by payment method
  const filterOrders = (method) => {
    setFilter(method);
    if (method === 'All') {
      setOrders(orders);
    } else {
      const filtered = orders.filter(order => order.paymentMethod === method);
      setOrders(filtered);
    }
  };

  // Sort orders by total amount
  const sortOrders = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);

    const sorted = [...orders].sort((a, b) => {
      if (newSortOrder === 'desc') {
        return b.priceDetails.total - a.priceDetails.total;
      } else {
        return a.priceDetails.total - b.priceDetails.total;
      }
    });
    setOrders(sorted);
  };

  // Render order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Mã đơn: {item.orderId}</Text>
      <Text style={styles.orderTime}>Thời gian: {new Date(item.orderTime).toLocaleString()}</Text>
      <Text style={styles.orderTotal}>Tổng tiền: {item.priceDetails.total.toLocaleString()} VND</Text>
      <Text style={styles.orderPayment}>Phương thức: {item.paymentMethod || 'Chưa xác định'}</Text>
      <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doanh thu từ đơn hàng hoàn thành</Text>
      </View>

      {/* Total revenue */}
      <View style={styles.totalRevenueContainer}>
        <Text style={styles.totalRevenueText}>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</Text>
      </View>

      {/* Filter and sort */}
      <View style={styles.filterSortContainer}>
        {/* Payment method filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Lọc theo phương thức: </Text>
          <Picker
            selectedValue={filter}
            style={styles.picker}
            onValueChange={(itemValue) => filterOrders(itemValue)}
          >
            <Picker.Item label="Tất cả" value="All" />
            <Picker.Item label="Bank" value="Bank" />
            <Picker.Item label="Momo" value="Momo" />
            <Picker.Item label="Cash" value="Cash" />
          </Picker>
        </View>

        {/* Sort button */}
        <TouchableOpacity style={styles.sortButton} onPress={sortOrders}>
          <MaterialCommunityIcons
            name={sortOrder === 'desc' ? 'sort-descending' : 'sort-ascending'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.sortButtonText}>
            Sắp xếp: {sortOrder === 'desc' ? 'Lớn → Bé' : 'Bé → Lớn'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders list */}
      <FlatList
        data={orders}
        keyExtractor={item => item._id}
        renderItem={renderOrderItem}
        ListHeaderComponent={<Text style={styles.listHeader}>Danh sách đơn hàng hoàn thành</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có đơn hàng nào</Text>}
      />
    </View>
  );
};

// Styles remain the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'rgb(255,255,224)',
    fontSize: 22,
    fontWeight: '700',
  },
  totalRevenueContainer: {
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
  totalRevenueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSortContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF8DC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  picker: {
    width: 150,
    height: 40,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    padding: 10,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 5,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#FFF8DC',
  },
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#FFF',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    color: '#008080',
    marginBottom: 5,
  },
  orderPayment: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ManageRevenue;
