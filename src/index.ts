import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    message: "Prosper API is running",
  });
});

app.use("/api/auth", authRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();