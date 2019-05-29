const Sequelize = require('sequelize');

const { Model } = Sequelize;

module.exports = (sequelize) => {
  class Album extends Model {}
  Album.init({
    name: Sequelize.TEXT,
    sortName: Sequelize.TEXT,
    releaseYear: Sequelize.INTEGER,
  }, { sequelize, modelName: 'album' });

  class Track extends Model {}
  Track.init({
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    sortName: Sequelize.TEXT,
    trackNumber: Sequelize.INTEGER,
    discNumber: Sequelize.INTEGER,
    length: Sequelize.INTEGER,
  }, { sequelize, modelName: 'track' });
  Album.hasMany(Track);
  Track.belongsTo(Album);

  class Person extends Model {}
  Person.init({
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, { sequelize, modelName: 'person' });

  class Role extends Model {}
  Role.init({
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, { sequelize, modelName: 'role' });

  class AlbumPerson extends Model {}
  AlbumPerson.init({}, { sequelize, modelName: 'albumPerson' });
  AlbumPerson.belongsTo(Role);
  Person.belongsToMany(Album, { through: AlbumPerson });
  Album.belongsToMany(Person, { through: AlbumPerson });

  class TrackPerson extends Model {}
  TrackPerson.init({}, { sequelize, modelName: 'trackPerson' });
  TrackPerson.belongsTo(Role);
  Person.belongsToMany(Track, { through: TrackPerson });
  Track.belongsToMany(Person, { through: TrackPerson });

  class Tag extends Model {}
  Tag.init({
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    type: Sequelize.INTEGER,
  }, { sequelize, modelName: 'tag' });

  class TagType extends Model {}
  TagType.init({
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, { sequelize, modelName: 'tagType' });

  Tag.belongsToMany(Album, { through: 'albumTag' });
  Album.belongsToMany(Tag, { through: 'albumTag' });
  Tag.belongsToMany(Track, { through: 'trackTag' });
  Track.belongsToMany(Tag, { through: 'trackTag' });
  Tag.belongsTo(TagType);

  return {
    Album,
    Track,
    Person,
    Tag,
  };
};
