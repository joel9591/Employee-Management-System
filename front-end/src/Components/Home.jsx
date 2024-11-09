import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate(); // To navigate to the edit page

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    adminRecords();
  }, []);

  const adminRecords = () => {
    axios.get("http://localhost:3000/auth/admin_records").then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get("http://localhost:3000/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get("http://localhost:3000/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get("http://localhost:3000/auth/salary_count").then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const handleEdit = (adminId) => {
    navigate(`/dashboard/edit-admin/${adminId}`); // Navigate to EditAdmin page
  };

  const handleDelete = (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );
    if (confirmDelete) {
      deleteAdmin(adminId);
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/auth/delete_admin/${adminId}` // Updated endpoint
      );
      if (response.data.Status) {
        alert("Admin deleted successfully");
        adminRecords(); // Refresh the admin list
      } else {
        alert("Failed to delete admin: " + response.data.Error);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  return (
    <div>
      <div className="container p-3 d-flex flex-wrap justify-content-around dashboard-summary">
        <div className="card px-3 pt-2 pb-3 shadow-sm">
          <h4 className="text-center">Admin</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className="card px-3 pt-2 pb-3 shadow-sm">
          <h4 className="text-center">Employee</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className="card px-3 pt-2 pb-3 shadow-sm">
          <h4 className="text-center">Salary</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{salaryTotal} rs</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>
                  <div className="d-flex">
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(a.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
