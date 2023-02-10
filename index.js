const express = require("express");
const app = express();
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAMES}:${process.env.PASSWOERD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function passenger() {
  try {
    const allCountry = client.db("thePassenger").collection("country");
    const TourismArea = client.db("thePassenger").collection("tourismArea");
    const perfectHoliday = client
      .db("thePassenger")
      .collection("parfectHoliday");
    const topVisitedArea = client
      .db("thePassenger")
      .collection("topVisitedArea");
    const userCollection = client
      .db("thePassenger")
      .collection("userCollection");
    const bookingCollection = client
      .db("thePassenger")
      .collection("bookingData");

    // allCountry
    app.get("/allcountry", async (req, res) => {
      const search = req.query.search;

      let query = {};
      if (search.length) {
        query = {
          $text: {
            $search: search,
          },
        };
      }
      const result = await allCountry.find(query).limit(6).toArray();

      res.send(result);
    });

    app.get("/allCountry/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allCountry.findOne(query);
      res.send(result);
    });

    // tourism Area
    app.get("/tourismArea", async (req, res) => {
      const search = req.query.search;
      let query = {};
      if (search.length) {
        query = {
          $text: {
            $search: search,
          },
        };
      }
      const result = await TourismArea.find(query).limit(6).toArray();
      res.send(result);
    });

    // perfect Holiday

    app.get("/perfectHoliday", async (req, res) => {
      const query = {};
      const result = await perfectHoliday.find(query).toArray();
      res.send(result);
    });

    app.get("/topVisitedArea", async (req, res) => {
      const query = {};
      const result = await topVisitedArea.find(query).toArray();
      res.send(result);
    });

    app.post("/setUser", async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // perfectHoliday dynamic id

    app.get("/perfectHoliday/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await perfectHoliday.findOne(query);
      res.send(result);
    });

    app.post("/bookingData", async (req, res) => {
      const user = req.body;
      const result = await bookingCollection.insertOne(user);
      res.send(result);
    });

    app.get("/bookingData", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query={_id: ObjectId(id)}
      const result=await bookingCollection.deleteOne(query)
      res.send(result)
    });
  } finally {
  }
}

passenger().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
