let libros = [];

module.exports = {
  obtenerLibros: () => libros,
  guardarLibros: (nuevosLibros) => {
    libros = nuevosLibros;
  },
};