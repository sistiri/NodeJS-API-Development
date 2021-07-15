const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = 3000;

// Database connection
mongoose
  .connect('mongodb+srv://NodeAdminUser:MongoDBAtlasAdmin@cluster0.tgvgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info('MongoDB connection has been established successfully'))
  .catch(err => {
    logger.error(err);
    process.exit()
  });

app.use(morgan('combined', { stream: logger.stream }));

// app.use('/images', express.static('./images'));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use('/person', require('./controllers/person/routes'));

app.use((err, req, res, next) => {
  res.status(err.statusCode);
  res.json({
    hasError: true,
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
