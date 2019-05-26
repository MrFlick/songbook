const express = require('express');
const Sequelize = require('sequelize');
const fs = require('fs');

const app = express();
const port = 3030;


app.engine('html', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    return callback(null, content.toString());
  });
});

app.set('views', './server/views');
app.set('view engine', 'html');

const sequelize = new Sequelize('sqlite:db/data.sqlite3', {
  define: {
    timestamps: false,
  },
});

app.use('/s', express.static('./static'));
app.use('/v', express.static('./vue-build'));

const api = require('./routes/api')(sequelize);
const user = require('./routes/user');

app.use('/api', api);
app.use('/', user);

app.use('*', (req, res) => res.status(404).send('File Not Found'));

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Songbook app listening on port ${port}!`));
});
