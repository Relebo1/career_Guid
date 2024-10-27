// models/Application.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Application extends Model {}

Application.init(
    {
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Student',
                key: 'id',
            },
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Course',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Application',
        timestamps: false,
    }
);

export default Application; // Export using ES Modules
