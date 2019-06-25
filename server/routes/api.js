const express = require('express');
const { Op } = require('sequelize');
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
        include: [models.Person, models.Tag],
      }, models.Tag, models.Person],
      order: [[models.Track, 'discNumber'], [models.Track, 'trackNumber']],
    }).then((album) => {
      res.json(album);
    });
  });

  router.get('/track/:tid', (req, res) => {
    models.Track.findByPk(req.params.tid, {
      include: [
        models.Album,
        models.Person,
        models.Tag,
        models.Lyric,
      ],
    }).then((track) => {
      res.json(track);
    });
  });

  router.post('/track/:tid/lyric', (req, res) => {
    const newLyric = req.body;
    sequelize.transaction().then((t) => {
      models.Track.findByPk(req.params.tid, { transaction: t }).then((track) => {
        models.Lyric.findOne({ where: { trackId: track.id }, transaction: t })
          .then((lyric) => {
            if (lyric) {
              return lyric.update(newLyric, { transaction: t });
            }
            return models.Lyric.create(newLyric, { transaction: t });
          })
          .then((lyric) => {
            return track.setLyric(lyric, { transaction: t })
              .then(() => lyric);
          })
          .then((x) => { res.json(x); t.commit(); })
          .catch((err) => { res.status(500).send(err); t.rollback(); });
      });
    });
  });

  function addRemoveTags(item, t, newList, addList, delList) {
    // item should be Album or Track instance
    return Promise.resolve()
      .then(() => {
        if (newList) {
          return Promise.all(
            newList.map(x => models.Tag.create(x, { transaction: t })),
          );
        }
        return [];
      })
      .then((news) => {
        if (addList) {
          return Promise.all(
            addList.map(x => models.Tag.findByPk(x.id, { transaction: t })),
          ).then(adds => news.concat(adds));
        }
        return news;
      })
      .then((tags) => {
        if (tags) {
          return item.addTags(tags, { transaction: t });
        }
        return [];
      })
      .then(() => {
        if (delList) {
          return Promise.all(
            delList.map(x => models.Tag.findByPk(x.id, { transaction: t })),
          );
        }
        return [];
      })
      .then((tags) => {
        if (tags) {
          return item.removeTags(tags, { transaction: t });
        }
        return [];
      })
      .then(() => item.getTags({ transaction: t }));
  }

  router.post('/album/:aid/tags', (req, res) => {
    const newList = req.body.new;
    const addList = req.body.add;
    const delList = req.body.delete;
    sequelize.transaction().then((t) => {
      models.Album.findByPk(req.params.aid, { transaction: t }).then((album) => {
        addRemoveTags(album, t, newList, addList, delList)
          .then((x) => { res.json(x); t.commit(); })
          .catch((err) => { res.status(500).send(err); t.rollback(); });
      });
    });
  });

  router.post('/track/:tid/tags', (req, res) => {
    const newList = req.body.new;
    const addList = req.body.add;
    const delList = req.body.delete;
    sequelize.transaction().then((t) => {
      models.Track.findByPk(req.params.tid, { transaction: t }).then((track) => {
        addRemoveTags(track, t, newList, addList, delList)
          .then((x) => { res.json(x); t.commit(); })
          .catch((err) => { res.status(500).send(err); t.rollback(); });
      });
    });
  });

  router.get('/people', (req, res) => {
    models.Person.findAll().then((albums) => {
      res.json(albums);
    });
  });

  router.get('/person/:pid', (req, res) => {
    const personId = req.params.pid;
    const personPr = models.Person.findByPk(personId);
    const personTracks = sequelize.dialect.QueryGenerator.selectQuery('trackPeople', {
      attributes: ['trackId'],
      where: { personId },
    }).slice(0, -1);
    const albumsPr = models.Album.findAll({
      include: {
        model: models.Track,
        where: { id: { [Op.in]: sequelize.literal(`(${personTracks})`) } },
        include: [models.Person, models.Tag],
      },
      order: [[models.Track, 'discNumber'], [models.Track, 'trackNumber']],
    });
    Promise.all([personPr, albumsPr]).then(([person, albums]) => {
      const result = person.get({ plain: true });
      result.albums = albums || [];
      res.json(result);
    });
  });

  router.get('/tags/', (req, res) => {
    models.Tag.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('albums->albumTag.albumId')), 'albumCount'],
          [sequelize.fn('COUNT', sequelize.col('tracks->trackTag.trackId')), 'trackCount'],
        ],
      },
      include: [
        { model: models.Album, attributes: [] },
        { model: models.Track, attributes: [] },
      ],
      group: ['tag.id'],
    }).then((tags) => {
      res.json(tags);
    });
  });

  router.get('/tag/:tid/', (req, res) => {
    models.Tag.findByPk(req.params.tid, {
      include: [
        { model: models.Album },
        { model: models.Track, include: models.Album }],
      order: [
        [coalescecols('albums.sortName', 'albums.name')],
        [models.Track, 'discNumber'],
        [models.Track, 'trackNumber'],
      ],
    }).then((tag) => {
      if (tag) {
        res.json(tag);
      } else {
        res.status(404).json({ message: `tag ${req.params.tid} not found` });
      }
    });
  });

  router.get('/search/:term', (req, res) => {
    const { term } = req.params;
    const likeName = { name: { [Op.like]: `%${term}%` } };
    Promise.all([
      models.Album.findAll({ where: likeName, order: [coalescecols('sortName', 'name')] }),
      models.Track.findAll({ where: likeName, include: models.Album, order: ['name'] }),
      models.Person.findAll({ where: likeName, order: ['name'] }),
      models.Tag.findAll({ where: likeName, order: ['name'] }),
    ]).then((results) => {
      function mapLinkFn(path) {
        return function linkfn(x) {
          const r = x.get({ plain: true });
          r.link = `/${path}/${r.id}`;
          return r;
        };
      }
      res.json({
        albums: results[0].map(mapLinkFn('album')),
        tracks: results[1].map(mapLinkFn('track')),
        people: results[2].map(mapLinkFn('person')),
        tags: results[3].map(mapLinkFn('tag')),
      });
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
