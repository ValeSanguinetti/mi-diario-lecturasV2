import express from "express";
const router = express.Router();

// luego agregaremos login, registro, etc.
router.get("/", (req, res) => {
  res.json({ mensaje: "Rutas de usuarios en construcción 👷‍♀️" });
});

module.exports = router;