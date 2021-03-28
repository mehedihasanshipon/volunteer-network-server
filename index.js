const express = require('express');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require('mongodb').MongoClient;
// const { ObjectId } = require('bson');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_NAME);

app.get('/', (req, res) => {
  res.send('Hello volunteer network!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzoti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log({err});
  const collection = client.db("volunteer").collection("events");
  app.post('/addEvent',(req,res)=>{
      const event = req.body;
      collection.insertOne(event)
      .then(result=>{
          res.send(result.insertedCount > 0)
          console.log("Data inserted successfully");
      })
    //   console.log("New event info",event);
  })

//   Display data
app.get('/events',(req,res)=>{
    collection.find()
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

// Delete Event
app.delete('/deleteEvent/:id',(req,res)=>{
    const id =ObjectId((req.params.id));
    console.log(id);
    collection.findOneAndDelete({_id:id})
    .then(documents=>{
        res.send(!!documents.value);
    })
})
  
  console.log("Database connected successfully");
  // perform actions on the collection object
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})