import { supabase } from "../supabaseClient.js";

export const obtenerNotasPorLibro = async (req, res) => {
  const { libro_id } = req.params;

  const { data, error } = await supabase
    .from("notas")
    .select("*")
    .eq("libro_id", libro_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const crearNota = async (req, res) => {
  const { libro_id, texto, fecha } = req.body;

  const { data, error } = await supabase
    .from("notas")
    .insert([{ libro_id, texto, fecha }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
};

export const actualizarNota = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notas")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

export const eliminarNota = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("notas")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Nota eliminada correctamente" });
};