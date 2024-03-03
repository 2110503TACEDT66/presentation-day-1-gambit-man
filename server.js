const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const app = express();

const providers = require('./routes/providers.js');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings.js');
const images = require('./routes/images.js');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db.js');

const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 100,
});

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

const server = app.listen(
  PORT,
  console.log('Sever runnig in', process.env.NODE_ENV, ' mode on port ', PORT)
);

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

app.use('/api/v1/providers', providers);
app.use('/api/v1/auth', auth);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/images', images);
