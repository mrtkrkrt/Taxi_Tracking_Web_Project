const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const User = require("./models/User");
const bcrypt = require("bcrypt");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://admin:admin@muratkarakurt.9ergo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.send({ name: "Murat", surname: "karakurt" });
});

app.post("/login", (req, res) => {
  let user;

  let promise = new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;
      var dbo = db.db("myFirstDatabase");
      dbo
        .collection("user-data")
        .findOne({ username: req.body.username }, function (err, result) {
          if (err) reject("Database Hatası");
          else resolve("Kullancıı Bulundu");
          user = result;
          console.log(user);
          db.close();
        });
    });
  });
  promise
    .then(async (message) => {
      console.log(message);
      if (!user.username) {
        return { status: "error", error: "Invalid login" };
      }

      if (req.body.password === user.password) {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("myFirstDatabase");
          var myquery = { username: user.username, password: user.password };
          var newvalues = { $set: { lastLogin: new Date() } };
          dbo
            .collection("user-data")
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });
        });
        return res.json({ status: "ok", user: JSON.stringify(user) });
      } else {
        return res.json({ status: "error", user: false });
      }
    })
    .catch(async (message) => {
      console.log(message);
    });
});

app.post("/dashboard", (req, res) => {
  let coordResult;

  let promise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myFirstDatabase");
      dbo
        .collection("coordinates")
        .find({ id: req.body.userId })
        .toArray(function (err, result) {
          if (err) reject("DATABASE ERROR!!!");
          coordResult = result
          resolve("Success");
          db.close();
        });
    });
  }).then((message) => {
    return res.json({ status: "ok", coords: JSON.stringify(coordResult) });
  }).catch((message) => {
    return res.json({ status: "error", coords: false });
  })
});

app.listen(3000, () => {
  console.log("Server started on 3000 port");
});
