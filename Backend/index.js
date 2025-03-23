const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Kết nối tới MongoDB (database foodDB)
mongoose.connect('mongodb://127.0.0.1:27017/foodDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// -----------------------
// Schema cho Account (User)
// -----------------------
const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["customer", "employee", "admin"], default: "customer" },
});
const Account = mongoose.model('Account', accountSchema, 'accounts');

// -----------------------
// API Đăng ký và Đăng nhập
// -----------------------

// API Đăng ký người dùng mới
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Kiểm tra xem tài khoản đã tồn tại chưa
    const existing = await Account.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }
    // Mã hoá mật khẩu với bcrypt (sử dụng saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Account({
      username,
      email,
      password: hashedPassword,
      role: role || "customer", // Mặc định role là customer nếu không truyền
    });
    await newAccount.save();
    console.log('Registered account:', newAccount);
    res.status(201).json({ message: 'Đăng ký thành công', account: { email: newAccount.email, role: newAccount.role } });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({ error: err.message });
  }
});

// API Đăng nhập người dùng
app.post('/api/auth/login', async (req, res) => {
  try {
    // Log body request để xem client gửi gì
    console.log("Login request body:", req.body);

    const { email, password } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      console.log("Account not found for email:", email);
      return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    console.log("Login successful for email:", email, "role:", account.role);

    res.json({
      message: 'Đăng nhập thành công',
      account: { email: account.email, role: account.role }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: err.message });
  }
});


// -----------------------
// Khởi động server
// -----------------------
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
