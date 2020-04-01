const dotenv = require("dotenv")

dotenv.config()

const bot = require("./bot")
const web = require("./web")

web.listen()
bot.boot(process.env.TOKEN, process.env.OWNER)