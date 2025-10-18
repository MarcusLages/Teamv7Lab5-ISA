import mysql from "mysql2/promise.js";

class PatientDB {
    static PATIENTS_TABLE = "Patients";
    static PATIENTS_SCHEMA = `
        patientId INT AUTO_INCREMENT PRIMARY KEY,
        name: VARCHAR(100) NOT NULL,
        dateOfBirth: DATETIME
    `;
    static STARTING_QUERY = `
        CREATE TABLE IF NOT EXISTS ${this.PATIENTS_TABLE} (
            ${this.PATIENTS_SCHEMA}
        )
    `;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME
        })
    }

    async init() {
        const con = await this.pool.getConnection();
        await con.query(DB.STARTING_QUERY);

        // Close the connection
        con.release();
        console.log("Database started.")
    }
}

export default new PatientDB();