import {model, Schema} from "mongoose";
import {IRenewPasswordOtpCode} from "../types";

const renewPasswordOtpCode: Schema<IRenewPasswordOtpCode> = new Schema({
    email: {
        type: String,
        required: true,
    },
    userId: {
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
    requestId: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

const RenewPasswordOtpCode = model("renewPasswordOtpCode", renewPasswordOtpCode)

export default RenewPasswordOtpCode
