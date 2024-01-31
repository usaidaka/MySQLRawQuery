const db = require("../services/database");
const { getAllBook } = require("./bookHelper");
const { getAllCustomer } = require("./customerHelper");

const getAllLending = async () => {
  let response = {};
  const result = await db.getAllLending();

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

const addLanding = async (lendingData) => {
  let response = {};
  const { customerName, bookName } = lendingData;

  // filter customer's name to get customer id
  let customers = await getAllCustomer();
  customers = customers.result?.find(
    (customer) => customer.name === customerName
  );

  if (!customers) {
    response = { ok: false, message: "Customer Not Found" };
    return response;
  }

  // filter book's name to get book id
  let books = await getAllBook();
  books = books.result?.find((book) => book.bookName === bookName);

  if (!books) {
    response = { ok: false, message: "Book Not Found" };
    return response;
  }

  // check, is the book already booked

  const { idCustomer } = customers;
  const { idBook } = books;

  let isBooked = await getAllLending();

  isBooked = isBooked.result?.filter(
    (prop) => prop.idCustomer === idCustomer && prop.idBook === idBook
  );

  if (isBooked) {
    response = { ok: false, message: "The Book has been lent by the Customer" };
    return response;
  }

  const result = await db.createLending({ idCustomer, idBook });

  if (!result) {
    response = { ok: false, message: "Lending Book is Failed" };
    return response;
  }
  response = {
    ok: true,
    message: "Congratulation! Lending Book is Successful",
    result: { customers, books },
  };

  return response;
};

const getAllLendingListCustomer = async (id) => {
  let response = {};
  console.log(id);
  let customer = await getAllCustomer();
  customer = customer.result?.some((prop) => prop.idCustomer === Number(id));

  if (!customer) {
    response = { ok: false, message: "Customer Not Found" };
    return response;
  }

  const result = await db.getLendingBookListCustomer(id);

  if (result.length === 0) {
    response = { ok: false, message: "This Customer never lending any books" };
    return response;
  }

  console.log(result);
  response = {
    ok: true,
    message: "Retrieving Customer's Lending Successful",
    result,
  };

  return response;
};

module.exports = {
  getAllLending,
  addLanding,
  getAllLendingListCustomer,
};
