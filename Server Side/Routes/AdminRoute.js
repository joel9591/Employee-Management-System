import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";

const router = express.Router();

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ loginStatus: false, Error: "Unauthorized" });

    jwt.verify(token, "jwt_secret_key", (err, user) => {
        if (err) return res.status(403).json({ loginStatus: false, Error: "Unauthorized" });
        req.user = user;
        next();
    });
};

router.post("/adminlogin", (req, res) => {
    // Check if email and password are provided
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
    }

    const sql = "SELECT * FROM admin WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ loginStatus: false, Error: "Query error" });
        }

        if (result.length > 0) {
            // Log to debug if needed
            console.log("Admin found:", result[0]);

            // Compare the password with the hashed password in the DB
            bcrypt.compare(req.body.password, result[0].password, (err, match) => {
                if (err) {
                    console.error("Bcrypt comparison error:", err);
                    return res.status(500).json({ loginStatus: false, Error: "Comparison error" });
                }
                if (!match) {
                    console.log("Password mismatch");
                    return res.status(401).json({ loginStatus: false, Error: "Invalid email or password" });
                }

                // If password matches, generate a token
                const email = result[0].email;
                const token = jwt.sign({ role: "admin", email: email, id: result[0].id }, "jwt_secret_key", { expiresIn: "1d" });
                
                // Set the cookie with the token
                res.cookie('token', token, { httpOnly: true });

                // Respond to the client with a success message
                return res.json({ loginStatus: true });
            });
        } else {
            console.log("Admin not found with email:", req.body.email);
            return res.status(401).json({ loginStatus: false, Error: "Invalid email or password" });
        }
    });
});



router.get('/category', authenticateJWT, (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

router.post('/add_category', authenticateJWT, (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)";
    con.query(sql, [req.body.category], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true });
    });
});

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Add employee
router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee (name, email, password, address, salary, image, category_id) VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ Status: false, Error: "Hashing error" });
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename,
            req.body.category_id
        ];
        con.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ Status: false, Error: err });
            return res.json({ Status: true });
        });
    });
});

// Get all employees
router.get('/employee', authenticateJWT, (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get employee by ID
router.get('/employee/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        if (result.length === 0) return res.status(404).json({ Status: false, Error: "Employee not found" });
        return res.json({ Status: true, Result: result });
    });
});

// Edit employee
router.put('/edit_employee/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, category_id = ? WHERE id = ?`;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ];
    con.query(sql, [...values, id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Delete employee
router.delete('/delete_employee/:id', authenticateJWT, (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get admin count
router.get('/admin_count', authenticateJWT, (req, res) => {
    const sql = "SELECT COUNT(id) AS admin FROM admin";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get employee count
router.get('/employee_count', authenticateJWT, (req, res) => {
    const sql = "SELECT COUNT(id) AS employee FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get total salary count
router.get('/salary_count', authenticateJWT, (req, res) => {
    const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Get all admin records
router.get('/admin_records', authenticateJWT, (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if (err) return res.status(500).json({ Status: false, Error: "Query Error" });
        return res.json({ Status: true, Result: result });
    });
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };
