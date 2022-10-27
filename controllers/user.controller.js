import UserModel from '../models/user.model.js'
import { createError } from "../error.js"

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT, { expiresIn: "1d" })
}


export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return next(createError(400, "name or email or password is missing"))
        }
        if (password.length < 6) {
            return next(createError(400, "password is less then 6 characters"))
        }

        const alreadyExist = await UserModel.findOne({ email: email })
        if (alreadyExist) {
            return next(createError(409, "password is less then 6 characters or more then 23 charaters"))
        }

        const user = await UserModel.create({
            name,
            email,
            password
        })
        
        const token = generateToken(user._id)
        const { password: p, ...info } = user._doc

        res.cookie("token", token, {
            path: '/',
            httpOnly: true,
            expries: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        }).status(201).json({
            message: "User registered",
            user: { ...info }
        })

    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(createError(400, "email or password is missing"))
        }

        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return next(createError(404, "user not found with this email"))
        }

        const isCorrectPasswrod = bcrypt.compare(password, user.password)

        if (!isCorrectPasswrod) {
            return next(createError(400, "invalid cridentials"))
        }

        const token = generateToken(user._id)
        const { password: p, ...info } = user._doc

        res.cookie("token", token, {
            path: '/',
            httpOnly: true,
            expries: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        }).status(200).json({
            message: "User login",
            user: { ...info }
        })
    } catch (err) {
        next(err)
    }
}