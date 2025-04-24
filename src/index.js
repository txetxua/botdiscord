require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { traducirTexto } = require('./translator');
const { cargarDiccionarios } = require('./dictionary');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  cargarDiccionarios();
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.trim()) return;

  try {
    const resultado = await traducirTexto(message.content);
    if (resultado) {
      const { traduccion, bandera } = resultado;
      await message.channel.send(`${bandera} ${traduccion}`);
    }
  } catch (err) {
    console.error('❌ Error al traducir:', err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
