// commands/sugerir.js
const { SlashCommandBuilder } = require("discord.js");
const { obtenerTraduccion, guardarTraduccion } = require("../utils/dynamo");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sugerir")
    .setDescription("Sugiere una traducción alternativa para un mensaje.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID del mensaje original")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("traduccion")
        .setDescription("Nueva traducción sugerida")
        .setRequired(true)
    ),

  async execute(interaction) {
    const messageId = interaction.options.getString("id");
    const nuevaTraduccion = interaction.options.getString("traduccion");

    const traduccionExistente = await obtenerTraduccion(messageId);

    if (!traduccionExistente) {
      await interaction.reply({
        content: `❌ No se encontró ninguna traducción con la ID \`${messageId}\`.`,
        ephemeral: true,
      });
      return;
    }

    await guardarTraduccion(
      messageId,
      traduccionExistente.original,
      nuevaTraduccion,
      traduccionExistente.idiomaOrigen,
      traduccionExistente.idiomaDestino
    );

    await interaction.reply({
      content: `✅ ¡Gracias! La nueva traducción ha sido guardada.`,
      ephemeral: true,
    });
  },
};
