const WebSocket = require("ws");
const express = require("express");
const app = new express();
const multer = require("multer");
const path = require("path");

const NeDB = require("nedb");
// 创建nedb数据库实例
const db = new NeDB({
  filename: "./user.db",
  autoload: true,
});

db.remove({}, { multi: true }, function (err, result) {});

// db.insert(
//   {
//     name: "pmc",
//     age: 18,
//   },
//   (err, result) => {
//     console.log(result);
//   }
// );

// db.find(
//   {
//     name: "pmc",
//   },
//   (err, result) => {
//     console.log(result);
//   }
// );

// db.update(
//   {
//     name: "pmc",
//   },
//   {
//     $set: {
//       age: 2,
//     },
//   },
//   (err, result) => {
//     console.log(result);
//   }
// );

// 开启ws服务器
const wss = new WebSocket.Server({ port: 8088 }); // websocket的端口

//监听链接
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    if (message.toString() == "open") {
      console.log(12312);
      db.find({}, (err, res) => {
        ws.send(JSON.stringify(res));
      });
      return;
    }
    let data = JSON.parse(message);
    console.log(data);
    // 广播给所有用户
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const obj = {};
        obj.date = new Date();
        obj.msg = data.msg;
        obj.name = data.name;
        db.insert(obj, (err, res) => {});

        db.find({}, (err, res) => {
          client.send(JSON.stringify(res));
        });
      }
    });

    ws.on("error", (err) => {
      console.log(err);
    });

    // 断开连接
    ws.on("close", function () {
      console.log("close");
    });
  });
});

//1.  dest对应上传的文件的目录地址。
//2.  upload.single的值“logo”对应前端name中的“logo”。

multer({ dest: "./public/" });

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
  console.log(JSON.stringify(req.headers.origin));
  res.send(`http://192.168.102.58:3333/img/${filename}`);
});

// 显示静态文件
app.use("/img", express.static("public"));

app.listen(3333);
