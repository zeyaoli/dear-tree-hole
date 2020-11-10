const Bundler = require("parcel-bundler");
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const Path = require("path");
// const cors = require("cors");

const entryFiles = Path.join(__dirname, "./public/index.html");
const options = {};

const bundler = new Bundler(entryFiles, options); //create parcel bundler
app.use(bundler.middleware()); // let express use the bundler middleware

// app.use(cors());

const port = process.env.PORT || 1234; //init server port

const server = http
  .createServer(app)
  .listen(port, () => console.log(`Listening on port ${port}`)); //create http server with express

// --------------- end of server initialization ---------------
// --------------- start of websocket portion -----------------
const videoFileArr = []; // array to save file names
const io = socketIo(server); // webSockets work with the http server

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("video", (data) => {
    // let fileName = __dirname + "/videos/" + Date.now() + ".webm";
    // // console.log(fileName);
    // let processedName = `videos/${Date.now()}.webm`;
    // console.log(processedName);
    // videoFileArr.push(data);
    // socket.emit("videoFileArr", videoFileArr);
    // fs.writeFile(fileName, data, function (err) {
    //   if (err) console.log(err);
    //   console.log("It's saved!");
    //   videoFileArr.push(processedName);
    //   socket.emit("videoFileArr", videoFileArr);
    // });
  });
  // socket.on('dispose', ()=>{

  // })
});
