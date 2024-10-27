// models/Course.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Faculty from './Faculty.js';

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Associations
Course.belongsTo(Faculty, { foreignKey: 'facultyId' });
Faculty.hasMany(Course, { foreignKey: 'facultyId' });

export default Course;
