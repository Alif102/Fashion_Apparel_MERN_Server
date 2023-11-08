const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();

    const productCollection = client.db('productDB').collection('products')
    const cartCollection = client.db('productDB').collection('carts')


   
    app.post('/carts', async(req,res)=> {
      let cart = req.body;
      console.log(cart)
      const result = await cartCollection.insertOne(cart);
      res.send(result)
})

    app.get('/carts', async (req,res)=> {
      const id = req.params.id
      // console.log(id)
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
  //   app.get('/carts/:id', async (req, res) => {
  //     const id = req.params.id;

  //     const cursor = cartCollection.find({email:id});

  //     const result = await cursor.toArray()

     

  //     res.send(result);
  // })

//   app.get('/carts/:id', async (req, res) => {
//     const id = req.params.id;
//     const cursor = cartCollection.find({email:id})

//     const query = {_id : id};
//     const result = await cartCollection.find(query).toArray();
   

//     res.send(result);
// })


app.get('/carts/:email', async (req, res) => {


  const email = req.params.email


  const result = await cartCollection.find({ email: email }).toArray()

  res.send(result)

})



     
    app.delete('/carts/:id',async(req,res)=>{
    const id=req.params.id
     console.log(id)
     const query = {_id: new ObjectId (id)}
        const result = await cartCollection.deleteOne(query)
       res.send(result);
      })


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
      const query = {brand : brandName};
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })
    app.get("/product/:brand/:_id", async(req,res)=> {
      const idName = req.params._id;
      // const smallBrandName = brandName.toLowerCase()
      const query = {_id : idName};
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })
    // app.get("/product/:_id", async(req,res)=> {
    //   const id = req.params._id;
    //   const query = {_id : new ObjectId (id) };
    //   const options = {
    //     projection : {image : 1 , name : 1 , price : 1}
    //   }
    //   const result = await productCollection.find(query,options).toArray();
    //   res.send(result)
    // })

    
    app.get("/products/:id", async(req,res)=> {
      const id = req.params.id;
      // const smallBrandName = brandName.toLowerCase()
      const query = {_id :new ObjectId (id)};
      
      const result = await productCollection.findOne(query);
      res.send(result)
    })

    app.put("/productss/:id", async(req,res)=> {
      const id = req.params.id;
      const filter = { _id : new ObjectId(id)};
      // const options = {upsert : true};
      const updateProduct = req.body;
      // const Product = 
      console.log(updateProduct)
      const result = await productCollection.updateOne(filter, 
        {
          $set : {
            name : updateProduct.name,
            brand : updateProduct.brand,
            type : updateProduct.type,
            image : updateProduct.image,
            description : updateProduct.description,
            price : updateProduct.price,
            rating : updateProduct.rating
          }
        } );
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

