const express = require("express");
const path = require("path");
const books_router = require("./routes/books");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/books", books_router);
app.listen(3000, () => {
  console.log("server listening on port 3000");
});
