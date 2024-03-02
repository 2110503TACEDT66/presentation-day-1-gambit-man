const express = require('express');
const app = express();
const dotenv = require('dotenv');
const providers = require('./routes/providers.js');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings.js');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');

connectDB();

const server = app.listen(
  PORT,
  console.log('Sever runnig in', process.env.NODE_ENV, ' mode on port ', PORT)
);

//Handle unhandled promise rejection
process.on('unhandledRejection',(err,promise)=>{
  console.log(`Error: ${err.message}`);
  server.close(()=>process.exit(1));
});


app.use('/api/v1/providers',providers);
app.use('/api/v1/auth',auth);
app.use('/api/v1/bookings',bookings);



