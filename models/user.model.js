import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })


userSchema.pre("save", function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(this.password, salt);

    this.password = hashPassword
    return next()
})

export default mongoose.model('user', userSchema)