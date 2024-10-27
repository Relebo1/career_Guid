// models/Admission.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Import your sequelize instance

class Admission extends Model {}

Admission.init(
    {
        admission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Students', // Ensure this matches the name of the students table
                key: 'id',
            },
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Courses', // Ensure this matches the name of the courses table
                key: 'id',
            },
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'), // Define allowed statuses
            allowNull: false,
            defaultValue: 'Pending',
        },
        submission_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Sets default to current date
        },
        decision_date: {
            type: DataTypes.DATE, // Optional field, can be updated when a decision is made
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT, // Optional field for any remarks or notes
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Admission',
        tableName: 'admissions', // Specify table name
        timestamps: false, // Disable default createdAt and updatedAt fields
    }
);

export default Admission;
