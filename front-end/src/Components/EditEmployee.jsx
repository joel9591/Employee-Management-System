import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    dob: "",
    category_id: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://employee-management-system-9jz6.onrender.com/auth/category`)
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`https://employee-management-system-9jz6.onrender.com/auth/employee/` + id)
      .then((result) => {
        setEmployee({
          name: result.data.Result[0].name,
          email: result.data.Result[0].email,
          address: result.data.Result[0].address,
          salary: result.data.Result[0].salary,
          dob: result.data.Result[0].dob.split('T')[0], 
          category_id: result.data.Result[0].category_id,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdateClick = () => {
    axios
      .put(`https://employee-management-system-9jz6.onrender.com/auth/edit_employee/` + id, employee)
      .then((result) => {
        if (result.data.Status) {
          console.log("Update successful");
          navigate("/dashboard/employee");
        } else {
          console.log("Update failed:", result.data.Error);
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3 text-white">
      <div className="p-3 rounded rounded-md w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1">
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-1"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
              
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-1"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-1"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDOB" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control rounded-1"
              id="inputDOB"
              value={employee.dob}
              onChange={(e) =>
                setEmployee({ ...employee, dob: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-1"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select rounded-1"
              value={employee.category_id}
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              {category.map((c) => {
                return <option key={c.id} value={c.id}>{c.name}</option>;
              })}
            </select>
          </div>

          <div className="col-12 text-center">
            <button
              type="button" 
              className="btn btn-primary w-auto"
              onClick={handleUpdateClick}
            >
              Update details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;



