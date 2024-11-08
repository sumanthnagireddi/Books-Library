const app = require("express");
const {
  getAllBooks,
  createBookUI,
  getBookById,
  filterBooks,
  createNewBook,
  deleteBook,
} = require("../controller/books_controller");

const books_router = app.Router();
books_router.route("/").get(getAllBooks);
books_router.route("/create").get(createBookUI);
books_router.route("/detail/:id").get(getBookById);
books_router.post("/createBook", createNewBook);
books_router.get("/filter", filterBooks);
books_router.get("/delete/:id", deleteBook);
module.exports = books_router;
