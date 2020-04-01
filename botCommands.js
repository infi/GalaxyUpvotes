const fetch = require("node-fetch")
const Discord = require("discord.js")
const qdb = require("quick.db")

module.exports = {
    help() {
        const { message } = require("./bot")
        message.channel.send(`My commands are: ${Object.keys(this).filter(x => !x.startsWith("mm")).join(", ")}`)
    },
    jpeg() {
        const { message } = require("./bot")
        message.channel.send("The image shittifier is **disabled** due to potential security issues.\nTry out <https://www.kamogo.com/20>, <:Perhaps:655923761027219467>?")
    },
    async getmeme() {
        const { message, args } = require("./bot")
        const subs = [
            "me_irl",
            "memes",
            "dankmemes",
            "meirl",
            "pikmin",
            "bikinibottomtwitter",
            "animemes"
        ]
        const sub = await subs[Math.floor(Math.random() * subs.length)]
        let sort
        if (args.includes("sort=new")) sort = "new"
        else if (args.includes("sort=popcorn")) sort = "controversial"
        else if (args.includes("sort=yes")) return message.channel.send("no")
        else sort = "hot";
        const res = await fetch("https://reddit.com/r/" + sub + "/" + sort + ".json")
        const subicon = await fetch("https://reddit.com/r/" + sub + "/about.json")
        const subjson = await subicon.json()
        const iconurl = subjson.data.icon_img
        const body = await res.json()
        const posts = body.data.children.filter(
            x => !!x.data.url && !x.data.over_18
        )
        const randpost = await posts[Math.floor(Math.random() * posts.length)].data
        const embedReddit = new Discord.MessageEmbed()
            .setTitle(randpost.title)
            .setColor(0xff4500)
            .setAuthor(`u/${randpost.author} in r/${randpost.subreddit}`, iconurl)
            .setImage(randpost.url)
            .setFooter("Votes: " + randpost.ups + " | From Reddit")
            .setURL(`https://redd.it/${randpost.name.substr(3)}`)
        message.channel.send(embedReddit).then(m => {
            m.react("⬆️").then(() => {
                m.react("⬇️")
            })
        });
    },
    gm() { this.getmeme() },
    mme() {
        const { message, args, sp } = require("./bot")
        if (message.author.id !== sp) return message.channel.send("You are not allowed to use this command.")
        const clean = (text) => {
            if (typeof (text) === "string") {
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
            } else {
                return text
            }
        }
        try {
            const code = args.join(" ")
            let evaled = eval(code)

            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled)
            }

            message.channel.send(clean(evaled), { code: "js" })
        } catch (err) {
            message.channel.send(`Can't: \`\`\`js\n${clean(err)}\n\`\`\``)
        }
    },
    mmc() {
        const { message, sp } = require("./bot")
        if (message.author.id !== sp) return message.channel.send("You are not allowed to use this command.")
        if (!message.mentions.channels.first()) return message.channel.send("Invalid channel")
        qdb.set("mmc:ch", message.mentions.channels.first().id)
    },
    mms() {
        const { message, args, sp, client } = require("./bot")
        if (message.author.id !== sp) return message.channel.send("You are not allowed to use this command.")
        const id = qdb.fetch("mmc:ch")
        if (!id) return message.channel.send("Set the channel first.")
        client.channels.fetch(id).then(ch => {
            ch.send(args.join(" "))
        })
    },
    mma() {
        const { message, args, sp, client } = require("./bot")
        if (message.author.id !== sp) return message.channel.send("You are not allowed to use this command.")
        client.user.setPresence({
            activity: {
                name: args.join(" ")
            }
        })
    },
    async score() {
        const { message } = require("./bot")
        const id = message.author.id
        const ups = (await qdb.fetch(`up:${id}`)) || 0
        const downs = (await qdb.fetch(`down:${id}`)) || 0
        const scoring = ups - downs
        message.reply(`Your social credit score is ${scoring}, from ${ups} ⬆️ minus ${downs} ⬇️.`)
    }
}