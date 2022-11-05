const { grantPoints, addFollower } = require("../../functions/misc")
const { Interaction, Client, MessageEmbed, MessageSelectMenu } = require("discord.js")

/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */
module.exports = async (interaction, client = interaction.client) => {
    await interaction.deferUpdate()

    const follower = interaction.customId.split("_")[1]
    const followerUser = await client.users.fetch(follower)

    const data = await client.db.get(`list_${follower}`)
    const task = data.find(x => x.target.id === interaction.user.id)

    if (!task) return interaction.editReply({
        embeds: [
            new MessageEmbed()
                .setTitle("Expired")
                .setColor("DARK_RED")
                .setDescription("You took too long to respond!")
        ], components: []
    })

    const targetEmbed = new MessageEmbed(interaction.message.embeds[0])
        .setDescription(`Thank you for cooperating, your reward points are added to your account for verifying **${task.user.twitter}** follow.`)
        .setColor("GREEN")


    await grantPoints(client.user, [interaction.user, followerUser ], 100, client.pool)
    await addFollower(task.user.id, task.user.twitter, task.target.id, task.target.twitter, client.pool)

    const taskIndex = data.indexOf(task)

    data.splice(taskIndex, 1)
    await client.db.set(`list_${follower}`, data)

    const followerEmbed = new MessageEmbed()
        .setDescription(`🎊 Congratulations! You recived reward points in your account for following **${task.target.twitter}**`)
        .setColor("GREEN")

    await followerUser.send({ embeds: [followerEmbed] })
    return interaction.editReply({ embeds: [targetEmbed], components: [] })
}