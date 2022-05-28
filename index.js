const express = require('express')
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gxab.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const productsCollection = client.db('manufacturer-website').collection('products');
        const reviewCollection = client.db('manufacturer-website').collection('review');
        const bookingCollection = client.db('manufacturer-website').collection('booking');

        const userCollection = client.db('manufacturer-website').collection('users');




        //----------------------------------------//
        //--------This is Review section----------//
        //----------------------------------------//


        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });

        })

        app.get('/tool', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        })
        app.get('/allTool', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        })


        //----------------------------------------//
        //--------This is Review section----------//
        //----------------------------------------//

        //Its for review showing on ui.
        app.get('/review', async (req, res) => {
            const query = {};
            const reviews = (await reviewCollection.find(query).toArray()).reverse();

            res.send(reviews);
        })

        //Its for review add from ui
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview)
            res.send(result)
        })

        app.get('/booking', async (req, res) => {
            const tool = req.query.tool;
            const query = { tool: tool };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        })



        app.post('/booking', async (req, res) => {
            const newBooking = req.body;
            const booking = await bookingCollection.insertOne(newBooking)
            return res.send({ sucess: true, booking });

        })



    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Manufacturer App')
})

app.listen(port, () => {
    console.log(`Manufacturer app listening on port ${port}`)
})




