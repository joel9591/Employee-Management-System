import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isChecked) {
      setError("You must agree with terms & conditions to log in.");
      return;
    }

    axios
      .post(`https://employee-management-system-9jz6.onrender.com/auth/adminlogin`, values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          localStorage.setItem("adminId", result.data.adminId); 
          console.log("Admin ID saved:", result.data.adminId);
          navigate("/dashboard");
        } else {
          setError(result.data.Error || "Invalid login details.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.Error) {
          setError(err.response.data.Error); 
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error(err); 
      });
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border border-secondary loginForm">
        <div className="text-warning">{error }</div>
        <h2 className="heading text-center">Admin Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-50"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-10"
            />
          </div>
          <button className="btn btn-success w-100 rounded-10 mb-2">
            Log in
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2"  onChange={(e) => setIsChecked(e.target.checked)}/>
            <label htmlFor="password" className={!isChecked && error ? "text-danger" : "text-white"}>
              You are Agree with terms & conditions
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
