import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "./birthday_feature/notificationScheduler.js";
import messages from "./Routes/chat.js";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors({
    origin: process.env.CLIENT_LINK , 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use("/messages", messages);
app.use(express.static('Public'));

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};


app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(PORT, () => {
    console.log("Server is running");
});
