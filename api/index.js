const express = require("express");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECT_MONGODB_URL;
const DATABASENAME = "todoappdb";
let database;


app.get("/", (request, response) => {
    response.send("<h1>Добро пожаловать на сервер!!!</h1>");
})

// app.get("/api/todoapp/GetNotes", (request, response) => {
//     database.collection("todoappcollection").find({}).toArray((error, result) => {
//         response.send(result)
//     })
// })
app.get("/api/todoapp/GetNotes", async (request, response) => {
  try {
    const collection = database.collection("todoappcollection");
    const result = await collection.find({}).toArray();
    response.json(result);
  } catch (error) {
    console.error("Ошибка при получении заметок из базы данных:", error);
    response.status(500).send("Ошибка сервера");
  }
});

// app.post("/api/todoapp/AddNotes", (request, response) => {
//     database.collection("todoappcollection").count({}, function(error, numOfDocs) {
//       database.collection("todoappcollection").insertOne({
//         id: (numOfDocs + 1).toString(),
//         description: request.body.newNotes
//       });
//       response.json("Added Successfully");
//     });
// });
app.post("/api/todoapp/AddNotes", async (request, response) => {
  try {
    const collection = database.collection("todoappcollection");
    const numOfDocs = await collection.countDocuments({});
    await collection.insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes,
    });
    response.json("Заметка успешно добавлена");
  } catch (error) {
    console.error("Ошибка при добавлении заметки в базу данных:", error);
    response.status(500).send("Ошибка сервера");
  }
});

// app.delete("/api/todoapp/DeleteNotes", (request, response) => {
//     database.collection("todoappcollection").deleteOne({
//         id: request.query.id
//     });
//     response.json("Deleted Successfully")
// })
app.delete("/api/todoapp/DeleteNotes", async (request, response) => {
  try {
    const collection = database.collection("todoappcollection");
    await collection.deleteOne({
      id: request.query.id,
    });
    response.json("Заметка успешно удалена");
  } catch (error) {
    console.error("Ошибка при удалении заметки из базы данных:", error);
    response.status(500).send("Ошибка сервера");
  }
});

// app.listen(PORT, () => {
//     MongoClient.connect(CONNECTION_STRING, (error, client) => {
//         database = client.db(DATABASENAME);
//         console.log(`Server started on port ${PORT}, MongoDB connected successfully`);
//     })
// })

async function startServer() {
  try {
    const client = await MongoClient.connect(CONNECTION_STRING);
    database = client.db(DATABASENAME);
    app.listen(PORT, () => {
      console.log(
        `Сервер запущен на порту ${PORT}, подключение к MongoDB успешно установлено`
      );
    });
  } catch (error) {
    console.error("Ошибка при запуске сервера:", error);
  }
}

startServer();

module.exports = app;
