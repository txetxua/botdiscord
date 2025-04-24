const fs = require('fs');
const path = require('path');

const DIC_PATH = path.join(__dirname, '../assets/diccionarios');
let diccionarios = {};

/**
 * Carga todos los diccionarios en memoria.
 */
function cargarDiccionarios() {
  const archivos = fs.readdirSync(DIC_PATH);
  archivos.forEach((archivo) => {
    const tema = path.basename(archivo, '.json');
    const data = JSON.parse(fs.readFileSync(path.join(DIC_PATH, archivo)));
    diccionarios[tema] = data;
  });
}

/**
 * Aplica todos los diccionarios al mensaje antes de traducir.
 */
function aplicarDiccionarios(texto, idiomaOrigen) {
  let nuevoTexto = texto;

  for (const tema in diccionarios) {
    const lista = diccionarios[tema][idiomaOrigen];
    if (!lista) continue;

    for (const [clave, valor] of Object.entries(lista)) {
      const regex = new RegExp(`\\b${escapeRegExp(clave)}\\b`, 'gi');
      nuevoTexto = nuevoTexto.replace(regex, valor);
    }
  }

  return nuevoTexto;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { cargarDiccionarios, aplicarDiccionarios };
