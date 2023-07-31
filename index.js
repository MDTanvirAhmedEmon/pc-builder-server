const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oj1ojow.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const db = client.db('PC_Builder');
    const productCollection = db.collection('product');

    app.get('/products', async(req, res) => {
       const products = await productCollection.find({}).toArray();
       res.send({ status: true, data: products });
    });

    app.get('/random-product', async(req, res) => {
        const cursor = await productCollection.aggregate([{ $sample: { size: 6 } }]);
        const randomProducts = await cursor.toArray();
        res.send({ status: true, data: randomProducts });
    } );

    app.get('/category/:category', async(req, res) => {
       const givenCategory = req.params.category;
        const getCategoriesProducts = await productCollection.find({category: givenCategory}).toArray();
        // console.log(getCategoriesProducts);
        res.send({ status: true, data: getCategoriesProducts });
    } );
    
    app.get('/product/:id', async(req, res) => {
      const id = req.params.id;

       const singleProduct = await productCollection.findOne({ _id: new ObjectId(id) });
       res.send({ status: true, data: singleProduct });
    });

  } finally {

  }
}




run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})