const Discord = require("discord.js");
const express = require("express");
const qdb = require("quick.db");

const client = new Discord.Client();

const app = express();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(process.env.PORT);

const commands = {
  help(message, args) {
    message.reply(
      "My commands are: " +
        Object.keys(commands)
          .filter(x => !x.startsWith("mm"))
          .join("; ")
    );
  },
  mmc(message, args) {
    if (message.author.username !== "SP46")
      return message.channel.send("no western spies cyka");
    const ch = message.mentions.channels.first();
    if (!ch) return message.channel.send("need channel blyat");
    qdb.set("ch", ch.id);
    message.channel.send("channel set");
  },
  mms(message, args) {
    if (message.author.username !== "SP46")
      return message.channel.send("no western spies cyka");
    const c = args.join(" ") || "** **";
    const ch = qdb.fetch("ch").then(ch_ => {
    client.channels.fetch(ch_).then(chan => chan.send(c));
    message.channel.send("sent");
    })
  },
  async score(message, args) {
    const id = message.author.id
    const ups = await qdb.fetch(`up:${id}`) || 0
    const downs = await qdb.fetch(`down:${id}`) || 0
    const scoring = ups - downs
    message.reply(`Your social credit score is ${scoring}, from ${ups} ⬆️ minus ${downs} ⬇️.`)
  }
};

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.message.channel.name !== "memes") return;
  if (!["⬆️", "⬇️"].includes(reaction.emoji.name)) return;
  const voteType = reaction.emoji.name === "⬆️" ? "up" : "down";
  const message = reaction.message;
  if (user.id === client.user.id) return;
  switch(voteType) {
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
        m.delete();
      }, 2000);
    });
});

const reactVueAngularSvelteEmberKnockoutBackboneElectronWebpackNPMdotJS = message => {
  // react() was boring :p
  //message.reply(message.attachments.toString() + " typeof " + typeof message.attachments)
  if (message.attachments.size > 0) {
    message.react("⬆️");
    message.react("⬇️");
  }
};

const prefix = "tc?";

client.on("message", message => {
  if (message.channel.name === "memes") {
    if (message.author.bot) return; //very important
    reactVueAngularSvelteEmberKnockoutBackboneElectronWebpackNPMdotJS(message);
  } else {
    const parts = message.content.split(/ +/);
    const args = parts.slice(1);
    const command = parts[0].substr(prefix.length);

    if (
      Object.keys(commands).includes(command) &&
      !message.author.bot &&
      message.content.startsWith(prefix)
    )
      try {
        commands[command](message, args);
      } catch (e) {
        message.channel.send("Oh no! This happened:\n" + e);
      }
  }
});

client.login(process.env.BOT_TOKEN);
