const express = require('express');
const app = express();
const dotenv = require('dotenv');
const providers = require('./routes/providers.js');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings.js');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

connectDB();

app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

app.use(cookieParser());

const server = app.listen(
  PORT,
  console.log('Sever runnig in', process.env.NODE_ENV, ' mode on port ', PORT)
  );
  
  const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
  });
  
  app.use(limiter);

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

app.use('/api/v1/providers', providers);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);
