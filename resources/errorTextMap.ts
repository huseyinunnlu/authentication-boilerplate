import {IErrorTextMap} from "../types";
import {HttpStatus} from "../constants";

export const errorTextMap: IErrorTextMap = {
    "email-already-exists-error": {
        statusCode: HttpStatus.CONFLICT,
        errorCode: 1000,
        errorMessage: "Email already exists",
        errorTitle: "Validation error"
    },
    "unknown-error": {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: 1001,
        errorMessage: "Unknown error",
        errorTitle: "Unknown error"
    },
    "email-regex-error": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1002,
        errorMessage: "Invalid email",
        errorTitle: "Validation error"
    },
    "required-error": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1003,
        errorMessage: "<field> is required",
        errorTitle: "Validation error"
    },
    "user-email-sent-error": {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: 1004,
        errorMessage: "User email sent error",
        errorTitle: "User email sent error"
    },
    "too-many-email-requests": {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        errorCode: 1005,
        errorMessage: "Too many attemps try after 5 minutes",
        errorTitle: "Too many attemps"
    },
    "user-already-verified": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1006,
        errorMessage: "User already verified",
        errorTitle: "User already verified"
    },
    "invalid-otp-code": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1007,
        errorMessage: "Invalid otp code",
        errorTitle: "Invalid otp code"
    },
    "invalid-token": {
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 1008,
        errorMessage: "Invalid token",
        errorTitle: "Invalid token"
    },
    "already-logged-in": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1009,
        errorMessage: "Already logged in",
        errorTitle: "Already logged in"
    },
    "invalid-email-or-password": {
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 1010,
        errorMessage: "Invalid email or password",
        errorTitle: "Invalid email or password"
    },
    "expired-register-process": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1011,
        errorMessage: "Expired register process",
        errorTitle: "Expired register process"
    },
    "register-error": {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 1012,
        errorMessage: "Register error",
        errorTitle: "Register error"
    },
    "user-not-created": {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: 1013,
        errorMessage: "User not created",
        errorTitle: "User not created"
    },
    "user-not-found": {
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 1014,
        errorMessage: "User not found",
        errorTitle: "User not found"
    },
    "password-must-be-different-with-old-password": {
        statusCode: HttpStatus.CONFLICT,
        errorCode: 1015,
        errorMessage: "Password must be different with old password",
        errorTitle: "Password must be different with old password"
    }
}