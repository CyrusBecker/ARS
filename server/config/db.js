require('dotenv').config();
const sql = require("mssql");

let sqlConfig;

if (process.env.DB_TRUSTED_CONNECTION === 'true') {
  // Windows Authentication (NTLM)
  sqlConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      trustServerCertificate: true,
    },
    authentication: {
      type: 'ntlm',
      options: {
        domain: process.env.DB_DOMAIN || '', // optional
        userName: process.env.USERNAME,      // Windows env var
        password: process.env.PASSWORD || '',// optional if using logged-in user
      },
    },
  };
} else {
  // SQL Authentication
  sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
}

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => console.error("❌ DB Connection Failed:", err));

module.exports = {
  sql,
  poolPromise,
};
