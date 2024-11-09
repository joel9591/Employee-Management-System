import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "mysql.railway.internal",
    user: "root",
    password: "PloOqXeFxtOYQVAbmylhFlJagqgCsPHn",
    database: "railway",
    port: 3306 
});

con.connect((err) => {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to the database");
    }
});

// Export the connection
export default con;
