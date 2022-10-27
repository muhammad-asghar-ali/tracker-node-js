import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import transactionRoute from './routes/transaction.route.js'
dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoute)

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize: 50 });
mongoose.connection
    .once('open', () => { console.log("connection open"); })
    .on('error', err => {
        console.log(err);
        console.log('DB is not connected');
        throw err;
    })

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal server error"
    const stack = process.env.NODE_ENV === "dev" ? err.stack : null

    res.status(status).json({
        message,
        stack
    })
})

const port = process.env.PORT || 3005
app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})


