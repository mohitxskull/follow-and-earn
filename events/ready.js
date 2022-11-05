const { checkMainChannel, listFollowers } = require("../functions/misc")
const { mysql_creds } = require("../config.json")

const mysql = require("mysql2/promise")

module.exports = async (client) => {
    console.log("Bot is connected to discord!")

    client.pool = mysql.createPool(mysql_creds)
    return checkMainChannel(client)
}