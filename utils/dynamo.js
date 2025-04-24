// utils/dynamo.js
const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;

async function guardarTraduccion(messageId, original, traducido, idiomaOrigen, idiomaDestino) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      messageId,
      original,
      traducido,
      idiomaOrigen,
      idiomaDestino,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log("Traducción guardada en DynamoDB");
  } catch (err) {
    console.error("Error al guardar en DynamoDB:", err);
  }
}

async function obtenerTraduccion(messageId) {
  const params = {
    TableName: TABLE_NAME,
    Key: { messageId },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    return data.Item;
  } catch (err) {
    console.error("Error al obtener traducción:", err);
    return null;
  }
}

module.exports = {
  guardarTraduccion,
  obtenerTraduccion,
};
