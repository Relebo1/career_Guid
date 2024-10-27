// models/Institution.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Faculty from './Faculty.js';
import Course from './Course.js';

const Institution = sequelize.define('Institution', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Associations
Institution.hasMany(Faculty, { foreignKey: 'institutionId' });
Faculty.belongsTo(Institution, { foreignKey: 'institutionId' });

Institution.hasMany(Course, { foreignKey: 'institutionId' });
Course.belongsTo(Institution, { foreignKey: 'institutionId' });

export default Institution;
