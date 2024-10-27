// models/Student.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Course from './Course.js';

const Student = sequelize.define('Student', {
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
Student.belongsToMany(Course, { through: 'StudentCourses' });
Course.belongsToMany(Student, { through: 'StudentCourses' });

export default Student;
