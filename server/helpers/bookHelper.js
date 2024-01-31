const db = require("../services/database");

const getBookByAuthor = async (author) => {
  let response = {};
  const result = await db.getBookByAuthor(author);

  if (result.length === 0) {
    response = {
      ok: false,
      message: `Book with author "${author}" is Not Found`,
    };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving Book by author successfully",
    result,
  };
  return response;
};

const getAllBook = async (author) => {
  let response = {};
  const result = await db.getAllBook();

  if (author) {
    const resultQuery = await getBookByAuthor(author);
    return resultQuery;
  }

  if (result.length === 0) {
    response = { ok: false, message: "Book Data still Empty", result };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving All Book Data Successfully",
    result,
  };
  return response;
};

const getBookDetail = async (id) => {
  let response = {};
  const result = await db.getBookDetail(id);
  if (result.length === 0) {
    response = { ok: false, message: "Book Not Found" };
    return response;
  }

  response = {
    ok: true,
    message: "Retrieving Book Data Successfully",
    result,
  };
  return response;
};

const createBook = async (bookData) => {
  let isNameUsed = await getAllBook();

  isNameUsed = isNameUsed.result?.find(
    (prop) => prop.bookName === bookData.name
  );

  let response = {};

  console.log(isNameUsed, "<<<");

  if (isNameUsed) {
    response = { ok: false, message: "Book's Name is Already Used" };
    return response;
  }

  const result = await db.addBook(bookData);

  if (!result) {
    response = { ok: false, message: "Create Book is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "New Book Successfully Created!",
    result: bookData,
  };

  return response;
};

const updateBook = async (id, bookData) => {
  const { name } = bookData;

  const book = await getAllBook();

  let response = {};

  const isIdFound = book.result?.find((prop) => prop.idBook === Number(id));

  if (!isIdFound) {
    response = { ok: false, message: "Book Not Found" };
    return response;
  }

  if (name) {
    const isNameUsed = book.result?.find((prop) => prop.name === bookData.name);

    if (isNameUsed) {
      response = { ok: false, message: "Book's name is Already Used" };
      return response;
    }
  }

  const result = await db.editBook(id, bookData);

  if (!result) {
    response = { ok: false, message: "Update Book is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "Book's Data Successfully Updated!",
    result: bookData,
  };

  return response;
};

const deleteBook = async (id) => {
  let response = {};
  const book = await getAllBook();
  const isIdFound = book.result?.find((prop) => prop.idBook === Number(id));

  const bookInformation = book.result?.filter(
    (prop) => prop.idBook === Number(id)
  );

  if (!isIdFound) {
    response = { ok: false, message: "Book Not Found" };
    return response;
  }

  const result = await db.removeBook(id);

  if (!result) {
    response = { ok: false, message: "Delete book is Failed" };
    return response;
  }

  response = {
    ok: true,
    message: "Book's Data Successfully Deleted!",
    result: bookInformation,
  };

  return response;
};

module.exports = {
  getAllBook,
  createBook,
  getBookDetail,
  updateBook,
  deleteBook,
};
