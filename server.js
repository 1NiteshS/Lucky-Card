import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import cardRoutes from "./routes/cardRoutes.js";
import { startSocket } from "./socket/sockectServer.js";

import http from "http";

import cors from "cors";

// import Timer from './models/Timer';
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(
  cors({
    origin: "*", // Allows all origins; for production, specify allowed origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Define routes
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cards", cardRoutes);

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
startSocket(httpServer);

httpServer.listen(5000, () => {
  console.log("HTTP server is running on port 5000");
});
