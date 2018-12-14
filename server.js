// Imports express into our app and sets it up for use
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
var bodyParser = require("body-parser");


const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// const routes = require('./routes/api-routes.js');

// Defines a PORT for the server to listen for requests
const PORT = process.env.PORT || 3000;

// Requiring our models for syncing
const db = require("./models");

// Sets up our server to parse our request body for usage
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sets our server to use the public directory for static assets
app.use(express.static('public'));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, "./public/new-index.html"));
  });

require('./routes/new-api-routes.js')(app);
require('./sockets/task-sockets.js')(io);


mongoose.Promise = global.Promise;


//
//SET UP DATABASE
//
// mongoose.connect(
//     process.env.MONGODB_URI || "mongodb://user:todoapp1@ds037698.mlab.com:37698/heroku_2883pr2c", 
//     {
//         useNewUrlParser: true
//     }
// );

// Starts our server on the predefined PORT
db.sequelize.sync().then(function() {
    server.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
});