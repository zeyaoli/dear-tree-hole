const Bundler = require("parcel-bundler");
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const entryFiles = ["./index.html", "./src/index.js"];
const options = {};

const bundler = new Bundler(entryFiles, options); //create parcel bundler
app.use(bundler.middleware()); // let express use the bundler middleware

const port = process.env.PORT || 1234; //init server port

const server = http
  .createServer(app)
  .listen(port, () => console.log(`Listening on port ${port}`)); //create http server with express

// --------------- end of server initialization ---------------
// --------------- start of websocket portion -----------------

const io = socketIo(server); // websockets work wtih the http server

io.on("connection", (socket) => {
  console.log("New client connected");
});

// const videoBlobs = [];
// array to save blob
