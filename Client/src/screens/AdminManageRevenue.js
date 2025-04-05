import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dữ liệu giả định cho đơn hàng trong ngày
const initialOrders = [
  {
    id: 'DH001',
    total: 150000,
    status: 'Hoàn thành',
    time: '10:30 AM',
    paymentMethod: 'Bank',
  },
  {
    id: 'DH002',
    total: 200000,
    status: 'Hoàn thành',
    time: '11:00 AM',
    paymentMethod: 'Momo',
  },
  {
    id: 'DH003',
    total: 100000,
    status: 'Đang xử lý',
    time: '11:30 AM',
    paymentMethod: 'Cash',
  },
  {
    id: 'DH004',
    total: 250000,
    status: 'Hoàn thành',
    time: '12:00 PM',
    paymentMethod: 'Bank',
  },
];

const ManageRevenue = () => {
  // State để quản lý danh sách đơn hàng, bộ lọc và trạng thái sắp xếp
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('All'); // Bộ lọc mặc định là "All"
  const [sortOrder, setSortOrder] = useState('desc'); // Sắp xếp mặc định từ lớn đến bé

  // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
  const totalRevenue = orders
    .filter(order => order.status === 'Hoàn thành')
    .reduce((sum, order) => sum + order.total, 0);

  // Hàm lọc đơn hàng theo phương thức thanh toán
  const filterOrders = (method) => {
    setFilter(method);
    if (method === 'All') {
      setOrders(initialOrders);
    } else {
      const filtered = initialOrders.filter(order => order.paymentMethod === method);
      setOrders(filtered);
    }
  };

  // Hàm sắp xếp đơn hàng theo tổng tiền
  const sortOrders = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);

    const sorted = [...orders].sort((a, b) => {
      if (newSortOrder === 'desc') {
        return b.total - a.total; // Từ lớn đến bé
      } else {
        return a.total - b.total; // Từ bé đến lớn
      }
    });
    setOrders(sorted);
  };

  // Hàm render từng mục đơn hàng
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
      <Text style={styles.orderTime}>Thời gian: {item.time}</Text>
      <Text style={styles.orderTotal}>Tổng tiền: {item.total.toLocaleString()} VND</Text>
      <Text style={styles.orderPayment}>Phương thức: {item.paymentMethod}</Text>
      <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doanh thu hôm nay</Text>
      </View>

      {/* Tổng doanh thu */}
      <View style={styles.totalRevenueContainer}>
        <Text style={styles.totalRevenueText}>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</Text>
      </View>

      {/* Bộ lọc và nút sắp xếp */}
      <View style={styles.filterSortContainer}>
        {/* Bộ lọc theo phương thức thanh toán */}
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

        {/* Nút sắp xếp */}
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

      {/* Danh sách đơn hàng */}
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
        ListHeaderComponent={<Text style={styles.listHeader}>Danh sách đơn hàng trong ngày</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có đơn hàng nào</Text>}
      />
    </View>
  );
};

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