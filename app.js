// const WebSocket = require("ws");
// const express = require("express");
// const app = new express();

// const wss = new WebSocket.Server({ port: 8088 }); // websocket的端口

// wss.on("connection", function connection(ws) {
//   ws.send("ws");
//   ws.on("message", function incoming(message) {
//     console.log(message.toString());
//     // 广播给所有用户
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         const obj = {};
//         obj.date = new Date();
//         obj.msg = message.toString();
//         client.send(JSON.stringify(obj));
//       }
//     });
//   });
// });

var ws = require("nodejs-websocket");
var port = 8088;
//createServer
var server = ws
  .createServer(function (conn) {
    conn.on("text", function (str) {
      console.log("received " + str);
      //send msg
      conn.sendText(str);
    });

    conn.on("close", function (code, reason) {
      console.log("Connection closed");
    });

    conn.on("error", function (err) {
      console.log("handdle error");
      console.log(err);
    });
  })
  .listen(port);
console.log("websocket server listening on port " + port);
