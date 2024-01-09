import {Request, Response} from "express";
import authService from "../services/authService.ts";
require('express-async-errors');

export default {
    verifyToken: async (req: Request, res: Response) => {
        const token = req.query.token || req.headers["x-access-token"] || req.cookies?.token
        if (!token) {
            throw new Error("invalid-token")
        }

        const data = await authService.verifyToken(token)

        if (!data) {
            throw new Error("invalid-token")
        }

        return res.status(200).json({
            status: "ok",
            message: "Token verified",
            data
        })
    },
    login: async (req: Request, res: Response) => {
        const {email,password} = req.body

        const {user, token} = await authService.login(email, password)

        if (!user || !token) {
            res.status(500).send("invalid-email-or-password")
        }

        res.status(200).send({
            status: "ok",
            message: "Logged in succesfully",
            user,
            token
        })
    },
    signUp: async (req: Request, res: Response) => {
        const body = req.body
        const {user, token} = await authService.signUp(body)

        if (!user) {
            res.status(500).send("user-not-created")
        }

        res.status(200).send({
            status: "ok",
            message: "User created",
            token
        })

    },
    createSignUpRequest: async (req: Request, res: Response) => {
        const {email} = req.body

        const data = await authService.createSignUpRequest(email)

        if (!data) {
            throw new Error("user-email-sent-error")
        }

        return res.status(200).json({
            ...data,
            status: "ok",
            message: "Email sent"
        })
    },
    verifySignUpOtpCode: async (req: Request, res: Response) => {
        const {email, otpCode, referenceId} = req.body

        const data = await authService.verifySignUpOtpCode(email, otpCode, referenceId)

        if (!data) {
            throw new Error("invalid-otp-code")
        }

        return res.status(200).json({
            status: "ok",
            message: "User verified",
            data: {
                email,
                referenceId,
                requestId: data.requestId
            }
        })
    },
    sendRenewPasswordOtpCode: async (req: Request, res: Response) => {
        const {email} = req.body

        const data = await authService.sendRenewPasswordOtpCode(email)

        if (!data) {
            throw new Error("user-email-sent-error")
        }

        return res.status(200).json({
            ...data,
            status: "ok",
            message: "Email sent"
        })
    },
    verifyRenewPasswordOtpCode: async (req: Request, res: Response) => {
        const {email, otpCode, referenceId} = req.body

        const data = await authService.verifyRenewPasswordOtpCode(email, otpCode, referenceId)

        if (!data) {
            throw new Error("invalid-otp-code")
        }

        return res.status(200).json({
            status: "ok",
            message: "User verified",
            data: {
                referenceId,
                email,
                requestId: data.requestId
            }
        })
    },
    renewPassword: async (req: Request, res: Response) => {
        const {email, password, referenceId, requestId} = req.body

        const data = await authService.renewPassword(email, password, referenceId, requestId)

        if (!data) {
            throw new Error("user-not-found")
        }

        return res.status(200).json({
            status: "ok",
            message: "Password renewed",
            data: {
                email,
            }
        })
    },
}