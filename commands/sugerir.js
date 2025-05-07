const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'TraduccionesPersonalizadas';

module.exports = async function handleSuggestion(message) {
  const partes = message.content.split('|');
  if (partes.length < 4) {
    await message.reply('❌ Formato incorrecto. Usa: `!sugerir | origen | destino | categoría`');
    return;
  }

  const origen = partes[1].trim().toLowerCase();
  const destino = partes[2].trim().toLowerCase();
  const categoria = partes[3].trim().toLowerCase();

  const item = {
    id: `${origen}_${destino}_${categoria}_${Date.now()}`,
    origen,
    destino,
    categoria,
    autor: message.author.username,
    timestamp: new Date().toISOString(),
  };

  try {
    await dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise();
    await message.reply('✅ Sugerencia guardada correctamente.');
  } catch (error) {
    console.error('❌ Error al guardar la sugerencia:', error);
    await message.reply('❌ Error al guardar la sugerencia.');
  }
};
