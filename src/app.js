const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const morganMiddleware = require('./middleware/morgan.middleware');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);

app.use('/api', apiRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;
