import mongoose from "mongoose";
import "dotenv/config"
import cors from "cors"
import express from "express"

const MONGO_URI= process.env.MONGO_URI;


async function conectaBaseDados() {
    mongoose.connect(MONGO_URI)
     
    return mongoose.Connection;
}

export default conectaBaseDados;