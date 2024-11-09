import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    image: "",
    address: "",
    dob: "",
    name: "",
  });

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("image", formData.image);
    data.append("address", formData.address);
    data.append("dob", formData.dob);
    data.append("name", formData.name);

    axios
      .post("http://localhost:3000/auth/signup", data)
      .then((response) => {
        console.log("Signup successful:", response.data);
        setSuccessMessage("Signup successful!"); // Set success message
        setErrorMessage(""); // Clear any previous error messages
        setTimeout(() => {
          navigate("/adminlogin"); // Redirect after 1 seconds
        }, 1000);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setErrorMessage(
          error.response?.data.Error || "Signup failed. Please try again."
        ); // Set error message
        setSuccessMessage(""); // Clear any previous success messages
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 signup">
      <div className="p-4 rounded w-45 border">
        <h2 className="text-center mb-4">Admin Signup</h2>

        {/* Conditional rendering of success message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Conditional rendering of error message */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
