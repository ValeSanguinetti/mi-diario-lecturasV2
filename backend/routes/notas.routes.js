import express from "express";
import * as controller from "../Controllers/notas.controller.js";

const router = express.Router();

router.get("/:libro_id", controller.obtenerNotasPorLibro);
router.post("/", controller.crearNota);
router.put("/:id", controller.actualizarNota);
router.delete("/:id", controller.eliminarNota);

export default router;