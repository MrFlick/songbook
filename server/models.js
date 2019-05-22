const Sequelize = require('sequelize');

const { Model } = Sequelize;

module.exports = (sequelize) => {
  class Album extends Model {}
  Album.init({
    showId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showName: Sequelize.TEXT,
    openingDate: Sequelize.DATE,
  }, { sequelize, modelName: 'album' });
  class Track extends Model {}
  Track.init({
    trackId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trackName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, { sequelize, modelName: 'track' });
  class Person extends Model {}
  Person.init({
    personId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    personName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, { sequelize, modelName: 'person' });
  class Tag extends Model {}
  Tag.init({
    tagId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tagName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    tagType: Sequelize.INTEGER,
  }, { sequelize, modelName: 'tag' });
  return {
    Album,
    Track,
    Person,
  };
};
