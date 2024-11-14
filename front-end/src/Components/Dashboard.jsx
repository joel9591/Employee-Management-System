/*import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId"); // Fetch adminId from local storage
  console.log("Admin ID:", adminId); // Debugging line
  axios.defaults.withCredentials = true;

  const handleLogout = async () => {
    try {
      const result = await axios.get("https://ems-backend-p8j8.onrender.com/auth/logout");
      if (result.data.Status) {
        localStorage.removeItem("valid");
        localStorage.removeItem("adminId"); // Clear adminId on logout
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Employee Management System
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Manage Employees
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-columns ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Category</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/messages"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-chat-left-dots ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Messages</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/dashboard/admin-profile/${adminId}`}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white" to="#">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Syslog Technologies</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;*/

import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null); // Initialize with null
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) {
      setAdminId(storedAdminId);
      console.log("Admin ID retrieved from localStorage:", storedAdminId);
    } else {
      console.log("No Admin ID found in localStorage");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const result = await axios.get("https://employee-management-backend-flhu.onrender.com/auth/logout");
      if (result.data.Status) {
        localStorage.removeItem("valid");
        localStorage.removeItem("adminId"); // Clear adminId on logout
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Employee Management System
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Manage Employees
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-columns ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Category</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/messages"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-chat-left-dots ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Messages</span>
                </Link>
              </li>
              {adminId && (
                <li className="w-100">
                  <Link
                    to={`/dashboard/admin-profile/${adminId}`}
                    className="nav-link px-0 align-middle text-white"
                  >
                    <i className="fs-4 bi-person ms-2"></i>
                    <span className="ms-2 d-none d-sm-inline">Profile</span>
                  </Link>
                </li>
              )}
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link px-0 align-middle text-white" to="#">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Syslog Technologies</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
