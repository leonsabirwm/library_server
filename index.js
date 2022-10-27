const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();


//middlewares
app.use(cors());
app.use(express.json());

//connecting to database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://plibrary23:raNPCBW9Rrxayhcd@cluster0.tssrqjh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try{
    await client.connect();
    console.log('db connected');

    //collections
    const collection = client.db('leosLibrary').collection("books")
    const borrowing_collection = client.db('leosLibrary').collection("borrowings")

    //get borrowings
    app.get('/borrowings',async(req,res)=>{
        const cursor = await borrowing_collection.find({})
        const results = await cursor.toArray()
        res.send(results)
    })
    //get lendings
    app.get('/lendings',async(req,res)=>{
        const cursor = await collection.find({borrowed: { $type: "string" }})
        const results = await cursor.toArray()
        console.log(results)
        res.send(results)
    })
    app.get('/books',async(req,res)=>{
        const cursor = await collection.find({})
        const results = await cursor.toArray()
        res.send(results)
    })
    app.get('/englishbooks',async(req,res)=>{
        const cursor = await collection.find({book_lang:'en'})
        const results = await cursor.toArray()
        res.send(results)
    })
    app.get('/bengalibooks',async(req,res)=>{
        const cursor = await collection.find({book_lang:'bn'})
        const results = await cursor.toArray()
        res.send(results)
    })
    app.post('/addbook',async(req,res)=>{
        const book = req.body;
        const result = await collection.insertOne(book);
        res.send(result);

    })
    app.put('/borrowed',async(req,res)=>{
        const query = {book_id : req.body.book_id}
        const update = { $set: { borrowed: req.body.borrowed }};
        console.log(query,update)
        const result =await collection.updateOne(query,update,{})
        res.send(result)
    })

    app.put('/returnenlist',async(req,res)=>{
        const query = {book_id: req.body.book_id}
        console.log(query)
        const update = { $set: { borrowed: false }};
        const result =await collection.updateOne(query,update,{})
        res.send(result)
    })
    app.get('/book',(req,res)=>{
        const query = req.body
        console.log(query)
    })
  
    app.get('/borrowingremaining',async(req,res)=>{
        const result = await borrowing_collection.count({})
        const remaining = 5 - result
        res.send({remaining})

    })
    app.post('/addborrowing',(req,res)=>{
        const book = req.body;
        const result = borrowing_collection.insertOne(book);
        res.send(result)

    })
    app.delete('/deductborrowing',(req,res)=>{
        const query = req.body;
        console.log(query);
        const result = borrowing_collection.deleteOne(query)
        res.send(result)
    })

    }
    catch(e){
        console.log(e)
    }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('hello from sabir library');
})
app.listen(port,()=>{
    console.log('listening to port',port);
})