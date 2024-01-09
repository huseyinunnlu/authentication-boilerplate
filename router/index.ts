import {Express} from "express";
import authRouter from "./auth.ts";

export default function importRoutes(app:Express) {
    app.use("/api/auth", authRouter)

    app.get("/", (req, res) => {
        res.send("Hello World!")
    })

    //404 page
    app.get("*", (req, res) => {
        res.status(404).send("404 Not Found")
    })
}