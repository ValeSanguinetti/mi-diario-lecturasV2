const modal = document.getElementById("modalLibro");
const cerrarModalBtn = document.getElementById("cerrarModal");

const modalTitulo = document.getElementById("modalTitulo");
const modalAutor = document.getElementById("modalAutor");
const modalGenero = document.getElementById("modalGenero");
const modalFechas = document.getElementById("modalFechas");
const modalNotas = document.getElementById("modalNotas");
const listaNotasLectura = document.getElementById("listaNotasLectura");

const nuevaNotaInput = document.getElementById("nuevaNota");
const btnAgregarNota = document.getElementById("btnAgregarNota");

let notaEditandoIndex = null;
  async function abrirModalLibro(libro) {
  libroActivoId = libro.id;

  modalTitulo.textContent = libro.titulo;
  modalAutor.textContent = libro.autor;
  modalGenero.textContent = libro.genero;
  modalFechas.textContent = `${libro.inicio} → ${libro.fin || "En progreso"}`;
  modalNotas.textContent = libro.notas || "Sin reflexión final.";

  await renderNotas(); // 🔥 ahora trae desde API

  modal.classList.remove("hidden");
}
  
cerrarModalBtn.addEventListener("click", cerrarModalSuave);

function cerrarModalSuave() {
  modal.classList.add("cerrando");

  setTimeout(() => {
    modal.classList.remove("cerrando");
    modal.classList.add("hidden");

    // reset edición
    notaEditandoIndex = null;
    btnAgregarNota.textContent = "Agregar nota";
    nuevaNotaInput.value = "";
  }, 250);
}
btnAgregarNota.addEventListener("click", async () => {
  const texto = nuevaNotaInput.value.trim();
  if (!texto) return;

  if (notaEditandoId) {
    // ✏️ editar
    await fetch(`${NOTAS_API}/${notaEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    notaEditandoId = null;
    btnAgregarNota.textContent = "Agregar nota";
  } else {
    // ➕ crear
    await fetch(NOTAS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        libro_id: libroActivoId,
        texto,
        fecha: new Date().toISOString().split("T")[0]
      })
    });
  }

  nuevaNotaInput.value = "";
  await renderNotas();
});
listaNotasLectura.addEventListener("click", async (e) => {
  const editarBtn = e.target.closest(".editar-nota");
  const eliminarBtn = e.target.closest(".eliminar-nota");

  if (editarBtn) {
    const id = editarBtn.dataset.id;

    const res = await fetch(`${NOTAS_API}/${libroActivoId}`);
    const notas = await res.json();

    const nota = notas.find(n => n.id == id);

    nuevaNotaInput.value = nota.texto;
    nuevaNotaInput.focus();

    notaEditandoId = id;
    btnAgregarNota.textContent = "Guardar edición";
  }

  if (eliminarBtn) {
    const id = eliminarBtn.dataset.id;

    await fetch(`${NOTAS_API}/${id}`, {
      method: "DELETE"
    });

    await renderNotas();
  }
});

// =====================
// MODAL FORM LIBRO
// =====================

const modalForm = document.getElementById("modalForm");
const btnAbrirForm = document.getElementById("btnAgregarLibro");
const cerrarFormBtn = document.getElementById("cerrar");
function abrirModalForm() {
  // 🔥 limpiar estados anteriores
  modalForm.classList.remove("hidden", "cerrando");

  // 🔥 forzar reflow para reiniciar animación
  void modalForm.offsetWidth;

  modalForm.classList.remove("hidden");
}
function cerrarModalForm() {
  modalForm.classList.add("cerrando");

  setTimeout(() => {
    modalForm.classList.remove("cerrando");
    modalForm.classList.add("hidden");

    // opcional: limpiar form
    document.getElementById("formLibro").reset();
  }, 250);
}

// abrir
btnAbrirForm.addEventListener("click", abrirModalForm);

// cerrar con X
cerrarFormBtn.addEventListener("click", cerrarModalForm);

// cerrar clic fuera
window.addEventListener("click", (e) => {
  if (e.target === modalForm) cerrarModalForm();
});