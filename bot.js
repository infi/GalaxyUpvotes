const { Client, MessageEmbed: Embed, Message } = require("discord.js")
const qdb = require("quick.db")

const client = new Client()

const commands = require("./botCommands")

client.on("ready", () => {
    console.log("BOT | Ready as user " + client.user.tag)
})

const prefix = "tc?"

/**
 * Handle meme post
 * @param {Message} message 
 */
const handleMemePost = (message) => {
    message.react("⬆️").then(() => {
        message.react("⬇️")
    })
}

client.on("messageReactionAdd", (reaction, user) => {
    if (user.bot) return
    if (reaction.message.channel.name !== "memes") return
    if (!["⬆️", "⬇️"].includes(reaction.emoji.name)) return
    // if ((qdb.fetch(`rated:${user.id}`) || []).includes(reaction.message.id)) return
    const voteType = reaction.emoji.name === "⬆️" ? "up" : "down"
    const message = reaction.message
    if (user.id === client.user.id) return
    switch (voteType) {
        case "up":
            qdb.add(`up:${message.author.id}`, 1)
            break
        case "down":
            qdb.add(`down:${message.author.id}`, 1)
            break
    }
    message.channel
        .send("<@" + user.id + "> Your " + voteType + "vote was counted.")
        .then(m => {
            setTimeout(() => {
                m.delete()
            }, 2000)
        })
    // qdb.push(`rated:${user.id}`, reaction.message.id)
})

client.on("message", (message) => {
    if (message.channel.name === "memes" && message.attachments.first() && !message.content.startsWith(prefix)) {
        return handleMemePost(message)
    }
    if (message.author.bot) return

    const parts = message.content.split(/ +/)
    const command = parts[0].substr(prefix.length)
    const args = parts.slice(1)

    module.exports.message = message
    module.exports.args = args
    module.exports.sp = client.sp
    module.exports.client = client

    if (!message.content.startsWith(prefix)) return

    if (Object.keys(commands).includes(command)) {
        commands[command]()
    } else {
        message.reply(`I don't know that command. Try \`${prefix}help\`, <:Perhaps:655923761027219467>?`)
    }

    // https://www.kamogo.com/20 needs more jpeg alternative
})

module.exports.boot = (token, owner) => {
    if (!token) throw new Error("Token must exist")

    client.sp = owner
    client.login(token)
}