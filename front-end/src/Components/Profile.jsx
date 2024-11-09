import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminId } = useParams(); // Gets adminId from the URL

  console.log("Received Admin ID from URL:", adminId); // Debugging line

  useEffect(() => {
    if (!adminId) {
      setError("Invalid admin ID.");
      setLoading(false);
      return;
    }

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/admin/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched admin data:", response.data); // Log fetched data
        setAdmin(response.data[0] || response.data);
      } catch (err) {
        setError("Failed to fetch admin details.");
        console.error("Error fetching admin:", err); // Log error details
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  if (loading) return <p>page is Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="p-2 d-flex justify-content-center shadow">
        <h4>Admin Management System</h4>
      </div>
      <div className="d-flex justify-content-center flex-column align-items-center mt-3">
        {admin.image && (
          <img
            src={`http://localhost:3000/Public/Images/${admin.image}`}
            className="emp_det_image"
            alt="Admin"
          />
        )}
        <div className="d-flex align-items-center flex-column mt-5">
          <h3>Name: {admin.name}</h3>
          <h3>Email: {admin.email}</h3>
          <h3>Date of Birth: {admin.dob}</h3>
          <h3>Address: {admin.address}</h3>
        </div>
      </div>
    </div>
  );
};

export default Profile;
