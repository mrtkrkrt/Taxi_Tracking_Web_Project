const express = require("express");
const app = express();
const User = require("./models/User");
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "nodemysql",
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected...");
});

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://admin:admin@muratkarakurt.9ergo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.send({ name: "Murat", surname: "karakurt" });
});

app.post("/login", (req, res) => {
  let user;
  let vehicleIdx = [];

  let promise = new Promise((resolve, reject) => {
    let sql = "SELECT * FROM users WHERE username='" + req.body.username + "'";
    let result = db.query(sql, (err, result) => {
      if (result.length > 0) {
        resolve("Success");
        user = result[0];
      } else reject("Boş Sonuç");
      if (err) reject("Mysql Hata!!!");
    });
  })
    .then((message) => {
      if (user.password === req.body.password) {
        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + "_" + time;
        console.log(dateTime);
        sql =
          "UPDATE users SET lastLogin='" +
          dateTime +
          "' WHERE username='" +
          req.body.username +
          "'";
        db.query(sql, (err, result) => {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });

        let promise2 = new Promise((resolve, reject) => {
          sql = "SELECT * FROM vehicles WHERE userId=" + user.id;
          db.query(sql, (err, result) => {
            if (result.length > 0) {
              result.map((vehicle) => {
                vehicleIdx.push(vehicle.vehicleId);
              });
              resolve("Success!!!");
            }else{
              reject("Boş Sonuç");
            }
            if(err) reject("Database Hata")
          });
        })
          .then((message) => {
            console.log(vehicleIdx);
            return res.json({
              status: "ok",
              user: JSON.stringify(user),
              idx: vehicleIdx,
            });
          })
          .catch((message) => {
            console.log(message);
            return res.json({ status: "error", user: false });
          });
      } else {
        return res.json({ status: "error", user: false });
      }
    })
    .catch((message) => {
      console.log(message);
      return res.json({ status: "error", user: false });
    });
});

app.post("/dashboard", (req, res) => {
  let coordResult_1, coordResult_2;
  let idx = req.body.vehicleIdx.split(",");
  console.log(idx);

  let promise = new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myFirstDatabase");
      dbo
        .collection("coordinates")
        .find({ id: idx[0] })
        .toArray(function (err, result) {
          if (err) reject("DATABASE ERROR!!!");
          else {
            coordResult_1 = result;
            resolve("Success");
          }
          db.close();
        });
    });
  })
    .then((message) => {
      let promise2 = new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("myFirstDatabase");
          dbo
            .collection("coordinates")
            .find({ id: idx[1] })
            .toArray(function (err, result) {
              if (err) reject("DATABASE ERROR!!!");
              else {
                coordResult_2 = result;
                resolve("Success");
              }
              db.close();
            });
        });
      })
        .then((message) => {
          return res.json({
            status: "ok",
            coords_1: JSON.stringify(coordResult_1),
            coords_2: JSON.stringify(coordResult_2),
          });
        })
        .catch((message) => {
          console.log(message);
          return res.json({
            status: "error",
            coords_1: false,
            coords_2: false,
          });
        });
    })
    .catch((message) => {
      return res.json({ status: "error", coords_1: false, coords_2: false });
    });
});

app.listen(3000, () => {
  console.log("Server started on 3000 port");
});
