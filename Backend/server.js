import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";

import authRoute from "./routes/authroutes.js";
import userRoute from "./routes/userroutes.js";
import postRoute from "./routes/post.route.js";
import notificationRoute from "./routes/notificationRoute.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

// ✅ CLOUDINARY CONFIG
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://lohith-media-nr27.vercel.app", // ✅ Vercel frontend URL
];

app.use(
	cors({
		origin: "https://lohith-media-nr27.vercel.app",
		credentials: true,
	})
);


// ✅ BODY PARSER — Increase Payload Limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ COOKIE PARSER
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);

// ✅ START SERVER + CONNECT DB
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
	connectDB();
});
