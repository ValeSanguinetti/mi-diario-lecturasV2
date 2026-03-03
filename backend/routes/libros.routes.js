import express from "express";
import * as controller from "../Controllers/libros.controller.js";
import { verificarUsuario } from "../middleware/auth.js";
const router = express.Router();


router.get("/", verificarUsuario, controller.getLibros);
router.post("/", verificarUsuario, controller.crearLibro);
router.put("/:id", verificarUsuario, controller.actualizarLibro);
router.delete("/:id", verificarUsuario, controller.eliminarLibro);
router.get("/grupos-terminados",verificarUsuario, controller.obtenerGruposTerminados);
export default router;