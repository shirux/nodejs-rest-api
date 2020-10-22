'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "'First name' can not be null"
        },
        notEmpty: {
          msg: "'First name' can not be an empty value"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "'Last name' can not be null"
        },
        notEmpty: {
          msg: "'Last name' can not be an empty value"
        }
      }
    },
    emailAddress : {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "'email' can not be null"
        },
        isEmail: {
          msg: "'email' must be a valid email address"
        },
        isUnique(val) {
          return User.findOne({
            where: {
              emailAddress: val
            }
          }).then(result => {
            if (result) {
              throw new Error('This email address is already registered in our database')
            }
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "'Password' can not be null"
        },
        notEmpty: {
          msg: "'Password' can not be an empty value"
        }
      }
    }
  }, { sequelize });

  User.associate = (models) => {
      User.hasMany(models.Course, {
          foreignKey: {
              fieldName: 'userId',
              allowNull: false
          }
      })
  }

  return User;
};