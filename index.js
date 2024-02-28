const express = require("express");

const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const CONNECTION_STRING = "mongodb+srv://polyakov130495:3321974filter@filippapp.nw81pqf.mongodb.net/?retryWrites=true&w=majority&appName=FilippApp";



const DATABASENAME = "todoappdb";
let database;

app.listen(5038, () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Server started on port 5038, MongoDB connected successfully");
    })
})

app.get("/api/todoapp/GetNotes", (request, response) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        response.send(result)
    })
})



app.post("/api/todoapp/AddNotes", (request, response) => {
    database.collection("todoappcollection").count({}, function(error, numOfDocs) {
      database.collection("todoappcollection").insertOne({
        id: (numOfDocs + 1).toString(),
        description: request.body.newNotes
      });
      response.json("Added Successfully");
    });
  });

app.delete("/api/todoapp/DeleteNotes", (request, response) => {
    database.collection("todoappcollection").deleteOne({
        id: request.query.id
    });
    response.json("Deleted Successfully")
})