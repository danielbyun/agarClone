// server.js is only for the making of socketio server and the express server
const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

const socketio = require("socket.io");
const expressServer = app.listen(8080);
const io = socketio(expressServer);

// middleware - gives solid protection
const helmet = require("helmet");

app.use(helmet());
console.log(`Express and socketio are listening to port 8080`);

// app organization
module.exports = {
  app,
  io,
};
