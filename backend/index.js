require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

// import Routes
const routerUser = require('./routes/user')
const routerProduct = require('./routes/products')
const routerAdmin = require('./routes/admin')
const routerSetComputer = require('./routes/setComputer')

const app = express()

const allowedOrigins = [
  'http://localhost:3000',                // สำหรับรันในเครื่อง
  'https://your-frontend-app.vercel.app'  // <--- ใส่ลิงก์หน้าเว็บ Vue ที่ Deploy แล้วตรงนี้
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -ZK1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(cors(corsOptions))

// --- Setup MongoDB (แบบใหม่ Async/Await) ---
const connectDB = async () => {
  try {
    // ใช้ process.env.MONGO_URI จากไฟล์ .env
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    // ถ้าต่อไม่ได้ให้จบการทำงานโปรแกรมเลย (กัน error บานปลาย)
    process.exit(1)
  }
}

// !! สำคัญ: ต้องเรียกใช้ฟังก์ชันนี้ด้วยครับ ไม่งั้นมันจะไม่ต่อ DB
connectDB()

// --- Routes ---
app.use('/api/user', routerUser)
app.use('/api/products', routerProduct)
app.use('/api/setcomputer', routerSetComputer)
app.use('/api/admin', routerAdmin)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})