const fs = require('fs');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({
  keyFilename: path.join(__dirname, '..', 'clave.json'),
});

// Cargar diccionarios de forma segura
function loadDictionaries() {
  const files = ['gaming.json', 'sexo.json', 'jerga.json', 'insultos.json'];
  const dirPath = path.join(__dirname, '..', 'assets', 'diccionarios');

  return files.flatMap((file) => {
    try {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error(`❌ Error al cargar ${file}:`, err);
      return [];
    }
  });
}

const customDictionaries = loadDictionaries();

function applyDictionaries(text, sourceLang, targetLang) {
  let modifiedText = text;

  for (const entry of customDictionaries) {
    if (entry[sourceLang] && entry[targetLang]) {
      const pattern = new RegExp(`\\b${entry[sourceLang]}\\b`, 'gi');
      modifiedText = modifiedText.replace(pattern, entry[targetLang]);
    }
  }

  return modifiedText;
}

async function translateMessage(text) {
  const [detection] = await translate.detect(text);
  const sourceLang = Array.isArray(detection) ? detection[0].language : detection.language;
  const targetLang = sourceLang === 'es' ? 'it' : 'es';

  const preTranslated = applyDictionaries(text, sourceLang, targetLang);
  const [translation] = await translate.translate(preTranslated, targetLang);

  return { translatedText: translation, targetLang };
}

module.exports = translateMessage;
