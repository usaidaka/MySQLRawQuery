const mysql = require("promise-mysql2");
require("dotenv").config();

console.log(process.env.DB_HOST);

async function fetchDataFromTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const results = await connection.query("SELECT * FROM your_table_name");
    console.log(results);

    await connection.end();
  } catch (error) {
    console.error("Error: ", error.message);
  }
}

fetchDataFromTable();
