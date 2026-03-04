async function verificarSesion() {
  const { data } = await window.supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "index.html";
  }
}

document.getElementById("logout").addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();
  window.location.href = "index.html";
});
// ===============================
// 🌐 API HELPERS (BACKEND)
// ===============================
async function obtenerLibros() {
  const token = await window.obtenerToken();

  const res = await fetch(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
}

async function obtenerGruposTerminados() {
  
  const token = await window.obtenerToken();
  const res = await fetch(`${API_URL}/grupos-terminados`,{
     headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

document.getElementById("btnGuardar").addEventListener("click", () => {
  guardarLibro();
});

// ===============================
// ➕ MOSTRAR / OCULTAR FORM
// ===============================
btnAgregarLibro.addEventListener("click", () => {
  formLibro.classList.toggle("activo");
});

formLibro.addEventListener("submit", (e) => {
  e.preventDefault();
  guardarLibro();
});


// ===============================
// 🗑 ELIMINAR / ✏️ EDITAR
// ===============================
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    eliminarLibro(e.target.dataset.id);
  }

  if (e.target.classList.contains("btn-editar")) {

  if (!e.target.classList.contains("btn-editar")) return;

  e.stopPropagation(); // 🔥 evita que se abra el modal detalle

  const id = e.target.dataset.id;
  console.log("🖱 Click editar ID:", id);

  obtenerLibrosSafe().then(libros => {
    const libro = libros.find(l => l.id === id);
    console.log("🔎 Libro encontrado:", libro);

    if (libro) cargarLibroParaEditar(libro);
  });

  }
});

// ===============================
// 📝 AUTOEXPANDIR TEXTAREA
// ===============================
notasInput.addEventListener("input", () => {
  notasInput.style.height = "auto";
  notasInput.style.height = notasInput.scrollHeight + "px";
});


// ===============================
// 📅 FILTROS AÑO / MES (BACKEND)
// ===============================
filtroAnio.addEventListener("change", async () => {
  const anioSeleccionado = filtroAnio.value;

  filtroMes.innerHTML = `<option value="">Mes</option>`;
  filtroMes.disabled = true;

  if (!anioSeleccionado) {
    renderizarLibros();
    return;
  }

  const grupos = await obtenerGruposTerminados();

  const mesesDelAnio = Object.keys(grupos)
    .filter(clave => clave.startsWith(anioSeleccionado))
    .sort((a, b) => b.localeCompare(a));

  mesesDelAnio.forEach((clave) => {
    const option = document.createElement("option");
    option.value = clave;
    option.textContent = grupos[clave].label.split(" ")[0];
    filtroMes.appendChild(option);
  });

  filtroMes.disabled = false;
});

filtroMes.addEventListener("change", () => {
  const clave = filtroMes.value;

  if (!clave) {
    renderizarLibros();
    return;
  }

  renderMesEspecifico(clave);
});


// ===============================
// 🌙 MODO OSCURO
// ===============================
function actualizarIconoModo() {
  btnDark.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  actualizarIconoModo();
});

// cargar preferencia
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

actualizarIconoModo();


// ===============================
// 🔝 BOTÓN SCROLL TOP
// ===============================
window.addEventListener("scroll", () => {
  btnScrollTop.classList.toggle("visible", window.scrollY > 300);
});

btnScrollTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ===============================
// 🗑 ELIMINAR NOTAS DE LECTURA
// ===============================
listaNotasLectura.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("eliminar-nota")) return;

  const notaId = e.target.dataset.id;

  await fetch(`/api/notas/${notaId}`, { method: "DELETE" });

  const libros = await obtenerLibros();
  abrirModalLibro(libros[libroActivoIndex], libroActivoIndex);
});


// ===============================
// ⭐ BOTONES EXTRA
// ===============================
document.getElementById("btnPendientes").addEventListener("click", renderPendientes);
document.getElementById("btnFavoritos").addEventListener("click", renderFavoritos);


// ===============================
// 🔍 BUSCADOR
// ===============================
document.getElementById("buscadorLibros").addEventListener("input", filtrarLibros);

async function filtrarLibros(e) {
  const texto = e.target.value.toLowerCase().trim();
  const libros = await obtenerLibros();

  if (texto === "") {
    renderLecturaActual();
    renderizarUltimosDosMeses();
    return;
  }

  const filtrados = libros
    .map(libro => ({ ...libro, index: libro.id }))
    .filter(libro =>
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto) ||
      libro.genero.toLowerCase().includes(texto) ||
      (libro.notas && libro.notas.toLowerCase().includes(texto))
    );

  renderLibrosFiltrados(filtrados);
}


// ===============================
// 🚀 INICIALIZACIÓN
// ===============================
async function init() {
verificarSesion();
  const gruposIniciales = await obtenerGruposTerminados();

  llenarFiltroAnios(gruposIniciales);
  renderLecturaActual();
  renderizarUltimosDosMeses();
  renderEstadisticas();
}

init();