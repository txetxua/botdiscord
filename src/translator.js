const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const { aplicarDiccionarios } = require('./dictionary');

const client = new TranslationServiceClient();
const projectId = await client.getProjectId();
const location = 'global';

const FLAGS = {
  es: '🇪🇸',
  it: '🇮🇹'
};

async function traducirTexto(textoOriginal) {
  const [detection] = await client.detectLanguage({
    parent: `projects/${projectId}/locations/${location}`,
    content: textoOriginal,
    mimeType: 'text/plain',
  });

  const idiomaDetectado = detection.languages[0].languageCode;
  let idiomaDestino;

  if (idiomaDetectado.startsWith('es')) {
    idiomaDestino = 'it';
  } else if (idiomaDetectado.startsWith('it')) {
    idiomaDestino = 'es';
  } else {
    return null;
  }

  const textoPreprocesado = aplicarDiccionarios(textoOriginal, idiomaDetectado);

  const [response] = await client.translateText({
    parent: `projects/${projectId}/locations/${location}`,
    contents: [textoPreprocesado],
    mimeType: 'text/plain',
    sourceLanguageCode: idiomaDetectado,
    targetLanguageCode: idiomaDestino,
  });

  const traduccion = response.translations[0].translatedText;

  return {
    traduccion,
    bandera: FLAGS[idiomaDestino]
  };
}

module.exports = { traducirTexto };
