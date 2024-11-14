import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "./birthday_feature/notificationScheduler.js";
import messages from "./Routes/chat.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Set up CORS with specific configuration
app.use(cors({
    origin: ["https://employee-management-system-gray.vercel.app", "employee-management-git-55b0f3-joelstalin76-gmailcoms-projects.vercel.app", "employee-management-system-5xrtzxra2.vercel.app"], // Include all allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use("/messages", messages);
app.use('/admin', adminRouter);
app.use(express.static('Public'));

// Middleware to verify the user
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// Route to verify user
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(PORT, () => {
    console.log("Server is running");
});
