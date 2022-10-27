import express from "express"
import {
    addTransaction,
    deleteTransaction,
    getAllTransactions,
    getAllTransactionsByuseridAndDate,
    totalExpenseAndTotalIncomeByUser,
    updateTransaction
} from "../controllers/transaction.controller.js"
import { verifyToken } from "../middlewares/auth"

const router = express.Router()

router.post('/add-transaction', verifyToken, addTransaction)
router.get('/', getAllTransactions)
router.get('/status', totalExpenseAndTotalIncomeByUser)
router.get('/user', getAllTransactionsByuseridAndDate)
router.put('/:id', verifyToken, updateTransaction)
router.delete('/:id', verifyToken, deleteTransaction)


export default router