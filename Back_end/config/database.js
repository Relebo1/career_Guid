// config/database.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('career_guidancedb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
