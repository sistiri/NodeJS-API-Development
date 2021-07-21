const express = require('express');
const config = require('config');
const logger = require('./config/logger');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const swaggerDocument = YAML.load('docs/swagger.yaml');

const { username, password, host } = config.get('database');
mongoose
  .connect(`mongodb+srv://${username}:${password}@${host}`, {
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
app.use('/person', require('./controllers/person/person.routes'));
app.use('/post', require('./controllers/post/post.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(err.statusCode);
  res.json({
    hasError: true,
    message: err.message
  });
});


module.exports = app;