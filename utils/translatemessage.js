const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');
const { buscarSugerencia } = require('./sugerencias');

const translate = new Translate({
  keyFilename: path.join(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

const banderas = {
  es: '🇪🇸',
  it: '🇮🇹'
};

function detectarIdioma(texto) {
  const españolRegex = /[ñáéíóúü¡¿]/i;
  const italianoRegex = /\b(che|non|per|una|sono|ciao|grazie|bene|amico|ciao)\b/i;

  if (españolRegex.test(texto)) return 'es';
  if (italianoRegex.test(texto)) return 'it';

  const conteo = {
    es: (texto.match(/[aeiouáéíóúüñ]/gi) || []).length,
    it: (texto.match(/[aeiouàèéìòù]/gi) || []).length
  };

  return conteo.es >= conteo.it ? 'es' : 'it';
}

async function translateMessage(message) {
  const original = message.content.trim();
  const idiomaOrigen = detectarIdioma(original);
  const idiomaDestino = idiomaOrigen === 'es' ? 'it' : 'es';

  // Buscar sugerencia primero
  const sugerida = await buscarSugerencia(original);
  if (sugerida) {
    return `${banderas[idiomaDestino]} ${sugerida}`;
  }

  // Si no hay sugerencia, usar Google Translate
  const [translated] = await translate.translate(original, idiomaDestino);
  return `${banderas[idiomaDestino]} ${translated}`;
}

module.exports = { translateMessage };
