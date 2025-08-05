const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Nạp biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;

// Các domain được phép gọi API
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://fe-mood-journal.vercel.app", // ✅ ADD dòng này
  "https://mood-journal-ai-snowy.vercel.app",
  "https://mood-journal-bak5ff9df-hieutrs-projects.vercel.app",
  "https://mood-journal-5ssdo4zbk-hieutrs-projects.vercel.app",
  "https://mood-journal-rmrew9vfg-hieutrs-projects.vercel.app"
];


// ✅ CORS cấu hình an toàn
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy does not allow access from this origin."));
    }
  },
  credentials: true
}));


// ✅ Xử lý body lớn (JSON + FormData)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ✅ API Routes
const journalsRoute = require('./routes/journals');
const authRoute = require('./routes/auth');

app.use('/api/journals', journalsRoute);
app.use('/api/auth', authRoute);

// ✅ Kiểm tra xem API còn sống
app.get("/", (req, res) => {
  res.send("🎉 Mood Journal API is running!");
});

// ✅ Kết nối MongoDB và chạy server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Dừng app nếu lỗi kết nối
  });
