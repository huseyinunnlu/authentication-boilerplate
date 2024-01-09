import {addMethod, object, ref, string} from "yup";
import getErrorMessageByCode from "../../utils/helpers.ts";

export const signUpSchema = object().shape({
    firstName: string().required("First name is required").min(2, "First name must be at least 2 characters long"),
    lastName: string().required("Last name is required").min(2, "Last name must be at least 2 characters long"),
    email: string().email("Must be a valid email").required("Email is required"),
    password: string().required("Password is required").min(8),
    passwordConfirmation: string().oneOf([ref("password")], "Passwords must match"),
    referenceId: string().required(getErrorMessageByCode("required-error", {field: "Reference ID"})),
    requestId: string().required(getErrorMessageByCode("required-error", {field: "Request ID"}))
})

export const loginSchema = object().shape({
    email: string().email(getErrorMessageByCode("email-regex-error")).required(getErrorMessageByCode("required-error", {field: "Email"})),
    password: string().required(getErrorMessageByCode("required-error", {field: "Password"}))
})

export const sendOtpCodeWithEmailSchema = object().shape({
    email: string().email(getErrorMessageByCode("email-regex-error")).required(getErrorMessageByCode("required-error", {field: "Email"})),
})

export const verifyOtpCodeSchema = object().shape({
    email: string().email(getErrorMessageByCode("email-regex-error")).required(getErrorMessageByCode("required-error", {field: "Email"})),
    otpCode: string().required(getErrorMessageByCode("required-error", {field: "OTP Code"})),
    referenceId: string().required(getErrorMessageByCode("required-error", {field: "Reference ID"}))
})

export const renewPasswordSchema = object().shape({
    email: string().email(getErrorMessageByCode("email-regex-error")).required(getErrorMessageByCode("required-error", {field: "Email"})),
    password: string().required(getErrorMessageByCode("required-error", {field: "Password"})),
    passwordConfirmation: string().oneOf([ref("password")], "Passwords must match"),
    referenceId: string().required(getErrorMessageByCode("required-error", {field: "Reference ID"})),
    requestId: string().required(getErrorMessageByCode("required-error", {field: "Request ID"}))
})
