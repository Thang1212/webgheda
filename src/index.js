const express = require('express')
const colors = require('colors')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const handlebars = require('express-handlebars')
const path = require('path')

const route = require('./routes')
const db = require('./config/db')

// Database connection
db.connectDB()

// .env config
dotenv.config()

const app = express()
const port = process.env.PORT || 8080

// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        // helpers: require('./helpers/handlebars'),
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Init route
// app.get('/', (req, res) => {
//     res.send('Hello World! Hehe')
// })
route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`.white.bgBlue)
})
