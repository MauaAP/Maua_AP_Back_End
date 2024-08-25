import "dotenv/config";
import app from "./src/app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
});

import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

app.use(express.json());
app.use(cors());

export default app;
