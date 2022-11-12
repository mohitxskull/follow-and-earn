const { Interaction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js")

/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */
module.exports = async (interaction, client=interaction.client) => {
    const targetUser = await client.users.fetch(interaction.customId.split("_")[1])
    const userQueueTask = await client.db.get(`list_${interaction.user.id}`).then(data => data.find(x => x.target.id === targetUser.id ))

    interaction.message.delete()

    const targetEmbed = new MessageEmbed()
        .setDescription(`Please check your twitter notification and confirm if this **[twitter account](https://twitter.com/intent/user?user_id=${userQueueTask.user.twitter})** followed you or not! On confirmation, you will recive reward points.`)
        .setColor("RED")

    const targetRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`verify_${interaction.user.id}`)
                .setLabel("⚪ VERIFY")
                .setStyle("DANGER")
        )
    
    return targetUser.send({
        embeds: [ targetEmbed ],
        components: [ targetRow ]
    }).catch(err => console.log("Unable to send dm to", targetUser.tag))

}