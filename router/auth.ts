import {Router} from 'express'
import authController from "../controllers/authController.ts";
import {validate} from "../middlewares/common.ts";
import {
    ILoginSchema, IRenewPasswordSchema,
    ISendOtpCodeWithEmailSchema,
    ISignUpSchema,
    IVerifyOtpCodeSchema
} from "../types";
import {doNotRequireToken} from "../middlewares/auth.ts";
import {AuthRoutes} from "../constants";
import {
    loginSchema,
    renewPasswordSchema,
    sendOtpCodeWithEmailSchema,
    signUpSchema,
    verifyOtpCodeSchema
} from "../validation";

require('express-async-errors');

const authRouter = Router()

authRouter.get(AuthRoutes.VERIFY_TOKEN, authController.verifyToken)
authRouter.post(AuthRoutes.LOGIN, doNotRequireToken, validate<ILoginSchema>(loginSchema), authController.login)
authRouter.post(AuthRoutes.SIGN_UP, doNotRequireToken, validate<ISignUpSchema>(signUpSchema), authController.signUp)
authRouter.post(AuthRoutes.CREATE_SIGNUP_REQUEST, doNotRequireToken, validate<ISendOtpCodeWithEmailSchema>(sendOtpCodeWithEmailSchema), authController.createSignUpRequest)
authRouter.post(AuthRoutes.VERIFY_SIGNUP_OTP_CODE, doNotRequireToken, validate<IVerifyOtpCodeSchema>(verifyOtpCodeSchema), authController.verifySignUpOtpCode)
authRouter.post(AuthRoutes.SEND_RENEW_PASSWORD_OTP_CODE, doNotRequireToken,validate<ISendOtpCodeWithEmailSchema>(sendOtpCodeWithEmailSchema), authController.sendRenewPasswordOtpCode)
authRouter.post(AuthRoutes.VERIFY_RENEW_PASSWORD_OTP_CODE, doNotRequireToken,validate<IVerifyOtpCodeSchema>(verifyOtpCodeSchema), authController.verifyRenewPasswordOtpCode)
authRouter.post(AuthRoutes.RENEW_PASSWORD, doNotRequireToken,validate<IRenewPasswordSchema>(renewPasswordSchema), authController.renewPassword)
export default authRouter
