import {NextFunction, Request, Response} from "express";
const jwt = require("jsonwebtoken")

export async function requireToken(req:any, res: Response, next: NextFunction) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token

    if (!token) {
        return new Error("invalid-token")
    }

    try {
        const verifiedUser = await jwt.verify(token, process.env.SECRET_KEY)
        req.user = verifiedUser
    } catch (e: any) {
        throw new Error("invalid-token")
    }

    return next()
}

export async function doNotRequireToken(req: Request, res: Response, next: NextFunction) {
    const token = req.body?.token || req.query?.token || req.headers["x-access-token"] || req.cookies?.token

    if (token) {
        throw new Error("already-logged-in")
    }

    return next()
}
