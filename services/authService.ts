import UserRepository from "../repositories/user.ts";
import {ISignUpServiceBody, IUserModel} from "../types";
import agenda from "../jobs";
import RegisterOtpCodeRepository from "../repositories/registerOtpCode.ts";
import RenewPasswordOtpCodeRepository from "../repositories/renewPasswordOtpCode.ts";
import {encrypt, generateRandom} from "../utils/helpers.ts";

const jwt = require('jsonwebtoken');
require('express-async-errors');

async function checkEmailExists(email: string) {
    const existsEmail = await UserRepository.findOne({email})

    if (existsEmail) {
        throw new Error("email-already-exists-error")
    }
}

export default {
    verifyToken: async (token: string) => {
        try {
            return await jwt.verify(token, process.env.SECRET_KEY)
        } catch (e) {
            throw new Error("invalid-token")
        }
    },
    login: async (email: string, password: string) => {
        const user: IUserModel | null = await UserRepository.findOne({email, password: encrypt(password)})

        if (!user) {
            throw new Error("invalid-email-or-password")
        }

        const token = await jwt.sign(user.toJSON(), process.env.SECRET_KEY, {expiresIn: "7d"})

        return {
            user,
            token
        }
    },
    signUp: async (body: ISignUpServiceBody) => {
        await checkEmailExists(body.email)

        const registerOtpCode = await RegisterOtpCodeRepository.findOne({
            email: body.email,
            referenceId: body.referenceId,
            isVerified: true,
        })

        if (!registerOtpCode) {
            throw new Error("register-error")
        }

        if (registerOtpCode && new Date(registerOtpCode.createdAt).getTime() + 400000 < Date.now()) {
            //delete registerOtpCode
            await registerOtpCode.deleteOne()
            throw new Error("expired-register-process")
        }

        const user = await UserRepository.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
        })

        if (!user) {
            throw new Error("user-not-created")
        }

        await registerOtpCode.deleteOne()
        const token = await jwt.sign(user.toJSON(), process.env.SECRET_KEY, {expiresIn: "1h"})

        return {
            user,
            token
        }
    },
    createSignUpRequest: async (email: string) => {
        await checkEmailExists(email)

        let registerOtpCode: any

        registerOtpCode = await RegisterOtpCodeRepository.findOne({
            email,
            createdAt: {$gte: new Date(Date.now() - 300000)}
        })

        if (registerOtpCode && registerOtpCode?.attempts >= 5) {
            throw new Error("too-many-email-requests")
        }

        if (registerOtpCode && registerOtpCode?.attempts < 5 && registerOtpCode.isVerified) {
            // delete registerOtpCode
            await registerOtpCode.deleteOne()
            throw new Error("user-already-verified")
        }

        if (registerOtpCode) {
            registerOtpCode.attempts += 1
            await registerOtpCode.save()
        } else {
            registerOtpCode = await RegisterOtpCodeRepository.create({
                email,
                otpCode: generateRandom({length: 6, onlyNumbers: true}),
                referenceId: generateRandom({length: 125, isOnlyUpperCase: true})
            })
        }

        if (!registerOtpCode) {
            throw new Error("user-email-sent-error")
        }

        await agenda.now("sendEmail", {
            to: email,
            subject: "Sign In Request",
            text: `Sign In Code: ${registerOtpCode?.otpCode}`,
            html: `Sign In Code: ${registerOtpCode?.otpCode}`,
        })

        return {
            referenceId: registerOtpCode.referenceId,
            remainingTime: Math.floor((new Date(registerOtpCode.createdAt).getTime() + 300000 - Date.now()) / 1000)
        }
    },
    verifySignUpOtpCode: async (email: string, otpCode: string, referenceId: string) => {
        await checkEmailExists(email)

        const registerOtpCode = await RegisterOtpCodeRepository.findOne({
            email,
            referenceId,
            createdAt: {$gte: new Date(Date.now() - 300000)}
        })

        if (!registerOtpCode) {
            throw new Error("invalid-otp-code")
        }


        if (registerOtpCode.isVerified) {
            // delete registerOtpCode
            await registerOtpCode.deleteOne()
            throw new Error("user-already-verified")
        }

        if (registerOtpCode.attempts >= 5) {
            throw new Error("too-many-email-requests")
        }

        registerOtpCode.attempts += 1
        await registerOtpCode.save()

        if (registerOtpCode.otpCode !== otpCode) {
            throw new Error("invalid-otp-code")
        }

        registerOtpCode.isVerified = true
        registerOtpCode.requestId = generateRandom({length: 125, isOnlyUpperCase: true})
        await registerOtpCode.save()

        return {
            referenceId,
            email,
            requestId: registerOtpCode.requestId
        }
    },
    sendRenewPasswordOtpCode: async (email: string) => {
        const user = await UserRepository.findOne({email})

        if (!user) {
            throw new Error("user-not-found")
        }

        let otpCodeData: any

        otpCodeData = await RenewPasswordOtpCodeRepository.findOne({
            email,
            createdAt: {$gte: new Date(Date.now() - 300000)}
        })

        if (!otpCodeData) {
            otpCodeData = await RenewPasswordOtpCodeRepository.create({
                otpCode: generateRandom({length: 6, onlyNumbers: true}),
                userId: user._id,
                email,
                referenceId: generateRandom({length: 125, isOnlyUpperCase: true})
            })
        }

        if (otpCodeData.attempts >= 5) {
            throw new Error("too-many-email-requests")
        }

        otpCodeData.attempts += 1
        await otpCodeData.save()

        await agenda.now("sendEmail", {
            to: email,
            subject: "Renew Password Request",
            text: `Renew Password Code: ${otpCodeData?.otpCode}`,
            html: `Renew Password Code: ${otpCodeData?.otpCode}`,
        })

        return {
            referenceId: otpCodeData.referenceId,
            remainingTime: Math.floor((new Date(otpCodeData.createdAt).getTime() + 300000 - Date.now()) / 1000)
        }
    },
    verifyRenewPasswordOtpCode: async (email: string, otpCode: string, referenceId: string) => {
        const user = await UserRepository.findOne({email})

        if (!user) {
            throw new Error("user-not-found")
        }

        const otpCodeData = await RenewPasswordOtpCodeRepository.findOne({
            email,
            referenceId,
            createdAt: {$gte: new Date(Date.now() - 300000)}
        })

        if (!otpCodeData) {
            throw new Error("invalid-otp-code")
        }

        if (otpCodeData.attempts >= 5) {
            throw new Error("too-many-email-requests")
        }

        otpCodeData.attempts += 1
        await otpCodeData.save()

        if (otpCodeData.otpCode !== otpCode) {
            throw new Error("invalid-otp-code")
        }

        otpCodeData.isVerified = true
        otpCodeData.requestId = generateRandom({length: 125, isOnlyUpperCase: true})
        await otpCodeData.save()

        return {
            referenceId,
            requestId: otpCodeData.requestId,
            email
        }
    },
    renewPassword: async (email: string, password: string, referenceId: string, requestId: string) => {
        const user = await UserRepository.findOne({email})

        if (!user) {
            throw new Error("user-not-found")
        }

        const encryptedPassword = encrypt(password)
        const encryptedOldPassword = user.password

        if (encryptedPassword === encryptedOldPassword) {
            throw new Error("password-must-be-different-with-old-password")
        }

        const otpCodeData = await RenewPasswordOtpCodeRepository.findOne({
            email,
            referenceId,
            requestId,
            isVerified: true
        })

        if (!otpCodeData) {
            throw new Error("invalid-otp-code")
        }

        user.password = encrypt(password)
        await user.save()

        await otpCodeData.deleteOne()

        return true
    }
}