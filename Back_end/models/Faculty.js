// models/Faculty.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Faculty = sequelize.define('Faculty', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Faculty;
