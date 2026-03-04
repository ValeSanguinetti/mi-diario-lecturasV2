// ===================== HELPERS =====================

async function obtenerLibrosSafe() {
  const libros = await obtenerLibros();
  return Array.isArray(libros) ? libros : [];
}

function crearTarjetaLibro(libro) {
  const div = document.createElement("div");
  div.classList.add("tarjeta-actual");
  div.dataset.id = libro.id;

  div.innerHTML = `
    <div class="tarjeta-header">
      <h3>📖 ${libro.titulo}</h3>
      <div class="acciones">
        <button class="favorito-libro" data-id="${libro.id}">
          ${libro.favorito ? "⭐" : "☆"}
        </button>
        <button class="btn-editar" data-id="${libro.id}">✏️</button>
        <button class="btn-eliminar" data-id="${libro.id}">🗑️</button>
      </div>
    </div>
    <p>✍️ ${libro.autor || "Autor desconocido"}</p>
    <p>🏷️ ${libro.genero || "Sin género"}</p>
    ${libro.inicio ? `<p>🗓 Desde ${libro.inicio}</p>` : ""}
    ${libro.fin ? `<p>✔ Finalizado: ${libro.fin}</p>` : ""}
    <p>💭 ${libro.notas || "Sin notas"}</p>
  `;

  div.addEventListener("click", (e) => {
    if (e.target.closest(".acciones")) return;
    abrirModalLibro(libro);
  });

  return div;
}

// ===================== LECTURA ACTUAL =====================

async function renderLecturaActual() {
  const contenedor = document.getElementById("lecturaActual");
  const libros = await obtenerLibrosSafe();
  contenedor.innerHTML = "";

  const actuales = libros.filter(
    (l) => l.inicio && !l.fin
  );

  if (!actuales.length) {
    contenedor.innerHTML =
      `<div class="lectura-actual vacio">📖 No tenés lecturas en curso</div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  actuales.forEach(libro => grid.appendChild(crearTarjetaLibro(libro)));

  contenedor.innerHTML = `<h2>📚 Leyendo ahora (${actuales.length})</h2>`;
  contenedor.appendChild(grid);
}

// ===================== ÚLTIMOS MESES =====================

async function renderizarUltimosDosMeses() {
  listaLecturas.innerHTML = "";
   const libros = librosCache

  const terminados = libros.filter(l => l.fin);
  if (!terminados.length) {
    listaLecturas.innerHTML = "<p>📚 Todavía no registraste lecturas</p>";
    return;
  }

  const grupos = {};

  terminados.forEach(libro => {
    const fecha = new Date(libro.fin);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth()+1}`;
    const label = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    if (!grupos[clave]) grupos[clave] = { label, libros: [] };
    grupos[clave].libros.push(libro);
  });

  const mesesOrdenados = Object.keys(grupos).sort((a,b)=>b.localeCompare(a));
  const ultimos = mesesOrdenados.slice(0,2);

  ultimos.forEach(clave => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque-mes");
    bloque.innerHTML = `<h2>📅 ${grupos[clave].label}</h2>`;

    grupos[clave].libros.forEach(libro => {
      const card = crearTarjetaLibro(libro);
      card.classList.replace("tarjeta-actual","libro");
      bloque.appendChild(card);
    });

    listaLecturas.appendChild(bloque);
  });
}

// ===================== MES ESPECÍFICO =====================

async function renderMesEspecifico(clave) {
  listaLecturas.innerHTML = "";
  const libros = await obtenerLibrosSafe();

  const filtrados = libros.filter(l => {
    if (!l.fin) return false;
    const f = new Date(l.fin);
    return `${f.getFullYear()}-${f.getMonth()+1}` === clave;
  });

  filtrados.forEach(libro => {
    const card = crearTarjetaLibro(libro);
    card.classList.replace("tarjeta-actual","libro");
    listaLecturas.appendChild(card);
  });
}

// ===================== PENDIENTES =====================

