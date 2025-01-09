import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeLogin.css";

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
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
      .post(`https://employee-management-system-9jz6.onrender.com/employee/employee_login`, values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/employee_detail/" + result.data.id);
        } else {
          setError(result.data.Error || "Invalid login details.");
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3  rounded w-10 h-40 border loginForm">
        <div className="text-warning">{error}</div>
        <h2 className="d-flex justify-content-center ">Employee Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-10"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
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
            <input
              type="checkbox"
              name="tick"
              id="tick"
              className="me-2"
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label
              htmlFor="password"
              className={!isChecked && error ? "text-danger" : "text-white"}
            >
              You are Agree with terms & conditions
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
