const express = require('express')
const app = express()
const path = require("path")
require("dotenv").config();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.get("/", (req, res) => {
    res.render("superherolist")
})
app.listen(3000, () => {
    console.log("server is working")
});