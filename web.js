const express = require("express")

const app = express()

app.set("view engine", "ejs")

app.use("/static", express.static("static"))

app.get("/", (req, res) => {
    res.redirect("/wake")
})

app.get("/wake", (req, res) => {
    res.render("woke", {
        time: new Date()
    })
})

module.exports.listen = (port) => {
    const PORT = port || process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log("WEB | Ready at port " + PORT)
    })
}