const mysql = require('mysql2/promise')
const dotenv = require('dotenv') // Load biến môi trường từ .env

dotenv.config()

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || 'password',
            database: process.env.DB_NAME || 'database_name'
        })

        console.log('✅ Kết nối MySQL thành công!')
        return connection
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error)
        process.exit(1) // Dừng ứng dụng nếu không kết nối được
    }
};

module.exports = { connectDB } 
