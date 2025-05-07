// utils/traductor.js
const translate = require('@vitalets/google-translate-api');
const detectarIdioma = require('./detectarIdioma');
const diccionarios = require('./diccionarios');
const aplicarDiccionarios = require('./aplicarDiccionarios');

async function translateMessage(mensaje) {
  const idiomaOrigen = await detectarIdioma(mensaje);
  const idiomaDestino = idiomaOrigen === 'es' ? 'it' : 'es';

  const resultado = await translate(mensaje, {
    from: idiomaOrigen,
    to: idiomaDestino,
  });

  const textoTraducido = aplicarDiccionarios(resultado.text, idiomaDestino);
  return textoTraducido;
}

module.exports = {
  translateMessage,
};
