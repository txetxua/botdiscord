require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const translateMessage = require('./utils/translateMessage');
const handleSuggestion = require('./commands/sugerir');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Comando para sugerencias
  if (message.content.startsWith('!sugerir')) {
    await handleSuggestion(message);
    return;
  }

  try {
    const { translatedText, targetLang } = await translateMessage(message.content);
    if (!translatedText) return;

    const flag = targetLang === 'es' ? '🇪🇸' : '🇮🇹';
    await message.reply(`${flag} ${translatedText}`);
  } catch (error) {
    console.error('❌ Error al traducir el mensaje:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
