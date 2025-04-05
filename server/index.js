const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Kết nối MongoDB Atlas
const mongoURI = "mongodb+srv://vinhkha7171:vinhkha063@fooddb.vrtde4i.mongodb.net/?retryWrites=true&w=majority&appName=foodDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Đã kết nối thành công đến MongoDB Atlas'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.use(session({
  secret: 'TheTrueValueOfLife', 
  resave: false,           
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60  // 1 giờ
  }
}));

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'khaizr0.maillerautosend@gmail.com',
    pass: 'jeruuvjhmtfrvrkf',
  },
});

const otpStore = {};

// Schema cho món ăn
const foodSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.*\.(jpeg|jpg|png|gif)$/i.test(v);
      },
      message: 'URL ảnh không hợp lệ!'
    }
  },
  name: { type: String, required: true },
  region: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
});
const Food = mongoose.model('Food', foodSchema);

// Schema cho tài khoản
const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
});
const Account = mongoose.model('Account', accountSchema, 'accounts');

// Schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [{
    name: { type: String, required: true },
    description: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    toppings: [{ name: String, price: Number }],
  }],
  priceDetails: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  status: { 
    type: String, 
    enum: ['Đang xử lí', 'Đang chờ giao', 'Hoàn thành', 'Đã hủy'],
    default: 'Đang xử lí' 
  },
  notes: String,
  orderCode: String,
  orderTime: { type: Date, default: Date.now },
  deliveryTime: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'orders' });
const Order = mongoose.model('Order', orderSchema);

// API cho món ăn (giữ nguyên)
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error('Error fetching foods:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/foods', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json(savedFood);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedFood) return res.status(404).json({ error: 'Food not found' });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ error: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await Account.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });
    const savedAccount = await newAccount.save();
    res.status(201).json({ 
      message: 'Đăng ký thành công', 
      account: { email: savedAccount.email, role: savedAccount.role } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server khi đăng ký' });
  }
});

//Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    req.session.user = {
      userId: account._id,
      email: account.email,
      role: account.role
    };

    res.json({
      message: 'Đăng nhập thành công',
      account: { email: account.email, role: account.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server khi đăng nhập' });
  }
});


//logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Không thể đăng xuất, vui lòng thử lại' });
    }
    res.json({ message: 'Đăng xuất thành công' });
  });
});

//Session checker
app.get('/api/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const userId = req.session.user.id;
  res.json({ message: 'Thông tin người dùng', userId, email: req.session.user.email });
});

// API cho đơn hàng (giữ nguyên)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (!req.body.orderId) {
      const count = await Order.countDocuments();
      req.body.orderId = `GF-${count + 1}`;
    }
    if (!req.body.orderCode) {
      req.body.orderCode = `A-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const { ObjectId } = require('mongoose').Types;
app.put('/api/orders/:id/confirm', async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const order = await Order.findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'Đang xử lí') {
      return res.status(400).json({ error: 'Only processing orders can be confirmed' });
    }
    order.status = 'Đang chờ giao';
    order.updatedAt = Date.now();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// API gửi yêu cầu reset mật khẩu qua OTP
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Account.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email không tồn tại trong hệ thống, vui lòng nhập lại hoặc đăng kí tài khoản' });
    }
    // Tạo OTP 6 chữ số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp; // Lưu OTP tạm thời (có thể thêm thời gian hết hạn nếu cần)

    const mailOptions = {
      from: 'khaizr0.maillerautosend@gmail.com',
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 15 phút.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error sending email.' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'Email gửi thành công, vui lòng kiểm tra hộp thư của bạn để lấy mã OTP.' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error occurred.' });
  }
});

// API xác nhận OTP và reset mật khẩu
app.post('/api/auth/reset-password-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }
    const user = await Account.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email không tồn tại trong hệ thống.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    delete otpStore[email];
    res.json({ message: 'Mật khẩu đã được cập nhật thành công.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error occurred.' });
  }
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});