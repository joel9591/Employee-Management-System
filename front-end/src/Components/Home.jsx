import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    adminRecords();
  }, []);

  const adminRecords = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/admin_records`).then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/admin_count`).then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/employee_count`).then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/salary_count`).then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const handleEdit = (adminId) => {
    navigate(`/dashboard/edit-admin/${adminId}`); 
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
        `${process.env.REACT_APP_API_URL}/auth/delete_admin/${adminId}` 
      );
      if (response.data.Status) {
        alert("Admin deleted successfully");
        adminRecords(); 
      } else {
        alert("Failed to delete admin: " + response.data.Error);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Failed to delete admin");
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0]; 
  };

  return (
    <div>
      <div className="container p-3 d-flex flex-wrap justify-content-around dashboard-summary">
        <div className="card px-5 pt-2 pb-3 shadow-sm bg-dark text-white border-secondary">
          <h4 className="text-center">Admin</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className="card px-5 pt-2 pb-3 shadow-sm bg-dark text-white border-secondary">
          <h4 className="text-center">Employee</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className="card px-5 pt-2 pb-3 shadow-sm bg-dark text-white border-secondary">
          <h4 className="text-center">Salary</h4>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{salaryTotal} rs</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3 ">
        <h3 className="text-white ">List of Admins</h3>
        <table className="table table-striped table-bordered table-dark">
  <thead className="bg-black text-white">
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>DOB</th>
      <th className="text-center">Action</th>
    </tr>
  </thead>
  <tbody style={{ backgroundColor: "gray", color: "white" }}>
    {admins.map((a) => (
      <tr key={a.id}>
        <td>{a.name}</td>
        <td>{a.email}</td>
        <td>{formatDate(a.dob)}</td>
        <td className="d-flex justify-content-center align-items-center">
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
