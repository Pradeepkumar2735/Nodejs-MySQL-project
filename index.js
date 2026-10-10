const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
//const port = 8090;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded ({extends: true}));
app.set("view enging", "ejs");
app.set("views",path.join(__dirname,"views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    database:'delta_app',
    password:'Pradeep@2007'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

//let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [
//     ["1234", "1234_niki", "niki4@gmail.com", "nik4@123"],
//     ["1235", "1235_niki", "niki5@gmail.com", "nik5@123"],
//     ["1236", "1236_niki", "niki6@gmail.com", "nik6@123"],
// ];
// let data = [];
// for(let i = 1; i<=100; i++){
//     data.push(getRandomUser());
// }


// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// }
// catch(err){
//      console.log(err);
// }

// connection.end();

app.get("/",( req,res ) => {
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q,(err,result) => {
            if(err) throw err;
            let count = (result[0]["count(*)"]);
            res.render("home.ejs",{ count } );
        });
    }catch (err) {
        console.log(err);
        res.send("same error in databads");
    }
});

app.get("/user",(req,res) => {
    let q = `SELECT * FROM user`;
    try{
        connection.query(q,(err,users) =>{
            if (err) throw err;
            res.render("showuser.ejs",{ users });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.get("/user/:id/edit", ( req, res ) =>{
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}' `;

    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs",{ user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

app.patch("/user/:id",(req,res) =>{
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}' `;
    let { password: formPass, username: newUsername } = req.body;
    
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("Wrong Password");
            } else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;

                connection.query(q2,(err,result) =>{
                    if (err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});
app.get("/user/add",(req,res) =>{
    res.render("add.ejs");
});

app.post("/user/add", (req, res) => {
  let { id, username, email, password } = req.body;

  let q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;

  connection.query(q,[id, username, email, password],(err, result) => {
      if (err) {
        console.log(err);
        return res.send("Some error in DB");
      }

      res.redirect("/user");
    }
  );
});


app.delete("/user/:id", (req, res) => {
  let { id } = req.params;

  let q = `DELETE FROM user WHERE id = ?`;

  connection.query(q, id, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in DB");
    }

    res.redirect("/user");
  });
});


app.listen("8090", () => {
   console.log("server is listening to port 8090 ");
});


//console.log( getRandomUser() );
