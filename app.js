const express = require('express');
const sequelize = require('./src/database/database');
const routes = require('./src/routes/router');
const insertDefaultData = require('./src/middleware/insertDefaultData');
const cors = require('cors');
const logger = require('./src/middleware/logger');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/public', express.static('public'));

app.use('/api', routes);

sequelize.sync(force = true)
  .then(() => {
    console.log('Banco de dados sincronizado');
    return insertDefaultData();
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((error) => {
    logger.error('Erro sync db: ' + error.message);
    console.error('Erro ao sincronizar o banco de dados:', error);
  });
