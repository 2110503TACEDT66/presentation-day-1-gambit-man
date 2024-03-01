const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');

connectDB();

// test 1234

const server = app.listen(
  PORT,
  console.log('Sever runnig in', process.env.NODE_ENV, ' mode on port ', PORT)
);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, data: { id: 1 } });
});
