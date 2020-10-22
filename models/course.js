'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "'Title' can not be null"
        },
        notEmpty: {
          msg: "'Title' can not be an empty value"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "'Description' can not be null"
        },
        notEmpty: {
          msg: "'Description' can not be an empty value"
        }
      }
    },
    estimatedTime : {
      type: DataTypes.STRING,
      allowNull: true
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, { sequelize });

  Course.associate = (models) => {
      Course.belongsTo(models.User, {
          foreignKey: {
              fieldName: 'userId',
              allowNull: false
          }
      })
  }

  return Course;
};