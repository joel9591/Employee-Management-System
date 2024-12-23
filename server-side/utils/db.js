import mysql from 'mysql2';
import dotenv from 'dotenv';

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    //port: process.env.DB_PORT
});

con.connect((err) => {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to the database");
    }
});


export default con;
