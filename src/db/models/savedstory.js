'use strict';
module.exports = (sequelize, DataTypes) => {
  var SavedStory = sequelize.define('SavedStory', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    story: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {});
  SavedStory.associate = function(models) {
    SavedStory.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return SavedStory;
};
