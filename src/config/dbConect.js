// dbConfig
import mongoose from "mongoose";
import "dotenv/config"


const MONGO_URI= process.env.MONGO_URI;


async function conectaBaseDados() {
    mongoose.connect(MONGO_URI)
     
    return mongoose.connection;
}

export default conectaBaseDados;