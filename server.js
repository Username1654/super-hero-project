const express = require('express')
const app = express()
const path = require("path")
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.get("/", async (req, res) => {
    res.render("superherolist")
})
let db
MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

MongoClient.connect(MONGODB_URI)
  .then((client) => {
    console.log("✅ Connected to MongoDB Atlas!");
    db = client.db(`${process.env.MONGO_DB}`);
  })
  .catch((error) => console.error("❌ MongoDB Connection Error", error));

// app.get('/', (req, res) => {

// })
// app.get('/', (req, res) => {
//     res.render('superheroform')
//     console.log()
// })
// app.post('/superherform', async (req, res) => {
//     try {


//     }
//     catch (err) {
//         console.log(err)
//     }
// })
app.listen(3000, () => {
    console.log("server is working")
});