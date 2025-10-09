const express = require('express');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const app = express();
const { MongoClient, ObjectId} = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
// Helper function to read heroes
// console.log('MongoDB URI:', process.env.MONGODB_URI);

MongoClient.connect(process.env.MONGODB_URI)
.then((client) => {
console.log('✅ Connected to MongoDB');
db = client.db("superhero-db");
heroes = db.collection('heroes');
})
.catch((error) => console.error('❌ MongoDB Error', error));


app.get('/', (req, res) => {
res.render('adminlog');
})
app.get("/superheroform", (req,res)=>{
res.render('superheroform')
})
 app.post('/superheroform', async (req, res) => {
      try {
        const newHero = {
          _id: Date.now().toString(),
          superName: req.body.superName,
          realName: req.body.realName,
          superpower: req.body.superpower,
          powerLevel: parseInt(req.body.powerLevel),
          secretIdentity: req.body.secretIdentity === "true",
          createdAt: new Date().toISOString(),
        };

        console.log('Received:', newHero);
        const result = await heroes.insertOne(newHero);
        console.log('Inserted:', result);

        res.status(201).json({ success: true, message: 'Hero created successfully!' });
      } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

app.get('/superherolist', async (req, res) => {
try{
const heroess = await db.collection('heroes').find().toArray();
console.log(heroes);
res.render("superheroList", { heroess });

}catch(error){
res.status(500).json({ success: false, error: error.message });
}
})
app.get('/superheroform', (req, res) => {
res.render('superheroform')
})
app.delete('/heroes/:id', async (req, res) => {
  try {
    const result = await db.collection('heroes').deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Hero not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.put('/heroes/:id', async (req, res) => {
  try {
    const { superName, realName } = req.body;
    const result = await db.collection('heroes').updateOne(
      { _id: req.params.id },   // match string _id
      { $set: { superName, realName } }
    );
    if (result.modifiedCount === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Hero not found or unchanged' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.listen(3000, () => {
console.log(`Server running on http://localhost:${3000}`);
});