import express, { Express } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import dbConfig from "./config/db";
import router from "./routes";

// Load environment variables
dotenv.config();

const app: Express = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.ADMIN_ADDRESS || "*", // Allows all origins if not specified
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions), express.json({ limit: "50mb" }), express.static("public"));

// Connect to the database
dbConfig(process.env.ATLAS_URL, process.env.LOCAL_URL);

// Apply routes
router(app);

// Create HTTP Server (No SSL)
const httpServer = http.createServer(app);

// Start Server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
