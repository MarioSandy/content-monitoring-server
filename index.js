const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOption = require("./config/corsOption");
const docsUpdate = require("./controller/docs/docsUpdate");
const docsById = require("./controller/docs/docsById");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const docsIo = require("socket.io")(5001, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET, POST"],
  },
});

const videoIo = require("socket.io")(5002, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET, POST"],
  },
});

docsIo.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const data = await docsById({
      doc_id: documentId,
      user_id: 1,
    });
    socket.join(documentId);
    socket.emit("load-document", data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
    socket.on("send-title-changes", (title) => {
      socket.broadcast.to(documentId).emit("receive-title-changes", title);
      docsUpdate({
        doc_id: documentId,
        user_id: 1,
        title,
      });
    });
    socket.on("save-document", (documentDatas) => {
      docsUpdate(documentDatas);
    });
  });

  console.log("connected");
});

videoIo.on("connection", (socket) => {
  console.log("connected");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
