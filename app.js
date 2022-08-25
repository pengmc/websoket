const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 80 }); // websocket的端口

wss.on("connection", function connection(ws) {
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
