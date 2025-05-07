// utils/detectarIdioma.js
const translate = require('@vitalets/google-translate-api');

async function detectarIdioma(texto) {
  const resultado = await translate(texto);
  return resultado.from.language.iso;
}

module.exports = detectarIdioma;
