// get the client
const mysql = require('mysql2/promise');

// create the connection to database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basic_blog_app_nodejs_express_ejs_mysql',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
