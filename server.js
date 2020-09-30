require("dotenv").config();
const Express = require("express");
const BodyParser = require("body-parser");
let cors = require('cors');
const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const port=1000;
const CONNECTION_URL = process.env.MONGOURI;
const mongoOptions = {useNewUrlParser : true,useUnifiedTopology: true};

var app = Express();
app.use(BodyParser.json());
app.use(cors());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/createorders", (request, response) => {
    MongoClient.connect(CONNECTION_URL,mongoOptions, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = request.body;
        dbo.collection("truck").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          response.send("1 doucment inserted")
          db.close();
        });
      });
});
app.put("/editorder/:id",(req,res) =>{
  console.log(req.params.id)
  MongoClient.connect(CONNECTION_URL,mongoOptions, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { _id: ObjectID(req.params.id) };
      var newvalues = { $set:req.body };
      dbo.collection("truck").updateOne(myquery, newvalues, function(err, re) {
        if (err) throw err;
        console.log("1 document updated");
        res.send(re);
        db.close();
      });
    });
} )
app.get("/allorders/", (req,res) => {
  MongoClient.connect(CONNECTION_URL,mongoOptions, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("truck").find().toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    });
})
app.get("/assignto", (req,res) => {
  MongoClient.connect(CONNECTION_URL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { assignstatus: "undone" };
      dbo.collection("truck").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    });
})

app.get("/assigned", (req,res) => {
  MongoClient.connect(CONNECTION_URL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { assignstatus: "done" };
      dbo.collection("truck").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    });
})
app.get("/paymentdone", (req,res) => {
  MongoClient.connect(CONNECTION_URL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { paymentstatus: "done" };
      dbo.collection("truck").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    });
})
app.get("/paymentleft", (req,res) => {
  MongoClient.connect(CONNECTION_URL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var query = { paymentstatus: "undone" };
      dbo.collection("truck").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    });
})

app.listen(port, (request, respond) => {
    console.log(`Our server is live on ${port}. Yay!`);
  });