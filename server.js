const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const cors = require("cors");

const onlineClients = new Set();
let sendingInterval;

const trackernity = require("./app/controllers/trackernity.socket.controller.js");

var corsOptions = {
    origin:"*" 
};

const io = require('socket.io')(server,{cors: corsOptions,allowEIO3:true});

app.use(cors(corsOptions));

//parse req of content-type - application/json
app.use(express.json());

//parse req of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// app.use(express.static(__dirname + '/public/web'));

app.use((req, res, next) => { // router middleware
    //res.header("Access-Control-Allow-Origin", ORIGIN || "*");
    req.io = io;
    next();
});

// app.get("/",(req,res) => {
//     //res.json({message: "Hello world"});
//     res.sendFile("index.html");
// });

require("./app/routes/trackernity.routes.js")(app);

// const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    // trackernity.socketGetAlproFilteredByRemarks();
    // socket.emit("check_connection","<b>Connected");
    // socket.emit("user_connected","user5");
    // socket.emit("location_data","why tho");
    socket.on("user_status",(status)=> console.log(status));
})

io.engine.on("connection_error",(err) => {
    // console.log(err.req);
    // console.log(err.code);
    console.log(err.message);
    // console.log(err.context);
})

server.listen(3000,() =>{
    console.log('Server is Running');
});



////other function

//websocket callback function
// function onNewWebsocketConnection(socket) {
//     console.info(`Socket ${socket.id} has connected`);
//     onlineClients.add(socket.id);

//     socket.on("disconnect", () =>{
//         onlineClients.delete(socket.id);
//         console.info(`Socket ${socket.id} has connected`);
//     });

//      // echoes on the terminal every "back_to_server" message this socket sends
//   // will send a message only to this socket (different than using `io.emit()`, which would broadcast it)
//   socket.on("/back_to_server", msg => console.info(`Socket ${socket.id} says: "${msg}"`));
  
//   socket.on("/insert_location", location_data => {
//     console.log(`Locations Data: ${location_data}`)
//     trackernity.socketInsertLocation(location_data);
//     clearInterval(sendingInterval);
//   });

//   socket.on("/stop_sending_location", (lastLocation) => {
//     console.log("Stop Sending Locations")
//     console.log(`Last Locations: ${lastLocation}`);
//     clearInterval(sendingInterval);
//   });

  
//   sendingInterval = setInterval(() => {
//       emittingData(socket,trackernity.user_id);
//   },10000);

// }

// function emittingData(socket,param){
//     let locationData = trackernity.socketGetAll(param);
//     socket.emit("/send_location",locationData);
// }

 // will fire for every new websocket connection
// io.on("connection", onNewWebsocketConnection);
