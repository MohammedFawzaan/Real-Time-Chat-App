import express from "express"

import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.route.js";

import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";

import cookieParser from "cookie-parser";
dotenv.config();

const app = express(); // creating express app
const PORT = process.env.PORT;

// allows to parse the cookie
app.use(cookieParser());
// middleware use to extract json data
app.use(express.json());
// using cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// middleware for authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
}); // listening on server port