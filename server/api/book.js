const Router = require("express").Router();

const BookHelper = require("../helpers/bookHelper");
const Validation = require("../helpers/validationHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/book.js";

const bookList = async (request, reply) => {
  try {
    const { author } = request.query;

    const response = await BookHelper.getAllBook(author);

    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(200).json(response);
  } catch (err) {
    console.log([fileName, "bookList", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const bookDetail = async (request, reply) => {
  try {
    const { id } = request.params;

    const response = await BookHelper.getBookDetail(id);
    if (!response.ok) {
      return reply.status(404).json(response);
    }

    return reply.status(200).json(response);
  } catch (err) {
    console.log([fileName, "bookDetail", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const createBook = async (request, reply) => {
  try {
    const bookData = request.body;

    Validation.createBook(bookData);

    const response = await BookHelper.createBook(bookData);

    if (!response.ok) {
      return reply.status(400).json(response);
    }

    return reply.status(201).json(response);
  } catch (err) {
    console.log([fileName, "createBook", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const editBook = async (request, reply) => {
  try {
    const bookData = request.body;
    const { id } = request.params;

    Validation.updateBook(bookData);

    const response = await BookHelper.updateBook(id, bookData);

    return reply.status(202).json(response);
  } catch (err) {
    console.log([fileName, "editBook", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

const removeBook = async (request, reply) => {
  try {
    const { id } = request.params;

    const response = await BookHelper.deleteBook(id);

    return reply.status(202).json(response);
  } catch (err) {
    console.log([fileName, "removeBook", "ERROR"], { info: `${err}` });
    return reply.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/book", bookList);
Router.get("/book/:id", bookDetail);
Router.post("/book", createBook);
Router.patch("/book/:id", editBook);
Router.delete("/book/:id", removeBook);

module.exports = Router;
