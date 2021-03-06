const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqbro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tech_foring');
        const usersCollection = database.collection('users');
        const jobsCollection = database.collection('jobs');

        app.post('/jobs', async (req,res)=>{
            const result = await jobsCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
          });
          app.get('/jobs', async (req,res)=>{
            const result = await jobsCollection.find({}).toArray();
            res.json(result);
          });
          app.get('/jobs/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const car = await jobsCollection.findOne(query);
            res.send(car);
        });
        app.delete('/jobs/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const result = await jobsCollection.deleteOne(query);
            res.json(result);
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });
        //user put API
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello TechForing portal!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})