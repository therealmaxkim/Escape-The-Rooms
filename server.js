const express = require("express");
const cookieParser = require('cookie-parser');
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

//Show the main page
app.get('/', function(req, res) {
  const template = fs.readFileSync("templates/home.html", "utf8");
  res.send(template);
});

//Handles the form data from the main menu to initialize name and empty inventory
app.post('/', function(req, res) {
  res.cookie('name', req.body.name);
  res.cookie('inv', [" ", " ", " "]);
  const template = fs.readFileSync("templates/1.html", "utf8");
  let result = template.replace("%name%", req.body.name);
  result = result.replace("%item%", " ");
  result = result.replace("%item2%", " ");
  result = result.replace("%item3%", " ");
  res.send(result);
});

//Handles travelling to rooms 
app.get('/:id', function(req, res) {
  //Grab name and inventory from cookies
  var name = req.cookies.name;
  var inv = req.cookies.inv;

  //Check that the user went through the main menu at least once
  if (name === undefined || inv === undefined) {
    const template = fs.readFileSync("templates/error.html", "utf8");
    res.send(template);
  } else {

    //give items if the user stumbles on a specific endpoint 
    if (req.params.id === "2") {
      res.cookie('inv', ["Umbrella", inv[1], inv[2]]);
    } if (req.params.id === "5") {
      res.cookie('inv', [inv[0], "Water bottle", inv[2]]);
    } if (req.params.id === "14") {
      res.cookie('inv', [inv[0], inv[1], "Pencil"]);
    }

    //inject name and inventory into html
    const template = fs.readFileSync("templates/" + req.params.id + ".html", "utf8");
    let result = template.replace("%name%", name);
    result = result.replace("%item%", inv[0]);
    result = result.replace("%item2%", inv[1]);
    result = result.replace("%item3%", inv[2]);
    res.send(result);
  }
});

app.listen(3000, () => {
	console.log("Server is ready");
});
