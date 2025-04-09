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
  phone: { type: String, default: "" },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
});
const Account = mongoose.model('Account', accountSchema, 'accounts');

// Schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
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

// Schema cho voucher
const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  used: { type: Boolean, default: false } // true nếu voucher đã được sử dụng
});
const Voucher = mongoose.model('Voucher', voucherSchema);

// Schema cho Địa chỉ
const storeAddressSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
});
const StoreAddressInfo = mongoose.model('StoreAddressInfo', storeAddressSchema, 'StoreAddressInfo');

// Schema cho Review
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

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
      phone:"",
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
      account: { email: account.email, role: account.role, userID: account._id }
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

// API cho Voucher
// Lấy danh sách tất cả các voucher
app.get('/api/vouchers', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (err) {
    console.error('Error fetching vouchers:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy thông tin voucher theo mã
app.get('/api/vouchers/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher không tồn tại' });
    }
    res.json(voucher);
  } catch (err) {
    console.error('Error fetching voucher:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Tạo mới một voucher
app.post('/api/vouchers', async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    // Chuyển mã voucher thành chữ in hoa để đảm bảo duy nhất
    const normalizedCode = code.toUpperCase();

    // Kiểm tra voucher đã tồn tại hay chưa
    const existingVoucher = await Voucher.findOne({ code: normalizedCode });
    if (existingVoucher) {
      return res.status(400).json({ error: 'Voucher đã tồn tại' });
    }

    const newVoucher = new Voucher({
      code: normalizedCode,
      discountPercentage,
    });

    const savedVoucher = await newVoucher.save();
    res.status(201).json(savedVoucher);
  } catch (err) {
    console.error('Error creating voucher:', err);
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

// Cập nhật trạng thái sử dụng voucher (đánh dấu voucher đã dùng)
app.put('/api/vouchers/:code/use', async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher không tồn tại' });
    }
    // Nếu voucher đã được sử dụng
    if (voucher.used) {
      return res.status(400).json({ error: 'Voucher đã được sử dụng' });
    }

    voucher.used = true;
    const updatedVoucher = await voucher.save();
    res.json(updatedVoucher);
  } catch (err) {
    console.error('Error updating voucher:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Xoá voucher theo mã (nếu cần)
app.delete('/api/vouchers/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const deletedVoucher = await Voucher.findOneAndDelete({ code: code.toUpperCase() });
    if (!deletedVoucher) {
      return res.status(404).json({ error: 'Voucher không tồn tại' });
    }
    res.json({ message: 'Voucher đã được xoá' });
  } catch (err) {
    console.error('Error deleting voucher:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// API lấy danh sách tất cả tài khoản
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cập nhật tài khoản
app.put('/api/accounts/:id', async (req, res) => {
  if (!req.session.user || req.session.user.userId !== req.params.id) {
    return res.status(401).json({ error: 'Unauthorized: không được cập nhật tài khoản của người khác' });
  }
  try {
    const updates = {
      username: req.body.username,
      phone: req.body.phone,
    };
    const updatedAccount = await Account.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!updatedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(updatedAccount);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error' });
  }
});

// Xóa tài khoản
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/profile-info', async (req, res) => {
  console.log('Session hiện tại:', req.session); // ✅ Log toàn bộ session
  console.log('Người dùng trong session:', req.session.user); // ✅ Log riêng user

  if (!req.session.user || !req.session.user.userId) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }

  try {
    const account = await Account.findById(req.session.user.userId);
    if (!account) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }
    res.json({
      userId: account._id,
      username: account.username,
      email: account.email,
      phone: account.phone || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server khi lấy thông tin hồ sơ' });
  }
});

app.put('/api/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session?.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }

  try {
    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    }

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server' });
  }
});

app.get('/api/orders/my-orders', async (req, res) => {
  console.log('Session hiện tại:', req.session);
  console.log('Người dùng trong session:', req.session.user);

  if (!req.session.user || !req.session.user.userId) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }

  try {
    const userId = req.session.user.userId;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng:", err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

app.put('/api/orders/:id/cancel', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('Đang xử lý hủy đơn hàng với ID:', orderId);

    // (Tuỳ chọn) Kiểm tra người dùng đã đăng nhập hay chưa
    if (!req.session.user) {
      console.log("Người dùng chưa đăng nhập");
      return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
    }

    // Kiểm tra định dạng ObjectId hợp lệ
    if (!ObjectId.isValid(orderId)) {
      console.log('ID đơn hàng không hợp lệ:', orderId);
      return res.status(400).json({ error: 'ID đơn hàng không hợp lệ' });
    }

    // Tìm đơn hàng theo ID
    const order = await Order.findById(orderId);
    console.log('Đơn hàng tìm được:', order);
    if (!order) {
      console.log('Không tìm thấy đơn hàng với ID:', orderId);
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    // (Tuỳ chọn) Kiểm tra xem người dùng hiện tại có phải là chủ đơn hàng không
    if (req.session.user.userId !== order.userId.toString()) {
      console.log("Người dùng không được phép hủy đơn hàng của người khác");
      return res.status(403).json({ error: 'Bạn không có quyền hủy đơn hàng này' });
    }

    // Kiểm tra trạng thái đơn hàng có thể huỷ được hay không
    console.log('Trạng thái đơn hàng hiện tại:', order.status);
    if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
      console.log('Không thể hủy đơn hàng vì trạng thái:', order.status);
      return res.status(400).json({ error: 'Đơn hàng đã hoàn thành hoặc đã bị hủy, không thể hủy lại' });
    }

    // Cập nhật trạng thái đơn hàng thành "Đã hủy"
    order.status = 'Đã hủy';
    order.updatedAt = Date.now();
    console.log('Cập nhật đơn hàng thành:', order);
    await order.save();

    console.log('Hủy đơn hàng thành công:', order);
    res.json({ message: 'Đơn hàng đã được hủy thành công', order });
  } catch (err) {
    console.error('Lỗi khi hủy đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server khi hủy đơn hàng' });
  }
});

app.post('/api/addresses', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const userId = req.session.user.userId; 
  const { name, phone, address } = req.body;
  try {
    const newAddress = new StoreAddressInfo({
      userid: userId,
      name,
      phone,
      address
    });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/addresses', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const userId = req.session.user.userId;
  try {
    const addresses = await StoreAddressInfo.find({ userid: userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const userId = req.session.user.userId; // ✅ sửa lại dòng này
  const { id } = req.params;
  const { name, phone, address } = req.body;

  try {
    const updatedAddress = await StoreAddressInfo.findOneAndUpdate(
      { _id: id, userid: userId },
      { name, phone, address },
      { new: true }
    );
    if (!updatedAddress) {
      return res
        .status(404)
        .json({ error: 'Địa chỉ không tồn tại hoặc không thuộc về bạn' });
    }
    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const userId = req.session.user.userId; // ✅ sửa lại dòng này
  const { id } = req.params;

  try {
    const deletedAddress = await StoreAddressInfo.findOneAndDelete({
      _id: id,
      userid: userId,
    });
    if (!deletedAddress) {
      return res
        .status(404)
        .json({ error: 'Địa chỉ không tồn tại hoặc không thuộc về bạn' });
    }
    res.json({ message: 'Đã xóa địa chỉ thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  if (!req.session.user || !req.session.user.userId) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  const { orderId, foodId, rating, reviewText } = req.body;
  try {
    // Kiểm tra đơn hàng của user có trạng thái "Hoàn thành" hay không
    const order = await Order.findOne({ _id: orderId, userId: req.session.user.userId, status: 'Hoàn thành' });
    if (!order) {
      return res.status(400).json({ error: 'Không tìm thấy đơn hàng đã giao hoặc đơn hàng không thuộc về bạn' });
    }
    // Kiểm tra xem đơn hàng có chứa món ăn đó hay không
    const itemExists = order.items.some(item => item._id.toString() === foodId);
    if (!itemExists) {
      return res.status(400).json({ error: 'Món ăn không tồn tại trong đơn hàng này' });
    }
    // Kiểm tra đã review chưa
    const existingReview = await Review.findOne({ orderId, foodId, userId: req.session.user.userId });
    if (existingReview) {
      return res.status(400).json({ error: 'Bạn đã đánh giá món ăn này rồi' });
    }
    const newReview = new Review({
      userId: req.session.user.userId,
      orderId,
      foodId,
      rating,
      reviewText,
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server khi gửi đánh giá' });
  }
});

app.get('/api/reviews/available', async (req, res) => {
  if (!req.session.user || !req.session.user.userId) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
  }
  try {
    const orders = await Order.find({ userId: req.session.user.userId, status: 'Hoàn thành' });
    let items = [];
    for (const order of orders) {
      for (const item of order.items) {
        // Kiểm tra xem review có tồn tại không
        const reviewExists = await Review.findOne({ orderId: order._id, foodId: item._id, userId: req.session.user.userId });

        // Nếu item.imageUrl không có, cố gắng tìm trong Food theo tên
        let imageUrl = item.imageUrl || null;
        if (!imageUrl) {
          const food = await Food.findOne({ name: item.name });
          if (food && food.imageUrl) {
            imageUrl = food.imageUrl;
          }
        }

        items.push({
          orderId: order._id,
          foodId: item._id,
          foodName: item.name,
          orderTime: order.orderTime,
          imageUrl: imageUrl,
          reviewed: reviewExists ? true : false,
        });
      }
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi server khi lấy danh sách review' });
  }
});

// Khởi động server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});