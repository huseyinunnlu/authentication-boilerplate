import {IGenerateRandomParams} from "../types";
import {errorTextMap} from "../resources/errorTextMap.ts";
const CryptoJS = require("crypto-js");


export function encrypt(text: string) {
    const cipherText = CryptoJS.SHA256(text, process.env.SECRET_KEY).toString();
    return cipherText;
}


//generate random digits by options
export function generateRandom({
                                               length = 6,
                                               onlyLetters = false,
                                               onlyNumbers = false,
                                               isOnlyUpperCase = false,
                                               isOnlyLowerCase = false,
                                               includeSpecialChars = false,
                                               customDigits = "",
                                           }: IGenerateRandomParams): String {

    let digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (customDigits) {
        digits = customDigits;
    }
    if (onlyLetters && !customDigits) {
        digits = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if (isOnlyUpperCase) {
            digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }

        if (isOnlyLowerCase) {
            digits = "abcdefghijklmnopqrstuvwxyz";
        }
    }

    if (onlyNumbers && !customDigits) {
        digits = "0123456789";
    }

    if (includeSpecialChars && !customDigits) {
        digits += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    }

    let result = "";
    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return result;
}



export default function getErrorMessageByCode(code: string, parameters?: { [key: string]: string }) {
    let errorText = errorTextMap[code]

    if (!errorText) {
        errorText = errorTextMap["unknown-error"]
    }

    if (!parameters) {
        return errorText
    }

    return {
        ...errorText,
        //replace parameters in error message if text contains <key> pattern
        errorMessage: errorText.errorMessage.replace(/<\w+>/g, (matched) => {
            const key = matched.replace(/<|>/g, "")
            return parameters[key] || ""
        }),
        errorTitle: errorText.errorTitle.replace(/<\w+>/g, (matched) => {
            const key = matched.replace(/<|>/g, "")
            return parameters[key] || ""
        })
    }
}