import {model, Schema} from "mongoose";
import {IRegisterOtpCodeModel} from "../types";

const registerOtpCode: Schema<IRegisterOtpCodeModel> = new Schema({
    email: {
        type: String,
        required: true,
    },
    otpCode: {
        type: String,
        required: true
    },
    referenceId: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const RegisterOtpCode = model("RegisterOtpCode", registerOtpCode)

export default RegisterOtpCode
