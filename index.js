const express = require("express");
const { MongoClient, ServerApiVersion, ObjectID } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ceqv9d.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Students");
    const studentsColletion = database.collection("studentsColletion");

    // Update API

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };

      const result = await studentsColletion.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // GET API for view single student

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsColletion.findOne(query);
      res.json(result);
    });

    // Delete API

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsColletion.deleteOne(query);
      res.json(result);
    });

    // Get API

    app.get("/users", async (req, res) => {
      const cursor = studentsColletion.find({});
      const user = await cursor.toArray();
      res.send(user);
    });

    //   POST API

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await studentsColletion.insertOne(newUser);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`<h1>Hello world</h1>`);
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
