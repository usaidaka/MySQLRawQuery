const _ = require('lodash');
const MySQL = require('promise-mysql2');

const fileName = 'server/services/database.js';
const TABLE = 'dummy_table';

const ConnectionPool = MySQL.createPool({
  host: process.env.MYSQL_CONFIG_HOST || 'localhost',
  user: process.env.MYSQL_CONFIG_USER || 'root',
  password: process.env.MYSQL_CONFIG_PASSWORD || '',
  database: process.env.MYSQL_CONFIG_DATABASE || 'dummy_db',
  port: process.env.MYSQL_CONFIG_PORT || '3306',
  connectionLimit: process.env.MYSQL_CONFIG_CONNECTION_LIMIT || '1'
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

const getAllData = async () => {
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${TABLE};`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, 'Get All Data', 'INFO'], {
      message: { timeTaken }
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, 'Get All Data', 'ERROR'], {
      message: { info: `${err}` }
    });
    return Promise.resolve([]);
  }
};

const getDataByName = async (dataObject) => {
  const { name } = dataObject;

  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${TABLE} WHERE name LIKE '%${name}%';`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, 'Get Data By Name', 'INFO'], {
      message: { timeTaken }
    });

    return Promise.resolve(result);
  } catch (err) {
    console.log([fileName, 'Get Data By Name', 'ERROR'], {
      message: { info: `${err}` }
    });
    return Promise.resolve([]);
  }
};

const addData = async (dataObject) => {
  const { name, url } = dataObject;
  
  try {
    const timeStart = process.hrtime();
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${TABLE} (name, url) VALUES ('${name}', '${url}');`
    );

    await poolConnection.connection.release();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

    console.log([fileName, 'Add Data', 'INFO'], {
      message: { timeTaken }
    });

    return Promise.resolve(true);
  } catch (err) {
    console.log([fileName, 'Add Data', 'ERROR'], {
      message: { info: `${err}` }
    });
    return Promise.resolve(false);
  }
};

module.exports = {
  getAllData,
  getDataByName,
  addData
};
