const { findMatchForFollow, findTwittyUser } = require("../../functions/misc")
const { Interaction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js")

/**
 * 
 * @param {Interaction} interaction 
 * @param {Client} client 
 * @returns 
 */
module.exports = async (interaction, client=interaction.client) => {
    await interaction.deferReply({ ephemeral: true })
    /* Check how many task he has in queue */
    const followsInQueue = await client.db.get(`list_${interaction.user.id}`) || []

    if (followsInQueue.length >= 10) return interaction.followUp({
        content: "You already have follow task in queue, you can not add mode unless old task are confirmed!"
    })

    /* Check if author has twitty account or not */
    const authorTwittyAccount = await findTwittyUser(interaction.user.id)

    if (!authorTwittyAccount) return interaction.followUp({
        content: "We can not move further unless you link your discord account with twittycord!"
    })

    if (!authorTwittyAccount.connections.find(x => x.name === "twitter")) return interaction.followUp({
        content: "You need to link your twitter account with twittycord to move further!"
    })

    /* Find random user to follow */
    const userToFollow = await findMatchForFollow(interaction.user.id, followsInQueue, client.pool).catch(console.log)

    if (!userToFollow) return interaction.followUp({
        content: "It seems like I am unable to find good match for you! Please try again later!."
    })

    const {
        accountDisplayName
    } = userToFollow.connections.find(x => x.name === "twitter")

    const embed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`Go to the profile of **[${accountDisplayName}](https://twitter.com/${accountDisplayName})** and follow him then click on **Complete** button and wait until followed user confirms it.`)

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`completed_${userToFollow.userId}`)
                .setLabel("COMPLETED")
                .setEmoji("👍")
                .setStyle("SECONDARY")
        )

    const msg = await interaction.user.send({
        embeds: [embed],
        components: [row]
    }).catch(() => {})

    /* If dms off */
    if(!msg) return interaction.followUp({
        content: "You need to open your dms first! I am unable to send you private message."
    })

    followsInQueue.push({
        expires_at: Date.now() + 43200000, //+ 12 hours
        user: {
            id: interaction.user.id,
            twitter: authorTwittyAccount.connections.find(x => x.name === "twitter").accountDisplayName,
        },
        target: {
            id: userToFollow.userId,
            twitter: accountDisplayName
        },
        messageId: msg.id
    })

    await client.db.set(`list_${interaction.user.id}`, followsInQueue)
    return interaction.followUp({
        content: "Sent details in your direct messages!"
    })
}