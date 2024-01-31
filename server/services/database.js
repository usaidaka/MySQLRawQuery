const _ = require("lodash");
const MySQL = require("promise-mysql2");
require("dotenv").config();

const fileName = "server/services/database.js";
const CUSTOMER_TABLE = "customer";
const BOOK_TABLE = "book";
const LENDING_TABLE = "booklending";

const ConnectionPool = MySQL.createPool({
  host: process.env.MYSQL_CONFIG_HOST || "localhost",
  user: process.env.MYSQL_CONFIG_USER || "root",
  password: process.env.MYSQL_CONFIG_PASSWORD || "",
  database: process.env.MYSQL_CONFIG_DATABASE || "dummy_db",
  port: process.env.MYSQL_CONFIG_PORT || "3306",
  connectionLimit: process.env.MYSQL_CONFIG_CONNECTION_LIMIT || "1",
});

/*
 * PRIVATE FUNCTION
 */
const __constructQueryResult = (query) => {
  const result = [];
  if (!_.isEmpty(query[0])) {
    query[0].forEach((item) => {
      const key = Object.keys(item);

      // Reconstruct query result
      const object = {};
      key.forEach((data) => {
        object[data] = item[data];
      });

      result.push(object);
    });
  }

  return result;
};

/*
 * PUBLIC FUNCTION
 */

/*
 * CUSTOMER TABLE
 */
const getAllCustomer = async () => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${CUSTOMER_TABLE} WHERE deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get All Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get All Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const getCustomerByName = async (name) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${CUSTOMER_TABLE} WHERE name LIKE '%${name}%' AND deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get Customer By Name", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get Customer By Name", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const getCustomerDetail = async (id) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${CUSTOMER_TABLE} WHERE idCustomer=${id} AND deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get Customer Detail", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get Customer Detail", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const addCustomer = async (customerData) => {
  const { name, phone, address } = customerData;

  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${CUSTOMER_TABLE} (name, phone, address) VALUES ('${name}', '${phone}', '${address}');`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Add Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Add Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

const editCustomer = async (id, customerData) => {
  const { name, phone, address } = customerData;

  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    if (name) {
      await poolConnection.query(
        `UPDATE customer SET name = '${name}' WHERE idCustomer=${id} AND deleted_at IS NULL;`
      );
    }

    if (phone) {
      await poolConnection.query(
        `UPDATE customer SET  phone= '${phone}' WHERE idCustomer=${id} AND deleted_at IS NULL;`
      );
    }

    if (address) {
      await poolConnection.query(
        `UPDATE customer SET  address = '${address}' WHERE idCustomer=${id} AND deleted_at IS NULL;`
      );
    }

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Edit Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Edit Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

const removeCustomer = async (id) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `UPDATE customer SET deleted_at = current_timestamp() WHERE idCustomer=${id} AND deleted_at IS NULL;`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Remove Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Remove Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

/*
 * BOOK TABLE
 */

const getAllBook = async () => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();

    const query = await poolConnection.query(
      `SELECT book.idBook as "idBook", book.name as "bookName", book.author, book.idCategory, category.name as "categoryName" FROM ${BOOK_TABLE} JOIN category ON book.idCategory = category.idCategory WHERE book.deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get All Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get All Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const getBookByAuthor = async (author) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${BOOK_TABLE} WHERE author LIKE '%${author}%' AND deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get Customer By Name", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get Customer By Name", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const addBook = async (bookData) => {
  const { name, author, idCategory } = bookData;

  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${BOOK_TABLE} (name, author, idCategory) VALUES ('${name}', '${author}', '${idCategory}');`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Add Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Add Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

const getBookDetail = async (id) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT book.idBook as "idBook", book.name as "bookName", book.author, book.idCategory, category.name as "categoryName" FROM ${BOOK_TABLE} JOIN category ON book.idCategory = category.idCategory WHERE book.idBook=${id} AND book.deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get Customer Detail", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get Customer Detail", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const editBook = async (id, bookData) => {
  const { name, author, idCategory } = bookData;

  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    if (name) {
      await poolConnection.query(
        `UPDATE book SET name = '${name}' WHERE idBook=${id} AND deleted_at IS NULL;`
      );
    }

    if (author) {
      await poolConnection.query(
        `UPDATE book SET  author= '${author}' WHERE idBook=${id} AND deleted_at IS NULL;`
      );
    }

    if (idCategory) {
      await poolConnection.query(
        `UPDATE book SET  idCategory = '${idCategory}' WHERE idBook=${id} AND deleted_at IS NULL;`
      );
    }

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Edit Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Edit Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

const removeBook = async (id) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `UPDATE book SET deleted_at = current_timestamp() WHERE idBook=${id} AND deleted_at IS NULL;`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Remove Book", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Remove Book", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

/*
 * LENDING BOOK TABLE
 */

const getAllLending = async () => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();

    const query = await poolConnection.query(
      `SELECT customer.name as "customerName", customer.address, customer.phone, book.name as "bookName", book.idCategory as "idCategoryBook", category.name as "bookCategory" FROM ${LENDING_TABLE} JOIN customer ON booklending.idCustomer = customer.idCustomer JOIN book ON booklending.idBook = book.idBook JOIN category ON book.idCategory = category.idCategory WHERE booklending.deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get All Lending", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get All Lending", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

const createLending = async ({ idCustomer, idBook }) => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${LENDING_TABLE} (idCustomer, idBook) VALUES ('${idCustomer}', '${idBook}');`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Add Customer", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, "Add Customer", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve(false);
  }
};

const getLendingBookListCustomer = async (id) => {
  console.log(id, "<<< ID FROM DB");
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();

    const query = await poolConnection.query(
      `SELECT * FROM ${LENDING_TABLE} WHERE deleted_at IS NULL;`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, "Get All Lending", "INFO"], {
      message: { timeTaken },
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, "Get All Lending", "ERROR"], {
      message: { info: `${err}` },
    });
    return Promise.resolve([]);
  }
};

module.exports = {
  getAllCustomer,
  getCustomerByName,
  addCustomer,
  getCustomerDetail,
  editCustomer,
  removeCustomer,
  getAllBook,
  addBook,
  getBookByAuthor,
  getBookDetail,
  editBook,
  removeBook,
  getAllLending,
  createLending,
  getLendingBookListCustomer,
};
