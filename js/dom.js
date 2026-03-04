const btnAgregarLibro = document.getElementById("btnAgregarLibro");
const formLibro = document.getElementById("formLibro");
const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const GeneroInput = document.getElementById("genero");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const notasInput = document.getElementById("notas");
const listaLecturas = document.getElementById("listaLecturas");
const filtroAnio = document.getElementById("filtroAnio");
const filtroMes = document.getElementById("filtroMes");

const btnDark = document.getElementById("toggleDark");
const btnScrollTop = document.getElementById("btnScrollTop");
const API_URL = "https://diariolecturas-api.onrender.com/api/libros";
const NOTAS_API = "https://diariolecturas-api.onrender.com/api/notas";
let libroActivoId = null;
let notaEditandoId = null;
let libroActivoIndex = null;


let indiceEditando = null;