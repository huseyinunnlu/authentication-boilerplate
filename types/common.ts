export type IErrorTextItem = {
    statusCode: number
    errorCode: number
    errorMessage: string
    errorTitle: string
}

export interface IErrorTextMap {
    [key: string]: IErrorTextItem
}