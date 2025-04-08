import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Animated } from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ManageAccounts = () => {
    const [accountList, setAccountList] = useState([]);
    const [newAccount, setNewAccount] = useState({ username: '', email: '', password: '', role: '' });
    const [editAccount, setEditAccount] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertModalType, setAlertModalType] = useState('success');
    const [alertModalMessage, setAlertModalMessage] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);
    const scrollRef = useRef(null);

    const addButtonAnim = useRef(new Animated.Value(1)).current;
    const updateButtonAnim = useRef(new Animated.Value(1)).current;
    const cancelButtonAnim = useRef(new Animated.Value(1)).current;
    const modalCancelButtonAnim = useRef(new Animated.Value(1)).current;
    const modalDeleteButtonAnim = useRef(new Animated.Value(1)).current;
    const modalCloseButtonAnim = useRef(new Animated.Value(1)).current;
    const roleAnim = useRef(new Animated.Value(1)).current;

    const roleOptions = [
        { label: 'Customer', value: 'customer' },
        { label: 'Employee', value: 'employee' },
        { label: 'Admin', value: 'admin' },
        { label: 'Shipper', value: 'shipper' },
    ];

    useEffect(() => {
        fetchAccounts();
    }, []);

    const API_LOCAL = `http://192.168.1.28:5000`;
    const fetchAccounts = async () => {
        try {
            const response = await axios.get(`${API_LOCAL}/api/accounts`);
            console.log('Fetched accounts:', response.data);
            setAccountList(response.data);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            showAlertModal('error', 'Không thể tải danh sách tài khoản.');
        }
    };

    const handleInputChange = useCallback((key, value) => {
        setNewAccount(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleAddAccount = async () => {
        if (!newAccount.username || !newAccount.email || !newAccount.password || !newAccount.role) {
            showAlertModal('error', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
            return;
        }
        try {
            const response = await axios.post(`${API_LOCAL}/api/accounts`, newAccount);
            setAccountList(prev => [response.data, ...prev]);
            showAlertModal('success', `${newAccount.username} đã được thêm thành công!`);
            setNewAccount({ username: '', email: '', password: '', role: '' });
            setIsAddMode(false);
        } catch (error) {
            showAlertModal('error', 'Không thể thêm tài khoản.');
        }
    };

    const handleEditAccount = useCallback((account) => {
        setEditAccount(account);
        setNewAccount({
            username: account.username,
            email: account.email,
            password: '',
            role: account.role,
        });
        setIsAddMode(true);
        if (scrollRef.current) {
            scrollRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, []);

    const handleUpdateAccount = async () => {
        if (!newAccount.username || !newAccount.email || !newAccount.role) {
            showAlertModal('error', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
            return;
        }
        try {
            const updateData = {
                username: newAccount.username,
                email: newAccount.email,
                role: newAccount.role,
            };
            if (newAccount.password) updateData.password = newAccount.password;
            const response = await axios.put(`${API_LOCAL}/api/accounts/${editAccount._id}`, updateData);
            setAccountList(prevAccounts => prevAccounts.map(item => (item._id === editAccount._id ? response.data : item)));
            showAlertModal('success', `${newAccount.username} đã được cập nhật thành công!`);
            setNewAccount({ username: '', email: '', password: '', role: '' });
            setEditAccount(null);
            setIsAddMode(false);
        } catch (error) {
            showAlertModal('error', 'Không thể cập nhật tài khoản.');
        }
    };

    const handleDeleteAccount = useCallback((account) => {
        setAccountToDelete(account);
        setModalVisible(true);
    }, []);

    const confirmDelete = async () => {
        if (accountToDelete) {
            try {
                await axios.delete(`${API_LOCAL}/api/accounts/${accountToDelete._id}`);
                setAccountList(prevAccounts => prevAccounts.filter(item => item._id !== accountToDelete._id));
                showAlertModal('success', `${accountToDelete.username} đã được xóa thành công!`);
            } catch (error) {
                showAlertModal('error', 'Không thể xóa tài khoản.');
            }
        }
        setModalVisible(false);
    };

    const showAlertModal = (type, message) => {
        setAlertModalType(type);
        setAlertModalMessage(message);
        setAlertModalVisible(true);
    };

    const animateButton = (animValue, callback) => {
        Animated.sequence([
            Animated.timing(animValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(() => callback && callback());
    };

    const navigation = useNavigation();

    const renderItem = useCallback(({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.username}</Text>
                    <Text style={styles.cardPrice}>{item.email}</Text>
                    <Text style={styles.cardDescription}>Vai trò: {item.role}</Text>
                </View>
            </View>
            <Card.Actions style={styles.cardActions}>
                <IconButton icon="pencil" color="#4682B4" onPress={() => handleEditAccount(item)} />
                <IconButton icon="delete" color="#FF4500" onPress={() => handleDeleteAccount(item)} />
            </Card.Actions>
        </Card>
    ), [handleEditAccount, handleDeleteAccount]);

    const memoizedAccountList = useMemo(() => accountList, [accountList]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.gradient}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {isAddMode ? 'Thêm tài khoản' : 'Danh sách tài khoản'}
                    </Text>
                </View>
                {isAddMode ? (
                    <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
                        <TextInput
                            label="Tên đăng nhập (*)"
                            value={newAccount.username}
                            onChangeText={(text) => handleInputChange('username', text)}
                            style={styles.input}
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <TextInput
                            label="Email (*)"
                            value={newAccount.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            style={styles.input}
                            keyboardType="email-address"
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <TextInput
                            label="Mật khẩu (*)"
                            value={newAccount.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            style={styles.input}
                            secureTextEntry
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Vai trò (*)</Text>
                            <Animated.View style={{ transform: [{ scale: roleAnim }] }}>
                                <Picker
                                    selectedValue={newAccount.role}
                                    onValueChange={(itemValue) => {
                                        handleInputChange('role', itemValue);
                                        Animated.sequence([
                                            Animated.timing(roleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                                            Animated.timing(roleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                                        ]).start();
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Chọn vai trò" value="" />
                                    {roleOptions.map((option, index) => (
                                        <Picker.Item key={index} label={option.label} value={option.value} />
                                    ))}
                                </Picker>
                            </Animated.View>
                        </View>
                        {editAccount ? (
                            <>
                                <Animated.View style={{ transform: [{ scale: updateButtonAnim }] }}>
                                    <Button
                                        mode="contained"
                                        onPress={() => animateButton(updateButtonAnim, handleUpdateAccount)}
                                        style={styles.submitButton}
                                    >
                                        Cập nhật
                                    </Button>
                                </Animated.View>
                                <Animated.View style={{ transform: [{ scale: cancelButtonAnim }] }}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => animateButton(cancelButtonAnim, () => {
                                            setEditAccount(null);
                                            setNewAccount({ username: '', email: '', password: '', role: '' });
                                            setIsAddMode(false);
                                        })}
                                        style={styles.cancelButton}
                                    >
                                        Hủy
                                    </Button>
                                </Animated.View>
                            </>
                        ) : (
                            <>
                                <Animated.View style={{ transform: [{ scale: addButtonAnim }] }}>
                                    <Button
                                        mode="contained"
                                        onPress={() => animateButton(addButtonAnim, handleAddAccount)}
                                        style={styles.submitButton}
                                    >
                                        Thêm tài khoản
                                    </Button>
                                </Animated.View>
                                <Animated.View style={{ transform: [{ scale: cancelButtonAnim }] }}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => animateButton(cancelButtonAnim, () => {
                                            setIsAddMode(false);
                                        })}
                                        style={styles.cancelButton}
                                    >
                                        Quay lại
                                    </Button>
                                </Animated.View>
                            </>
                        )}
                    </ScrollView>
                ) : memoizedAccountList.length === 0 ? (
                    <Text style={styles.noDataText}>Không có tài khoản nào.</Text>
                ) : (
                    <FlatList
                        ref={scrollRef}
                        data={memoizedAccountList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id.toString()}
                        keyboardShouldPersistTaps="handled"
                        ListHeaderComponent={
                            <View style={styles.headerButtons}>
                                <Button mode="contained" onPress={() => setIsAddMode(true)} style={styles.addButton}>
                                    Thêm tài khoản
                                </Button>
                            </View>
                        }
                    />
                )}
                <Modal isVisible={isModalVisible} animationIn="fadeIn" animationOut="fadeOut">
                    <View style={styles.modalContainer}>
                        <Icon name="warning" type="material" color="#FF4500" size={40} />
                        <Text style={styles.modalTitle}>Xác nhận xóa</Text>
                        <Text style={styles.modalText}>
                            Bạn có chắc muốn xóa {accountToDelete?.username} không?
                        </Text>
                        <View style={styles.modalButtons}>
                            <Animated.View style={{ transform: [{ scale: modalCancelButtonAnim }] }}>
                                <Button
                                    onPress={() => animateButton(modalCancelButtonAnim, () => setModalVisible(false))}
                                    style={styles.modalCancelButton}
                                >
                                    Hủy
                                </Button>
                            </Animated.View>
                            <Animated.View style={{ transform: [{ scale: modalDeleteButtonAnim }] }}>
                                <Button
                                    onPress={() => animateButton(modalDeleteButtonAnim, confirmDelete)}
                                    style={styles.modalDeleteButton}
                                >
                                    Xóa
                                </Button>
                            </Animated.View>
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={isAlertModalVisible} animationIn="fadeIn" animationOut="fadeOut">
                    <View style={styles.modalContainer}>
                        {alertModalType === 'success' ? (
                            <Icon name="check-circle" type="material" color="#4682B4" size={40} />
                        ) : (
                            <Icon name="error" type="material" color="#FF4500" size={40} />
                        )}
                        <Text style={styles.modalTitle}>
                            {alertModalType === 'success' ? 'Thành công' : 'Lỗi'}
                        </Text>
                        <Text style={styles.modalText}>{alertModalMessage}</Text>
                        <Animated.View style={{ transform: [{ scale: modalCloseButtonAnim }] }}>
                            <Button
                                onPress={() => animateButton(modalCloseButtonAnim, () => setAlertModalVisible(false))}
                                style={styles.modalCloseButton}
                            >
                                Đóng
                            </Button>
                        </Animated.View>
                    </View>
                </Modal>
            </LinearGradient>
        </KeyboardAvoidingView>
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
        fontSize: 22,
        fontWeight: '600',
        color: '#4682B4',
        marginLeft: 10,
    },
    scrollContainer: { padding: 25 },
    input: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        paddingHorizontal: 15,
        fontSize: 16,
    },
    submitButton: {
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: '#4682B4',
        paddingVertical: 8,
        elevation: 2,
    },
    cancelButton: {
        marginVertical: 15,
        borderRadius: 10,
        borderColor: '#4682B4',
        borderWidth: 1,
        backgroundColor: 'transparent',
        paddingVertical: 8,
    },
    card: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    cardText: { flex: 1 },
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
        color: '#666',
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    pickerContainer: { marginBottom: 20 },
    pickerLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    picker: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DCDCDC',
        color: '#333',
    },
    addButton: {
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: '#4682B4',
        paddingVertical: 8,
        elevation: 2,
    },
    headerButtons: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DCDCDC',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 15,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalCancelButton: {
        backgroundColor: '#4682B4',
        borderRadius: 10,
        paddingVertical: 5,
        width: 100,
    },
    modalDeleteButton: {
        backgroundColor: '#FF4500',
        borderRadius: 10,
        paddingVertical: 5,
        width: 100,
    },
    modalCloseButton: {
        backgroundColor: '#4682B4',
        borderRadius: 10,
        paddingVertical: 5,
        width: 120,
    },
    noDataText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ManageAccounts;