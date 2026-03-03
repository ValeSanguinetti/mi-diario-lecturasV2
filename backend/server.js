import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import librosRoutes from "./routes/libros.routes.js";
import notasRoutes from "./routes/notas.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/libros", librosRoutes);
app.use("/api/notas", notasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});