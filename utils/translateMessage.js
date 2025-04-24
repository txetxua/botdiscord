// utils/translateMessage.js
const { Translate } = require("@google-cloud/translate").v2;
const { guardarTraduccion } = require("./dynamo");
const path = require("path");
require("dotenv").config();

const translate = new Translate({
  keyFilename: path.join(__dirname, "..", process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

// Detección básica (mejorarla en siguiente paso)
function detectarIdioma(texto) {
  const es = /[ñáéíóúü¡¿]/i.test(texto);
  const it = /\b(perché|ciao|grazie|bene|amico|ragazzo|sono)\b/i.test(texto);
  if (es) return "es";
  if (it) return "it";
  return "auto";
}

async function traducirMensajeConContexto(message) {
  const mensajesAnteriores = await message.channel.messages.fetch({ limit: 5 });
  const historial = mensajesAnteriores
    .filter((msg) => msg.id !== message.id)
    .map((msg) => `${msg.author.username}: ${msg.content}`)
    .reverse()
    .join("\n");

  const idiomaOrigen = detectarIdioma(message.content);
  const idiomaDestino = idiomaOrigen === "es" ? "it" : "es";
  const bandera = idiomaDestino === "es" ? "🇪🇸" : "🇮🇹";

  const input = `${historial}\n${message.author.username}: ${message.content}`;

  try {
    const [traduccion] = await translate.translate(message.content, idiomaDestino);

    await guardarTraduccion(
      message.id,
      message.content,
      traduccion,
      idiomaOrigen,
      idiomaDestino
    );

    await message.channel.send(`${bandera} ${traduccion}`);
  } catch (error) {
    console.error("Error al traducir:", error);
    await message.channel.send("❌ Error al traducir el mensaje.");
  }
}

module.exports = traducirMensajeConContexto;
