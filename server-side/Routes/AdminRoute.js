import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import 'dotenv/config';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}



const handleSQLError = (err, res, customMessage) => {
    console.error(err);
    return res.json({ Status: false, Error: customMessage || "Query Error" });
};

router.post("/adminlogin", (req, res) => {
    const sql = "SELECT * FROM admin WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return handleSQLError(err, res, "Login query error");

        if (result.length > 0) {
            const storedHashedPassword = result[0].password;

            bcrypt.compare(req.body.password, storedHashedPassword, (err, isMatch) => {
                if (err) return handleSQLError(err, res, "Error comparing passwords");

                if (isMatch) {
                    const token = jwt.sign(
                        { role: "admin", email: result[0].email, id: result[0].id },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                    );
                    res.cookie("token", token, { httpOnly: true, secure: false });
                    return res.status(200).json({
                        loginStatus: true,
                        adminId: result[0].id, 
                    });
                } else {
                    return res.status(401).json({ loginStatus: false, Error: "Wrong password" });
                }
            });
        } else {
            return res.status(401).json({ loginStatus: false, Error: "Email not found" });
        }
    });
});


router.post("/signup", upload.single("image"), (req, res) => {
    const { email, password, address, dob, name } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error("Password hashing error:", err);
            return res.status(500).json({ Status: false, Error: "Error hashing password" });
        }

        const sql = "INSERT INTO admin (email, password, address, dob, image, name) VALUES (?)";
        const values = [
            email,
            hash,
            address,
            dob,
            req.file ? req.file.filename : null,
            name
        ];

        con.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ Status: false, Error: "Database error during signup" });
            }
            return res.json({ Status: true, Message: "Admin registered successfully!" });
        });
    });
});

router.put('/edit/:id',authenticateToken, async (req, res) => {
    const adminId = req.params.id;
    const { email, address, dob, name } = req.body;

    const sql = `UPDATE admin SET email = ?, address = ?, dob = ?, name = ? WHERE id = ?`;
    const values = [email, address, dob, name, adminId];

    con.query(sql, values, (err, result) => {
        if (err) return handleSQLError(err, res, "Error updating admin");
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Admin updated successfully' });
        } else {
            return res.status(404).json({ message: 'Admin not found' });
        }
    });
});

router.delete('/delete_admin/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM admin WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return handleSQLError(err, res, "Query Error while deleting admin");
        if (result.affectedRows === 0) {
            return res.status(404).json({ Status: false, Error: "Admin not found" });
        }
        return res.json({ Status: true, Message: "Admin deleted successfully", Result: result });
    });
});





router.get('/profile/:id', (req, res) => {
    const adminId = req.params.id;
    console.log("Admin ID received:", adminId); 

    if (isNaN(adminId)) {
        console.log("Invalid admin ID"); 
        return res.status(400).json({ message: "Invalid admin ID" });
    }

    const sql = "SELECT * FROM admin WHERE id = ?";
    con.query(sql, [adminId], (err, results) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ message: "Internal server error" });
        }
        if (results.length === 0) {
            console.log("No admin found for ID:", adminId); 
            return res.status(404).json({ message: "Admin not found" });
        }
        console.log("Admin found:", results[0]); 
        res.status(200).json({ message: "Admin details fetched successfully", data: results[0] });
    });
});


router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.post('/add_category',authenticateToken, (req, res) => {
    const sql = "INSERT INTO category (name) VALUES (?)";
    con.query(sql, [req.body.category], (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true });
    });
});

router.delete('/delete_category/:id',authenticateToken, (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM category WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});


router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name, email, password, address, salary, image, category_id, dob) 
    VALUES (?)`;
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return handleSQLError(err, res, "Error hashing employee password");
        
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file ? req.file.filename : null,
            req.body.category_id,
            req.body.dob
        ];

        con.query(sql, [values], (err, result) => {
            if (err) return handleSQLError(err, res);
            return res.json({ Status: true });
        });
    });
});

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        SET name = ?, email = ?, salary = ?, address = ?, category_id = ?, dob = ? 
        WHERE id = ?`;
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id,
        req.body.dob,
        id
    ];

    con.query(sql, values, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});


router.get('/admin_count', (req, res) => {
    const sql = "SELECT COUNT(id) AS admin FROM admin";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.get('/employee_count', (req, res) => {
    const sql = "SELECT COUNT(id) AS employee FROM employee";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});

router.get('/salary_count', (req, res) => {
    const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});


router.get('/admin_records', (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if (err) return handleSQLError(err, res);
        return res.json({ Status: true, Result: result });
    });
});


router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };

