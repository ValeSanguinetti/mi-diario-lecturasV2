import { supabase } from "../supabaseClient.js";

// GET /api/libros
export const getLibros = async (req, res) => {
  const userId = req.user.sub; 

  const { data, error } = await supabase
    .from("libros")
    .select("*")
    .eq("usuario_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};


// POST
export const crearLibro = async (req, res) => {
  console.log("BODY RECIBIDO:", req.body);
const userId = req.user.sub;
const { data, error } = await supabase
    .from("libros")
    .insert([
      {
        ...req.body,
        usuario_id: userId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("ERROR SUPABASE:", error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
};
// PUT
export const actualizarLibro = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("libros")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// DELETE
export const eliminarLibro = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("libros")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Libro eliminado" });
};

// 🔹 GRUPOS POR MES/AÑO
export const obtenerGruposTerminados = async (req, res) => {
  const { data, error } = await supabase
    .from("libros")
    .select("fin");

  if (error) return res.status(500).json({ error: error.message });

  const grupos = {};

  data.forEach(libro => {
    if (!libro.fin) return;

    const fecha = new Date(libro.fin);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;

    if (!grupos[clave]) {
      grupos[clave] = {
        label: fecha.toLocaleString("es-ES", {
          month: "long",
          year: "numeric"
        }),
        total: 0
      };
    }

    grupos[clave].total++;
  });

  res.json(grupos);
};