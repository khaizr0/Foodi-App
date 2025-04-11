import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Format number function to replace toLocaleString
const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format date function to replace toLocaleDateString
const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ManageRevenue = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timePeriod, setTimePeriod] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.0.2.2:5000/api/orders');
      const data = await response.json();
      // Filter only completed orders
      const completedOrders = data.filter(order => order.status === 'Hoàn thành');
      setAllOrders(completedOrders);
      setOrders(completedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Filter orders by payment method
  const filterOrdersByPayment = (method) => {
    setFilter(method);
    filterOrders(method, timePeriod);
  };

  // Filter orders by time period
  const filterOrdersByTime = (period) => {
    setTimePeriod(period);
    filterOrders(filter, period);
  };

  // Combined filter function
  const filterOrders = (paymentMethod, period) => {
    let filtered = [...allOrders];
    
    // Apply payment method filter
    if (paymentMethod !== 'All') {
      filtered = filtered.filter(order => order.paymentMethod === paymentMethod);
    }
    
    // Apply time period filter
    const now = new Date();
    if (period === 'today') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderTime);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= weekAgo;
      });
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderTime);
        return orderDate >= monthAgo;
      });
    }
    
    // Apply current sort order
    sortOrdersArray(filtered);
  };

  // Sort orders by total amount
  const sortOrdersArray = (ordersArray) => {
    const sorted = [...ordersArray].sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.priceDetails.total - a.priceDetails.total;
      } else {
        return a.priceDetails.total - b.priceDetails.total;
      }
    });
    setOrders(sorted);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
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

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Calculate total revenue from filtered orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.priceDetails.total, 0);

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Bank':
        return <FontAwesome5 name="bank" size={16} color="#2F80ED" />;
      case 'Tiền mặt':
        return <FontAwesome5 name="money-bill-wave" size={16} color="#27AE60" />;
      default:
        return <FontAwesome5 name="money-bill-wave" size={16} color="#27AE60" />;
    }
  };

  // Render order item
  const renderOrderItem = ({ item }) => {
    const isExpanded = expandedOrderId === item._id;
    
    return (
      <TouchableOpacity 
        style={[styles.orderItem, isExpanded && styles.orderItemExpanded]} 
        onPress={() => toggleOrderExpansion(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>#{item.orderId}</Text>
            <View style={styles.orderStatusBadge}>
              <Text style={styles.orderStatusText}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.orderTotal}>{formatNumber(item.priceDetails.total)} VND</Text>
        </View>

        <View style={styles.orderInfoRow}>
          <View style={styles.orderInfoItem}>
            <FontAwesome5 name="calendar-alt" size={14} color="#666" />
            <Text style={styles.orderInfoText}>{formatDateString(item.orderTime)}</Text>
          </View>
          <View style={styles.orderInfoItem}>
            {getPaymentIcon(item.paymentMethod)}
            <Text style={styles.orderInfoText}>{item.paymentMethod || 'Tiền mặt'}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <Text style={styles.orderDetailsHeader}>Chi tiết đơn hàng</Text>
            {item.cart && item.cart.map((cartItem, index) => (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{cartItem.name} x{cartItem.quantity}</Text>
                <Text style={styles.cartItemPrice}>{formatNumber(cartItem.price * cartItem.quantity)} VND</Text>
              </View>
            ))}
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính:</Text>
                <Text style={styles.summaryValue}>{formatNumber(item.priceDetails.subtotal)} VND</Text>
              </View>
              {item.priceDetails.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Giảm giá:</Text>
                  <Text style={[styles.summaryValue, styles.discountText]}>-{formatNumber(item.priceDetails.discount)} VND</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                <Text style={styles.summaryValue}>{formatNumber(item.priceDetails.shipping)} VND</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalValue}>{formatNumber(item.priceDetails.total)} VND</Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.expandIconContainer}>
          <MaterialCommunityIcons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4682B4" barStyle="light-content" />
      <View style={styles.container}>

        {/* Dashboard */}
        <View style={styles.dashboardContainer}>
          <View style={styles.totalRevenueCard}>
            <Text style={styles.totalRevenueLabel}>Tổng doanh thu</Text>
            <Text style={styles.totalRevenueText}>{formatNumber(totalRevenue)} VND</Text>
            <Text style={styles.totalOrdersText}>{orders.length} đơn hàng</Text>
          </View>

          {/* Time period filter */}
          <View style={styles.timePeriodFilter}>
            <TouchableOpacity 
              style={[styles.periodButton, timePeriod === 'all' && styles.activePeriod]}
              onPress={() => filterOrdersByTime('all')}
            >
              <Text style={[styles.periodButtonText, timePeriod === 'all' && styles.activePeriodText]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, timePeriod === 'today' && styles.activePeriod]}
              onPress={() => filterOrdersByTime('today')}
            >
              <Text style={[styles.periodButtonText, timePeriod === 'today' && styles.activePeriodText]}>Hôm nay</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, timePeriod === 'week' && styles.activePeriod]}
              onPress={() => filterOrdersByTime('week')}
            >
              <Text style={[styles.periodButtonText, timePeriod === 'week' && styles.activePeriodText]}>7 ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, timePeriod === 'month' && styles.activePeriod]}
              onPress={() => filterOrdersByTime('month')}
            >
              <Text style={[styles.periodButtonText, timePeriod === 'month' && styles.activePeriodText]}>30 ngày</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter and sort */}
        <View style={styles.filterSortContainer}>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            <MaterialCommunityIcons
              name={sortOrder === 'desc' ? 'sort-descending' : 'sort-ascending'}
              size={20}
              color="#FFF"
            />
            <Text style={styles.sortButtonText}>
              {sortOrder === 'desc' ? 'Cao → Thấp' : 'Thấp → Cao'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders list */}
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View style={styles.listHeaderContainer}>
              <Text style={styles.listHeader}>Danh sách đơn hàng</Text>
              <Text style={styles.orderCount}>{orders.length} đơn</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="inbox" size={50} color="#DDD" />
              <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4682B4']}
              tintColor="#4682B4"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4682B4',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4682B4',
  },
  header: {
    backgroundColor: '#4682B4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dashboardContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 12,
    elevation: 2,
  },
  totalRevenueCard: {
    padding: 16,
    backgroundColor: '#EBF7FF',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  totalRevenueLabel: {
    fontSize: 16,
    color: '#4682B4',
    marginBottom: 8,
  },
  totalRevenueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E5984',
    marginBottom: 8,
  },
  totalOrdersText: {
    fontSize: 14,
    color: '#666',
  },
  timePeriodFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#F5F7FA',
  },
  activePeriod: {
    backgroundColor: '#4682B4',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activePeriodText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: 120,
    height: 40,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderItem: {
    margin: 8,
    marginBottom: 0,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  orderItemExpanded: {
    elevation: 4,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  orderStatusBadge: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderStatusText: {
    color: '#0288D1',
    fontSize: 12,
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  expandIconContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  orderDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  orderDetailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartItemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  discountText: {
    color: '#E74C3C',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ManageRevenue;