import {InferType} from "yup";
import {
    sendOtpCodeWithEmailSchema,
    loginSchema,
    signUpSchema,
    verifyOtpCodeSchema, renewPasswordSchema
} from "../validation/schemas/auth.ts";
import {Document} from "mongoose";

export interface IUserModel extends Document{
    firstName: string
    lastName: string
    email: string
    password: string
    gender?: "male" | "female" | "other"
    avatar?: string
}

export interface IRegisterOtpCodeModel extends Document{
    email: string
    otpCode: string
    createdAt: Date
    referenceId: string
    attempts: number
    isVerified: boolean
    requestId: String
}

export interface IRenewPasswordOtpCode extends Document{
    email: string
    userId: string
    otpCode: string
    createdAt: Date
    referenceId: string
    attempts: number
    isVerified: boolean
    requestId: String
}


export interface ILoginSchema extends InferType<typeof loginSchema> {}
export interface ISignUpSchema extends InferType<typeof signUpSchema> {}
export interface ISendOtpCodeWithEmailSchema extends InferType<typeof sendOtpCodeWithEmailSchema> {}

export interface IVerifyOtpCodeSchema extends InferType<typeof verifyOtpCodeSchema> {}
export interface IRenewPasswordSchema extends InferType<typeof renewPasswordSchema> {}

export interface ISignUpServiceBody {
    firstName: string
    lastName: string
    email: string
    password: string
    referenceId: string
    requestId: String
}