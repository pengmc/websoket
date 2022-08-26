const WebSocket = require("ws");
const express = require("express");
const app = new express();
const multer = require("multer");
const path = require("path");
const { log } = require("console");
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
//1.  dest对应上传的文件的目录地址。
//2.  upload.single的值“logo”对应前端name中的“logo”。

// const upload = multer({ dest: "./public/" });

let filename = "";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/");
    },
    filename: function (req, file, cb) {
      // fieldname是表单的name值，也就是我们设定的“file”，
      // originalname是文件上传时的名字，可以根据它获取后缀，
      // encoding，mimetype 我就不详细介绍了，可以自行输出查看。
      const { fieldname, originalname, encoding, mimetype } = file;
      filename =
        originalname.split(".")[0] +
        new Date().getTime() +
        "." +
        originalname.split(".")[1];
      cb(null, filename);
    },
  }),
});

// 这里使用连续中间件，upload.single('img')表示解析单个文件夹，且key值为 ‘img’,
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.headers.host);
  res.send(`http://${req.headers.host}/img/${filename}`);
});

// 显示静态文件
app.use("/img", express.static("public"));

app.listen(3333);
