'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SavedStories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          model: 'User',
          key: 'id',
          as: 'userId'
        }
      },
      story: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SavedStories');
  }
};
