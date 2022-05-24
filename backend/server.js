const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const dbName = "partyTime";
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (request, response) {
  response.json({ message: "Rota teste." });
});

app.listen(port, function () {
  console.log(`O back-end está rodando na porta ${port}.`);
});
