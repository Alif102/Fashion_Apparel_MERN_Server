const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 5000;

// middleware

 app.use(cors());
 app.use(express.json());


 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.30z9ip6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('products')

    app.post('/product', async(req,res)=> {
          const newProduct = req.body;
          console.log(newProduct)
          const result = await productCollection.insertOne(newProduct);
          res.send(result)
    })


    app.get('/product', async (req,res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/product/:brand", async(req,res)=> {
      const brandName = req.params.brand;
      // const smallBrandName = brandName.toLowerCase()
      const query = {brand : brandName};
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=> {
    res.send('Coffee server is running')

})

app.listen(port, ()=> {
    console.log(`coffee server running on port : ${port}`)
})

