import mongoose from "mongoose";

export default async function initMongoDb() {
    try {
        await mongoose.connect(<string>process.env.DB_CONNECTION_URL, {
            retryWrites: false
        })
        console.log("Connected to MongoDB")
    } catch (e) {
        console.log(e)
    }
}
