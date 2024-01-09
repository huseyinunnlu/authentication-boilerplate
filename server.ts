import cors from "cors"
import express from "express"
import {config} from "dotenv"
import initMongoDb from "./databases/mongo.ts";
import {IErrorTextItem} from "./types";
import importRoutes from "./router";
import getErrorMessageByCode from "./utils/helpers.ts";

//import async error handler
require('express-async-errors');

//init express
const app = express()

//init body parser
app.use(express.json({
    limit: "2mb"
}))

//init cors
app.use(cors())

//import dotenv by development or production
config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
})

//init mongo db
await initMongoDb()

//import routes
importRoutes(app)

//error handler
app.use((err: any, req: any, res: any, next: any) => {
    //get error message
    const selectedError: IErrorTextItem = getErrorMessageByCode(err.message || "unknown-error")

    //send error message
    res.status(selectedError?.statusCode || 500).json({
        errorTitle: selectedError?.errorTitle || "Unknown error",
        error: selectedError?.errorMessage || "Unknown error",
        errorCode: selectedError?.errorCode || 500,
        errorStatusCode: selectedError?.statusCode || 500
    })

    next()
})

//listen server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