async function renderPendientes() {
  const contenedor = document.getElementById("pendientes");
  const libros = await obtenerLibrosSafe();

  const pendientes = libros.filter(l => !l.inicio);

  if (!pendientes.length) {
    contenedor.innerHTML = "<p>No hay pendientes</p>";
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  pendientes.forEach(libro => grid.appendChild(crearTarjetaLibro(libro)));

  contenedor.innerHTML = `<h2>📚 Pendientes (${pendientes.length})</h2>`;
  contenedor.appendChild(grid);
}

// ===================== FAVORITOS =====================

async function renderFavoritos() {
  //console.log("renderFavoritos ejecutándose");
  const contenedor = document.getElementById("favoritos");
  const libros = await obtenerLibrosSafe();

  const favoritos = libros.filter(l => l.favorito);

  if (!favoritos.length) {
    contenedor.innerHTML = "<p>⭐ No hay favoritos</p>";
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  favoritos.forEach(libro => grid.appendChild(crearTarjetaLibro(libro)));

  contenedor.innerHTML = `<h2>⭐ Favoritos (${favoritos.length})</h2>`;
  contenedor.appendChild(grid);
}

// ===================== FILTRO BUSCADOR =====================
function renderLibrosFiltrados(texto) {
  const contenedor = document.getElementById("lecturaActual");

  //console.log("Filtrando libros para:", texto);

  const filtrados = librosCache.filter(l => {
    const titulo = (l.titulo || "").toLowerCase();
    const autor = (l.autor || "").toLowerCase();
    const genero = (l.genero || "").toLowerCase();
    const resultado = titulo.includes(texto) || autor.includes(texto) || genero.includes(texto);
    //console.log("Libro:", l.titulo, "Coincide?", resultado);
    return resultado;
  });

 // console.log("Libros filtrados:", filtrados);

  contenedor.innerHTML = "";

  if (!filtrados.length) {
    contenedor.innerHTML = "<p>No se encontraron resultados 😢</p>";
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  filtrados.forEach(libro => {
    const tarjeta = crearTarjetaLibro(libro);
    //console.log("Renderizando libro:", libro.titulo);
    grid.appendChild(tarjeta);
  });

  contenedor.appendChild(grid);
}

// ===================== FAVORITO CLICK =====================
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".favorito-libro");
  if (!btn) return;

  const id = btn.dataset.id;

  // Detectar estado actual de forma confiable
  const esFavorito = btn.textContent.trim() === "⭐";
const token = await window.obtenerToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${token}` 
     },
    body: JSON.stringify({ favorito: !esFavorito })
  });

  if (!res.ok) {
    console.error("Error al actualizar favorito");
    return;
  }

  // 🔥 actualización visual inmediata
  btn.textContent = !esFavorito ? "⭐" : "☆";

  // Si querés re-render completo:
  await renderLecturaActual();
  await renderizarUltimosDosMeses();
});
// ===================== ESTADÍSTICAS =====================

async function renderEstadisticas() {
  const contenedor = document.querySelector(".estadisticas");
  if (!contenedor) return;

  const libros = await obtenerLibrosSafe();

  const terminados = libros.filter(l => l.fin);
  const totalLeidos = terminados.length;

  const anioActual = new Date().getFullYear();
  const leidosEsteAnio = terminados.filter(l => {
    const f = new Date(l.fin);
    return f.getFullYear() === anioActual;
  }).length;

  // 📅 Mes más lector
  const meses = {};
  terminados.forEach(libro => {
    const f = new Date(libro.fin);
    const clave = `${f.getFullYear()}-${f.getMonth()+1}`;
    meses[clave] = (meses[clave] || 0) + 1;
  });

  let mesTop = null;
  let max = 0;
  for (const mes in meses) {
    if (meses[mes] > max) {
      max = meses[mes];
      mesTop = mes;
    }
  }

  function formatearMes(mesClave) {
    if (!mesClave) return "—";
    const [anio, mes] = mesClave.split("-");
    const fecha = new Date(anio, mes - 1);
    return fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  }

  // 🏷 Género más leído
  const generos = {};
  terminados.forEach(libro => {
    if (!libro.genero) return;
    generos[libro.genero] = (generos[libro.genero] || 0) + 1;
  });

  let generoTop = null;
  let maxGenero = 0;
  for (const g in generos) {
    if (generos[g] > maxGenero) {
      maxGenero = generos[g];
      generoTop = g;
    }
  }

  contenedor.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <span>📚</span>
        <p>Total leídos</p>
        <strong>${totalLeidos}</strong>
      </div>

      <div class="stat-card">
        <span>📅</span>
        <p>Leídos este año</p>
        <strong>${leidosEsteAnio}</strong>
      </div>

      <div class="stat-card">
        <span>🏆</span>
        <p>Mes más lector</p>
        <strong>${formatearMes(mesTop)}</strong>
      </div>

      <div class="stat-card">
        <span>🏷️</span>
        <p>Género más leído</p>
        <strong>${generoTop || "—"}</strong>
      </div>
    </div>
  `;
}

async function renderNotas() {
  const res = await fetch(`${NOTAS_API}/${libroActivoId}`);
  const notas = await res.json();

  if (!notas.length) {
    listaNotasLectura.innerHTML = "<li>Sin notas aún</li>";
    return;
  }

  listaNotasLectura.innerHTML = notas.map(nota => `
    <li class="nota-item">
      <div class="nota-texto">
        ${nota.texto}
        <small>📅 ${nota.fecha}</small>
      </div>
      <div class="nota-acciones">
        <button class="editar-nota" data-id="${nota.id}">✏️</button>
        <button class="eliminar-nota" data-id="${nota.id}">🗑️</button>
      </div>
    </li>
  `).join("");
}