import {model, Schema} from "mongoose";
import {IUserModel} from "../types/auth.ts";
import {encrypt} from "../utils/helpers.ts";
import hidden from "mongoose-hidden";

const userSchema: Schema<IUserModel> = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        select: false,
        hide: true
    },
    gender: {
        required: false,
        type: String,
        enum: ["male", "female", "other"]
    },
    avatar: {
        type: String,
        required: false
    },
})

userSchema.plugin(hidden())

// //write pre function to hash password before saving
// userSchema.pre("save", async function (next) {
//     this.password = encrypt(this.password)
//
//     return next()
// })

const User = model("User", userSchema)

export default User
