const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function verifyToken(req, res, next) {
//     if (req.headers?.authorization?.startsWith('Bearer ')) {
//         const token = req.headers.authorization.split(' ')[1];

//         try {
//             const decodedUser = await admin.auth().verifyIdToken(token);
//             req.decodedEmail = decodedUser.email;
//         }
//         catch {

//         }

//     }
//     next();
// }

async function run() {
    try {
        await client.connect();
        const database = client.db('tech_foring');
        const usersCollection = database.collection('users');
        const jobsCollection = database.collection('jobs');

        // POST packages
        app.post('/jobs', async (req,res)=>{
            const result = await jobsCollection.insertOne(req.body);
            res.send(result);
        });
        // get packages to server
        app.get('/jobs', async (req,res)=>{
            const result = await jobsCollection.find({}).toArray();
            res.json(result);
        });
        // get individual package
        app.get('/jobs/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const package = await packagesCollection.findOne(query);
            res.send(package);
        });
        // delete orders
        app.delete('/jobs/:id', async(req,res)=>{
            const query = {_id: ObjectId(req.params.id)};
            const result = await emailCollection.deleteOne(query);
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