const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data.json");

const readBooksData = async () => {
  const data = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const writeBooksData = async (books) => {
  await fs.promises.writeFile(filePath, JSON.stringify(books, null, 2));
};

const getAllBooks = async (req, res) => {
  const books = await readBooksData();
  res.render("books", { data: books });
};

const createBookUI = async (req, res) => {
  res.render("createBook");
};

const getBookById = async (req, res) => {
  const bookId = req.params.id;
  const books = await readBooksData();

  const bookData = books.find((d) => d.id == bookId);
  if (!bookData) {
    return res.status(404).send("Book not found");
  }

  // Update book status to 'read'
  await updateBookByID(bookId, books);
  res.render("bookDetail", { data: bookData });
};

const createNewBook = async (req, res) => {
  const { title, description, author } = req.body;
  const books = await readBooksData();

  const newBook = {
    id: uuidv4(),
    title,
    description,
    author,
    status: "unread",
    date: new Date().toLocaleDateString("en-GB")
  };

  books.push(newBook);
  await writeBooksData(books);

  res.render("bookCreateSuccess", {
    message: "Congratulations!! Your book was successfully published!!",
  });
};

const updateBookByID = async (bookId, books) => {
  const bookIndex = books.findIndex(
    (book) => String(book.id) === String(bookId)
  );
  if (bookIndex !== -1) {
    books[bookIndex].status = "read";
    await writeBooksData(books);
  } else {
    console.log(`Book with ID ${bookId} not found.`);
  }
};

const filterBooks = async (req, res) => {
  const { show, title, author } = req.query;
  let books = await readBooksData();

  if (show) {
    books = books.filter((book) => book.status === show);
  }

  if (title) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (author) {
    books = books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  res.render("books", { data: books });
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;
  let books = await readBooksData();
  const updatedBooks = books.filter(
    (book) => String(book.id) !== String(bookId)
  );
  if (updatedBooks.length === books.length) {
    return res.render("delete", { message: "Book not found!!!" });
  }
  await writeBooksData(updatedBooks);
  res.render("delete", { message: "Your book was deleted successfully!!!" });
};

module.exports = {
  getAllBooks,
  createBookUI,
  getBookById,
  createNewBook,
  filterBooks,
  deleteBook,
};
