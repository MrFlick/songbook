const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 3030;

app.set('views', './server/views');
app.set('view engine', 'pug');

const sequelize = new Sequelize('sqlite:db/data.sqlite3', {
  define: {
    timestamps: false,
  },
});

app.use('/s', express.static('./static'));

const api = require('./routes/api')(sequelize);

app.use('/api', api);
app.use('*', (req, res) => res.send('Hello'));

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Songbook app listening on port ${port}!`));
});
