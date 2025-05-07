const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Configuración del cliente DynamoDB
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Guarda una sugerencia de traducción en DynamoDB.
 * @param {string} fraseOriginal - Texto original sugerido.
 * @param {string} traduccionSugerida - Traducción sugerida por el usuario.
 * @param {string} autor - Nombre de usuario de quien sugiere.
 */
async function guardarSugerencia(fraseOriginal, traduccionSugerida, autor) {
  const fecha = new Date().toISOString();
  const id = uuidv4();

  const params = {
    TableName: process.env.SUGERENCIAS_TABLE,
    Item: {
      id: { S: id },
      fraseOriginal: { S: fraseOriginal },
      traduccionSugerida: { S: traduccionSugerida },
      autor: { S: autor },
      fecha: { S: fecha }
    }
  };

  const command = new PutItemCommand(params);
  await dbClient.send(command);
}

module.exports = {
  guardarSugerencia
};
