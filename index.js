const { bot_token } = require("./config.json")
const { Client, Intents } = require("discord.js")
const { QuickDB } = require("quick.db")
const { readdirSync } = require("fs")
const { schedule } = require('node-cron')

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_MEMBERS
    ]
})

client.db = new QuickDB();

schedule("*/30 * * * *", async () => {
    for (const data of await client.db.all().then(database => database.filter(x => x.id.startsWith("list_"))))
        for (const [i, task] of Object.entries(data.value))
            if (Date.now() > task.expires_at) data.value.splice(i, 1), await client.db.set(data.id, data.value)
})

for (const event of readdirSync("./events"))
    client.on(event.split(".")[0], require(`./events/${event}`).bind(null))

client.login(bot_token)