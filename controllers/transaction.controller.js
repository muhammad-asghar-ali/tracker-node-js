import TransactionModel from '../models/transaction.model.js'
import { createError } from "../error.js"
import moment from 'moment'

export const addTransaction = async (req, res, next) => {
    try {
        const { amount, type, category, refernce, description } = req.body
        const id = req.user._id.toString()

        if (!amount || !type || !category || !refernce || !description) {
            return next(createError(400, "data is missing"))
        }

        const transaction = await TransactionModel.create({
            userId: id,
            amount,
            type,
            category,
            refernce,
            description
        })

        res.status(201).json({
            message: "transaction added",
            data: transaction
        })

    } catch (err) {
        next(err)
    }
}

export const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await TransactionModel.find({})

        if (!transactions.length) {
            return next(createError(404, "no transactions found"))
        }

        res.status(200).json({
            message: "transactions",
            data: transactions
        })

    } catch (err) {
        next(err)
    }
}

export const getAllTransactionsByuseridAndDate = async (req, res, next) => {
    try {
        const id = req.user._id.toString()
        const { frequency, selectedRange, type } = req.body
        // const transactions = await TransactionModel.find(
        //     {
        //         date: {
        //             $gt: moment().subtract(Number(req.body.frequency), 'd').toDate()
        //         },
        //         userId: id
        //     }
        // )

        const transactions = await TransactionModel.find({
            ...(frequency != custom
                ? {
                    date: {
                        $gt: moment().subtract(Number(req.body.frequency), 'd').toDate()
                    },
                } : {
                    date: {
                        $gte: selectedRange[0],
                        $lte: selectedRange[1]
                    },
                }

            ),
            userId: id,
            ...(type != 'all' && { type })
        })

        if (!transactions.length) {
            return next(createError(404, "no transactions found by user"))
        }

        res.status(200).json({
            message: "transactions by user",
            data: transactions
        })

    } catch (err) {
        next(err)
    }
}

export const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = req.body
        if (!id) {
            return next(createError(400, "id is missing"))
        }
        const transaction = await TransactionModel.findByIdAndUpdate(id, { $set: data }, { new: true })

        if (!transaction) {
            return next(createError(404, "no transactions found"))
        }

        res.status(200).json({
            message: "transaction updated",
            data: transaction
        })

    } catch (err) {
        next(err)
    }
}

export const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            return next(createError(400, "id is missing"))
        }
        const transaction = await TransactionModel.findByIdAndDelete(id)

        if (!transaction) {
            return next(createError(404, "no transactions found"))
        }

        res.status(200).json({
            message: "transaction delete",
            data: null
        })

    } catch (err) {
        next(err)
    }
}

export const totalExpenseAndTotalIncomeByUser = async (req, res, next) => {
    try {
        const id = req.user._id.toString()
        const transactions = await TransactionModel.find({ userId: id })

        if (!transactions.length) {
            return next(createError(404, "no transactions found"))
        }

        let totalExpense = 0
        let totalIncome = 0

        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                totalExpense = totalExpense + transaction.amount
            } else {
                totalIncome = totalIncome + transaction.amount
            }
        })

        res.status(200).json({
            message: "transaction",
            data: {
                expense: totalExpense,
                imcome: totalIncome
            }
        })

    } catch (err) {
        next(err)
    }
}