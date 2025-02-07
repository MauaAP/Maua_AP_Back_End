// import "dotenv/config";
// import app from "./app";

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
// });

// import cors from "cors";
// import express from "express";
// import dotenv from "dotenv";

// dotenv.config();

// app.use(express.json());
// app.use(cors());

// export default app;


import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Criando a aplicação Express
const app = express();

// Configurar middlewares antes de iniciar o servidor
app.use(express.json());
app.use(cors());

// Definir a porta (garanta que está pegando do ambiente)
const PORT = process.env.PORT || 3000;

// 🚀 Logs iniciais para garantir que tudo está rodando
console.log("🚀 Server is starting...");
console.log(`🌍 Running in environment: ${process.env.NODE_ENV || "development"}`);
console.log(`📡 Listening on port ${PORT}`);

// Captura de erros inesperados
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} 🚀`);
});

export default app;
