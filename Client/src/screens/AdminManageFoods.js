import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Animated, Image } from 'react-native';
import { Card, TextInput, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ManageFoods = () => {
    const [foodList, setFoodList] = useState([]);
    const [newFood, setNewFood] = useState({ name: '', price: '', description: '', category: '', region: '', imageUrl: '', bannerUrl: '', isPopular: false });
    const [editFood, setEditFood] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState(null);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertModalType, setAlertModalType] = useState('success');
    const [alertModalMessage, setAlertModalMessage] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const scrollRef = useRef(null);

    const addButtonAnim = useRef(new Animated.Value(1)).current;
    const updateButtonAnim = useRef(new Animated.Value(1)).current;
    const cancelButtonAnim = useRef(new Animated.Value(1)).current;
    const modalCancelButtonAnim = useRef(new Animated.Value(1)).current;
    const modalDeleteButtonAnim = useRef(new Animated.Value(1)).current;
    const modalCloseButtonAnim = useRef(new Animated.Value(1)).current;
    const categoryAnim = useRef(new Animated.Value(1)).current;
    const regionAnim = useRef(new Animated.Value(1)).current;

    const categoryOptions = [
        { label: 'Món chính', value: 'Món chính', color: '#4682B4' },
        { label: 'Ăn vặt', value: 'Ăn vặt', color: '#FFD700' },
        { label: 'Giải khát', value: 'Giải khát', color: '#20B2AA' },
    ];

    const regionOptions = [
        { label: 'Bắc', value: 'Bắc', color: '#4682B4' },
        { label: 'Trung', value: 'Trung', color: '#DAA520' },
        { label: 'Nam', value: 'Nam', color: '#20B2AA' },
    ];

    useEffect(() => {
        fetchFoods();
    }, []);

    const API_LOCAL = `http://192.168.1.28:5000`;
    const fetchFoods = async () => {
        try {
            const response = await axios.get(`${API_LOCAL}/api/foods`);
            setFoodList(response.data);
            console.log('Dữ liệu nhận được:', response.data);
        } catch (error) {
            showAlertModal('error', 'Không thể tải danh sách món ăn.');
            throw error;
        }
    };

    const handleInputChange = useCallback((key, value) => {
        setNewFood(prev => ({ ...prev, [key]: value }));
        if (key === 'imageUrl') {
            setImagePreview(value);
        }
    }, []);

    const validateImageUrl = (url) => {
        return url.match(/^https?:\/\/.*\.(jpeg|jpg|png|gif)$/i);
    };

    const handleAddFood = async () => {
        if (!newFood.name || !newFood.price || !newFood.category || !newFood.region) {
            showAlertModal('error', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
            return;
        }
        if (newFood.imageUrl && !validateImageUrl(newFood.imageUrl)) {
            showAlertModal('error', 'URL ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (jpg, png, gif).');
            return;
        }
        try {
            const response = await axios.post('http:// 192.168.1.10:5000/api/foods', {
                ...newFood,
                price: parseInt(newFood.price.replace(/[^0-9]/g, ''), 10),
                isPopular: newFood.isPopular,
            });
            setFoodList(prev => [response.data, ...prev]);
            showAlertModal('success', `${newFood.name} đã được thêm thành công!`);
            setNewFood({ name: '', price: '', description: '', category: '', region: '', imageUrl: '', bannerUrl: '', isPopular: false });
            setImagePreview('');
            setIsAddMode(false);
        } catch (error) {
            showAlertModal('error', 'Không thể thêm món ăn.');
        }
    };

    const handleEditFood = useCallback((food) => {
        setEditFood(food);
        setNewFood({
            name: food.name,
            price: food.price.toString(),
            description: food.description,
            category: food.category,
            region: food.region,
            imageUrl: food.imageUrl || '',
            bannerUrl: food.bannerUrl || '',
            isPopular: food.isPopular || false,
        });
        setImagePreview(food.imageUrl || '');
        setIsAddMode(true);
        if (scrollRef.current) {
            scrollRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, []);

    const handleUpdateFood = async () => {
        if (!newFood.name || !newFood.price || !newFood.category || !newFood.region) {
            showAlertModal('error', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
            return;
        }
        if (newFood.imageUrl && !validateImageUrl(newFood.imageUrl)) {
            showAlertModal('error', 'URL ảnh không hợp lệ. Vui lòng nhập URL ảnh hợp lệ (jpg, png, gif).');
            return;
        }
        try {
            const response = await axios.put(`${API_LOCAL}/api/foods/${editFood._id}`, {
                ...newFood,
                price: parseInt(newFood.price.replace(/[^0-9]/g, ''), 10),
                isPopular: newFood.isPopular,
            });
            setFoodList(prevFoods => prevFoods.map(item => (item._id === editFood._id ? response.data : item)));
            showAlertModal('success', `${newFood.name} đã được cập nhật thành công!`);
            setNewFood({ name: '', price: '', description: '', category: '', region: '', imageUrl: '', bannerUrl: '', isPopular: false });
            setImagePreview('');
            setEditFood(null);
            setIsAddMode(false);
        } catch (error) {
            showAlertModal('error', 'Không thể cập nhật món ăn.');
        }
    };

    const handleDeleteFood = useCallback((food) => {
        setFoodToDelete(food);
        setModalVisible(true);
    }, []);

    const confirmDelete = async () => {
        if (foodToDelete) {
            try {
                await axios.delete(`${API_LOCAL}/api/foods/${foodToDelete._id}`);
                setFoodList(prevFoods => prevFoods.filter(item => item._id !== foodToDelete._id));
                showAlertModal('success', `${foodToDelete.name} đã được xóa thành công!`);
            } catch (error) {
                showAlertModal('error', 'Không thể xóa món ăn.');
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
        <Card style={styles.card} onPress={() => navigation.navigate('FoodDetail', { food: item })}>
            <View style={styles.cardContent}>
                {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
                ) : (
                    <Icon name="image" type="font-awesome" size={50} color="#4682B4" />
                )}
                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{item.price.toLocaleString()} VND</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    <Text style={styles.cardCategory}>Loại: {item.category}</Text>
                    <Text style={styles.cardRegion}>Vùng miền: {item.region}</Text>
                </View>
            </View>
            <Card.Actions style={styles.cardActions}>
                <IconButton icon="pencil" color="#4682B4" onPress={() => handleEditFood(item)} />
                <IconButton icon="delete" color="#FF4500" onPress={() => handleDeleteFood(item)} />
            </Card.Actions>
        </Card>
    ), [handleEditFood, handleDeleteFood, navigation]);

    const memoizedFoodList = useMemo(() => foodList, [foodList]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <LinearGradient colors={['#4A90E2', '#81C784']} style={styles.gradient}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{isAddMode ? 'Thêm món ăn' : 'Danh sách món ăn'}</Text>
                </View>
                {isAddMode ? (
                    <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
                        <TextInput
                            label="Tên món ăn (*)"
                            value={newFood.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            style={styles.input}
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <TextInput
                            label="Mô tả (*)"
                            value={newFood.description}
                            onChangeText={(text) => handleInputChange('description', text)}
                            style={styles.input}
                            multiline
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <TextInput
                            label="Giá (VND) (*)"
                            value={newFood.price}
                            onChangeText={(text) => handleInputChange('price', text)}
                            keyboardType="numeric"
                            style={styles.input}
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        <TextInput
                            label="Link ảnh món ăn"
                            value={newFood.imageUrl}
                            onChangeText={(text) => handleInputChange('imageUrl', text)}
                            style={styles.input}
                            placeholder="Nhập URL ảnh (jpg, png, gif)"
                            theme={{ colors: { text: '#333', primary: '#4682B4' } }}
                        />
                        {imagePreview ? (
                            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                        ) : null}
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Loại (*)</Text>
                            <Animated.View style={{ transform: [{ scale: categoryAnim }] }}>
                                <Picker
                                    selectedValue={newFood.category}
                                    onValueChange={(itemValue) => {
                                        handleInputChange('category', itemValue);
                                        Animated.sequence([
                                            Animated.timing(categoryAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                                            Animated.timing(categoryAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                                        ]).start();
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Chọn loại" value="" />
                                    {categoryOptions.map((option, index) => (
                                        <Picker.Item key={index} label={option.label} value={option.value} />
                                    ))}
                                </Picker>
                            </Animated.View>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Vùng miền (*)</Text>
                            <Animated.View style={{ transform: [{ scale: regionAnim }] }}>
                                <Picker
                                    selectedValue={newFood.region}
                                    onValueChange={(itemValue) => {
                                        handleInputChange('region', itemValue);
                                        Animated.sequence([
                                            Animated.timing(regionAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                                            Animated.timing(regionAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                                        ]).start();
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Chọn vùng miền" value="" />
                                    {regionOptions.map((option, index) => (
                                        <Picker.Item key={index} label={option.label} value={option.value} />
                                    ))}
                                </Picker>
                            </Animated.View>
                        </View>
                        {editFood ? (
                            <>
                                <Animated.View style={{ transform: [{ scale: updateButtonAnim }] }}>
                                    <Button
                                        mode="contained"
                                        onPress={() => animateButton(updateButtonAnim, handleUpdateFood)}
                                        style={styles.submitButton}
                                    >
                                        Cập nhật
                                    </Button>
                                </Animated.View>
                                <Animated.View style={{ transform: [{ scale: cancelButtonAnim }] }}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => animateButton(cancelButtonAnim, () => {
                                            setEditFood(null);
                                            setNewFood({ name: '', price: '', description: '', category: '', region: '', imageUrl: '', bannerUrl: '', isPopular: false });
                                            setImagePreview('');
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
                                        onPress={() => animateButton(addButtonAnim, handleAddFood)}
                                        style={styles.submitButton}
                                    >
                                        Thêm món
                                    </Button>
                                </Animated.View>
                                <Animated.View style={{ transform: [{ scale: cancelButtonAnim }] }}>
                                    <Button
                                        mode="outlined"
                                        onPress={() => animateButton(cancelButtonAnim, () => {
                                            setIsAddMode(false);
                                            setImagePreview('');
                                        })}
                                        style={styles.cancelButton}
                                    >
                                        Quay lại
                                    </Button>
                                </Animated.View>
                            </>
                        )}
                    </ScrollView>
                ) : (
                    <FlatList
                        ref={scrollRef}
                        data={memoizedFoodList}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id}
                        keyboardShouldPersistTaps="handled"
                        ListHeaderComponent={
                            <View style={styles.headerButtons}>
                                <Button mode="contained" onPress={() => setIsAddMode(true)} style={styles.addButton}>
                                    Thêm món ăn
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
                            Bạn có chắc muốn xóa {foodToDelete?.name} không?
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
    gradient: {
        flex: 1,
        backgroundColor: '#fff', // Để gradient nổi bật hơn
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#4682B4', // Màu xanh đậm hơn, không mờ
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: 'rgb(255,255,224)', // Vàng nổi bật trên nền xanh
        marginLeft: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    scrollContainer: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trắng mờ nhẹ
        borderRadius: 20,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    input: {
        marginBottom: 20,
        backgroundColor: '#F0F8FF', // Màu xanh nhạt dịu
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#20B2AA', // Xanh ngọc
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#FFD700', // Viền vàng nổi bật
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#DAA520', // Vàng cam đậm
        marginBottom: 8,
    },
    picker: {
        backgroundColor: '#F0FFF0', // Xanh lá nhạt
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#81C784', // Xanh lá sáng
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    submitButton: {
        marginVertical: 10,
        borderRadius: 15,
        backgroundColor: '#20B2AA', // Xanh ngọc đậm
        paddingVertical: 10,
        elevation: 6,
    },
    cancelButton: {
        marginVertical: 10,
        borderRadius: 15,
        borderColor: '#FF4500', // Đỏ cam
        borderWidth: 2,
        backgroundColor: 'transparent',
        paddingVertical: 10,
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
    foodImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#4682B4', // Viền xanh đậm
    },
    cardText: {
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
        fontSize: 15,
        color: '#666',
    },
    cardCategory: {
        fontSize: 15,
        color: '#20B2AA', // Xanh ngọc
        marginTop: 6,
        fontWeight: '600',
    },
    cardRegion: {
        fontSize: 15,
        color: '#DAA520', // Vàng cam
        marginTop: 6,
        fontWeight: '600',
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    headerButtons: {
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    addButton: {
        marginVertical: 10,
        borderRadius: 15,
        backgroundColor: '#4682B4', // Xanh đậm
        paddingVertical: 10,
        elevation: 6,
    },
    modalContainer: {
        backgroundColor: '#FFFACD', // Vàng nhạt dịu
        padding: 25,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FF4500', // Đỏ cam nổi bật
        marginVertical: 15,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalCancelButton: {
        backgroundColor: '#4682B4', // Xanh đậm
        borderRadius: 15,
        paddingVertical: 8,
        width: 110,
        elevation: 4,
    },
    modalDeleteButton: {
        backgroundColor: '#FF4500', // Đỏ cam
        borderRadius: 15,
        paddingVertical: 8,
        width: 110,
        elevation: 4,
    },
    modalCloseButton: {
        backgroundColor: '#20B2AA', // Xanh ngọc
        borderRadius: 15,
        paddingVertical: 8,
        width: 130,
        elevation: 4,
    },
});

export default ManageFoods;