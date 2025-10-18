import mysql from "mysql2/promise.js";
import { Parser } from "node-sql-parser";
import { Response } from "./response.js";
import { MSGS } from "../lang/messages/en/user";

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
        this.parser = new Parser();
    }

    async init() {
        const con = await this.pool.getConnection();
        await con.query(DB.STARTING_QUERY);

        // Close the connection
        con.release();
        console.log("Database started.")
    }

    validateQuery(query, allowed_type) {
        try {
            // Abstract Syntax Tree of the query
            // astify throws error if invalid query
            const ast = this.parser.astify(query);
            const query_type = ast.type?.toUpperCase();

            if(query_type !== allowed_type.toUpperCase()) {
                return {
                    err_code: Response.FORBIDDEN_CODE,
                    err_msg: MSGS.FORBIDDEN_QUERY_ERR.replace("%1", allowed_type)
                }
            }
            return { query: query };
            
        } catch(_) {
            return {
                err_code: Response.BAD_REQ_CODE,
                err_msg: MSGS.INVALID_QUERY_ERR
            }
        }
    }

    // ! Can throw Errors related to the database
    async selectQuery(query) {
        const val_query = this.validateQuery(query, "SELECT");
        if(val_query.err_code) return val_query;

        // Kind of pattern matching with the tuple to ignore the
        // metadata fields
        const [rows] = await this.pool.query(query);
        val_query.result = rows;
        return val_query;
    }

    // ! Can throw Errors related to the database
    async insertQuery(query) {
        const val_query = this.validateQuery(query, "INSERT");
        if(val_query.err_code) return val_query;

        // Kind of pattern matching with the tuple to ignore the
        // metadata fields
        await this.pool.query(query);
        return val_query;
    }
}

export default new PatientDB();