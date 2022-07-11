import express from "express";
import { mapOrder } from "./utilities/sorts.js";

const app = express();

const hostname = "localhost";
const port = 8081; // should port > 3000 ( < 3000 : port system)

app.get("/", (req, res) => {
  res.end("<h1>Hello world</h1><hr/>");
});

app.listen(port, hostname, () => {
  console.log(`Hello running at host name:${hostname}:${port}/`);
});
