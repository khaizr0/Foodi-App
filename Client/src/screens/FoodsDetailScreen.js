import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Paragraph, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const FoodsDetailScreen = ({ route }) => {
    const { food } = route.params;

    return (
        <LinearGradient colors={['#4A90E2', '#81C784']} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    {food.imageUrl ? (
                        <Image source={{ uri: food.imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>Chưa có ảnh</Text>
                        </View>
                    )}
                    <Card.Content style={styles.content}>
                        <Text style={styles.title}>{food.name}</Text>
                        <Text style={styles.price}>{food.price.toLocaleString()} VND</Text>
                        <View style={styles.infoSection}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.icon}>📌</Text>
                                <Paragraph style={styles.paragraph}>{food.description}</Paragraph>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.icon}>🍽</Text>
                                <Paragraph style={styles.paragraph}>Loại: {food.category}</Paragraph>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.icon}>📍</Text>
                                <Paragraph style={styles.paragraph}>Vùng miền: {food.region}</Paragraph>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 25,
        backgroundColor: '#FFF8DC', // Ngà nhẹ ấm áp
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 280,
        resizeMode: 'cover',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomWidth: 3,
        borderBottomColor: '#FFD700', // Viền vàng dưới ảnh
    },
    imagePlaceholder: {
        width: '100%',
        height: 280,
        backgroundColor: '#E6FFFA', // Xanh ngọc nhạt
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomWidth: 3,
        borderBottomColor: '#20B2AA', // Viền xanh ngọc
    },
    placeholderText: {
        fontSize: 20,
        color: '#20B2AA', // Xanh ngọc đậm
        fontWeight: '700',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    content: {
        padding: 25,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        color: '#000000', // Xanh đậm nổi bật
        marginTop: 10,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    price: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        color: '#FF5733', // Đỏ cam
        marginVertical: 12,
        backgroundColor: 'rgba(255, 87, 51, 0.15)', // Nền đỏ nhạt
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF4500', // Viền đỏ đậm hơn
    },
    infoSection: {
        backgroundColor: 'rgba(240, 255, 240, 0.9)', // Xanh lá nhạt mờ
        borderRadius: 20,
        padding: 20,
        marginTop: 15,
        borderWidth: 2,
        borderColor: '#81C784', // Viền xanh lá sáng
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
        color: '#DAA520', // Vàng cam đậm
    },
    paragraph: {
        fontSize: 17,
        color: '#333',
        flex: 1,
        lineHeight: 24,
        fontWeight: '500',
    },
});

export default FoodsDetailScreen;