import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const mongoUri = process.env.MONGOOSE_URI

const ConnectToDb = async () => {
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`connected to ${conn.connection.host} DB`)

    } catch (error) {
        console.log(error.message)
        process.exit(1);

    }
}

export default ConnectToDb;