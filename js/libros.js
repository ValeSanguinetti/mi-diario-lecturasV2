async function obtenerLibros() {
    console.log("📡 Fetching libros desde:", API_URL);

    const res = await fetch(API_URL);

    console.log("📡 Status:", res.status);

    const data = await res.json();

    console.log("📚 Libros recibidos:", data);

    if (!Array.isArray(data)) {
        console.error("❌ La API no devolvió un array:", data);
        return [];
    }

    return data;
}

// 🔹 Crear o actualizar libro
async function guardarLibro() {
    const token = await window.obtenerToken();
    const libro = {
        titulo: tituloInput.value,
        autor: autorInput.value,
        genero: GeneroInput.value,
        inicio: fechaInicioInput.value || null,
        fin: fechaFinInput.value || null,
        notas: notasInput.value,
        favorito: false
    };

    try {
          let libroGuardado;
        if (indiceEditando !== null) {
            // ✏️ actualizar
            console.log("🆔 ID a actualizar:", indiceEditando);
            await fetch(`${API_URL}/${indiceEditando}`, {
                method: "PUT",
                headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
                body: JSON.stringify(libro),
            });
               libroGuardado = await res.json();

            // Actualizar cache: reemplazar el libro editado
            librosCache = librosCache.map(l => 
                l.id === indiceEditando ? libroGuardado : l
            );


            indiceEditando = null;
            document.getElementById("btnGuardar").textContent = "Guardar";
        } else {
            // ➕ crear
            await fetch(API_URL, {
                method: "POST",
                 headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
                body: JSON.stringify(libro),
            });
             libroGuardado = await res.json();

            // Actualizar cache: agregar el nuevo libro
            librosCache.push(libroGuardado);
        
        }

        formLibro.reset();
        cerrarModalForm();

        renderEstadisticas();
        renderLecturaActual();
        renderizarUltimosDosMeses();

    } catch (error) {
        console.error("Error guardando libro:", error);
    }
}

// 🔹 Eliminar libro
async function eliminarLibro(id) {

    const token = await window.obtenerToken();
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
              headers: {
      Authorization: `Bearer ${token}`
    }
        });

        renderEstadisticas();
        renderLecturaActual();
        renderizarUltimosDosMeses();

    } catch (error) {
        console.error("Error eliminando libro:", error);
    }
}

// 🔹 Cargar libro para editar
function cargarLibroParaEditar(libro) {
  /*console.log("📝 cargarLibroParaEditar recibió:", libro);
  console.log("INPUT titulo:", tituloInput);
console.log("VALOR titulo:", libro.titulo);
*/

  tituloInput.value = libro.titulo || "";
  autorInput.value = libro.autor || "";
  GeneroInput.value = libro.genero || "";
  fechaInicioInput.value = libro.inicio || "";
  fechaFinInput.value = libro.fin || "";
  notasInput.value = libro.notas || "";

  indiceEditando = libro.id;
  document.getElementById("btnGuardar").textContent = "Actualizar";

  abrirModalForm()
}