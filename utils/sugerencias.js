// ===== utils/sugerencias.js =====
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const guardarSugerencia = async (sugerencia) => {
  const params = {
    TableName: 'TraduccionesSugeridas',
    Item: sugerencia,
  };
  await docClient.put(params).promise();
};

const cargarDiccionarios = () => {
  const diccionarios = {};
  const dirPath = path.join(__dirname, '../assets/diccionarios');

  fs.readdirSync(dirPath).forEach((archivo) => {
    if (archivo.endsWith('.json')) {
      const nombre = path.basename(archivo, '.json').toLowerCase();
      diccionarios[nombre] = JSON.parse(fs.readFileSync(path.join(dirPath, archivo), 'utf-8'));
    }
  });

  return diccionarios;
};

module.exports = {
  guardarSugerencia,
  cargarDiccionarios,
};
