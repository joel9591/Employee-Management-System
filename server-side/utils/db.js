import mysql from 'mysql2';
import 'dotenv/config';

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

con.connect((err) => {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to the database");
    }
});

export default con;
