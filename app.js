const WebSocket = require("ws");
const express = require("express");
const app = new express();

const wss = new WebSocket.Server({ port: 8088 }); // websocket的端口

wss.on("connection", function connection(ws) {
  ws.send("ws");
  ws.on("message", function incoming(message) {
    console.log(message.toString());
    // 广播给所有用户
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const obj = {};
        obj.date = new Date();
        obj.msg = message.toString();
        client.send(JSON.stringify(obj));
      }
    });
  });
});
