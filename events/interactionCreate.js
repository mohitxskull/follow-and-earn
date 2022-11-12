const { Interaction } = require('discord.js');

/**
 *
 * @param {Interaction} interaction
 */
module.exports = async (interaction, client = interaction.client) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'find')
      return require('../interactions/buttons/find.js')(interaction);
    else if (interaction.customId.startsWith('completed'))
      return require('../interactions/buttons/completed.js')(interaction);
    else if (interaction.customId.startsWith('verify'))
      return require('../interactions/buttons/verify.js')(interaction);
  }
};
