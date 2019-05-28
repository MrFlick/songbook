const express = require('express');
const modelSource = require('../models');

const router = express.Router();

function getRouter(sequelize) {
  const models = modelSource(sequelize);

  function coalescecols(...args) {
    const cols = args.map(x => sequelize.col(x));
    return sequelize.fn('COALESCE', ...cols);
  }

  router.use(express.json());

  router.get('/', (req, res) => {
    res.send('hello');
  });

  router.get('/albums', (req, res) => {
    models.Album.findAll({
      order: [coalescecols('sortName', 'name')],
    }).then((albums) => {
      res.json(albums);
    });
  });

  router.get('/album/:aid', (req, res) => {
    models.Album.findByPk(req.params.aid, {
      include: [{
        model: models.Track,
        order: ['discNumber', 'trackNumber'],
        include: [models.Person, models.Tag],
      }, models.Tag, models.Person],
    }).then((album) => {
      res.json(album);
    });
  });

  router.post('/album/:aid/tags', (req, res) => {
    const newList = req.body.new;
    const addList = req.body.add;
    sequelize.transaction().then((t) => {
      models.Album.findByPk(req.params.aid, { transaction: t }).then((album) => {
        Promise.resolve().then(() => {
          if (newList) {
            return Promise.all(
              newList.map(x => models.Tag.create(x, { transaction: t })),
            );
          }
          return [];
        }).then((news) => {
          if (addList) {
            return Promise.all(
              addList.map(x => models.Tag.findByPk(x.id, { transaction: t })),
            ).then(adds => news.concat(adds));
          }
          return news;
        }).then((tags) => {
          if (tags) {
            return album.addTags(tags, { transaction: t });
          }
          return [];
        })
          .then(() => album.getTags({ transaction: t }))
          .then((x) => { res.json(x); t.commit(); });
      });
    });
  });

  router.get('/people', (req, res) => {
    models.Person.findAll().then((albums) => {
      res.json(albums);
    });
  });

  router.get('/person/:pid/tracks', (req, res) => {
    models.Album.findAll({
      where: { '$tracks->people->trackPerson.personId$': req.params.pid },
      include: { model: models.Track, include: models.Person },
    }).then((albums) => {
      res.json(albums);
    });
  });

  router.get('/tags/', (req, res) => {
    models.Tag.findAll().then((albums) => {
      res.json(albums);
    });
  });

  router.get('*', () => {
    throw new Error('Unrecognized API Endpoint');
  });

  // API Error Handler
  // eslint-disable-next-line consistent-return
  router.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({ message: err.message });
  });

  return router;
}

module.exports = getRouter;
