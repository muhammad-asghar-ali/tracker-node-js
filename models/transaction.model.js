import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }, 
    type: {
        type: String,
        enum: ["expense", "income"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    refernce: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    }
}, { timestamps: true })

export default mongoose.model('transaction', transactionSchema)