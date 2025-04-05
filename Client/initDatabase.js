// CHẠY "node .\initDatabase.js" để tạo database
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGO_URI = "mongodb://localhost:27017/foodDB";

// Kết nối tới MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Đã kết nối tới MongoDB"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Định nghĩa schema cho accounts
const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  role:     { type: String, enum: ["customer", "employee", "admin"], default: "customer" },
});

// Sử dụng tên model là "Account" và collection là "accounts"
const Account = mongoose.model("Account", accountSchema, "accounts");

async function initDatabase() {
  try {
    // Xóa hết dữ liệu cũ (nếu có) để làm sạch database
    await Account.deleteMany({});
    console.log("Xóa dữ liệu cũ thành công.");

    // Mã hoá mật khẩu với bcrypt
    const saltRounds = 10;

    // Tạo một số account mẫu
    const accounts = [
      {
        username: "customer1",
        email: "customer1@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        role: "customer",
      },
      {
        username: "employee1",
        email: "employee1@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        role: "employee",
      },
      {
        username: "admin1",
        email: "admin1@example.com",
        password: await bcrypt.hash("password123", saltRounds),
        role: "admin",
      },
    ];

    const result = await Account.insertMany(accounts);
    console.log("Tạo account thành công:", result);
  } catch (err) {
    console.error("Lỗi khi khởi tạo database:", err);
  } finally {
    mongoose.connection.close();
  }
}

initDatabase();
