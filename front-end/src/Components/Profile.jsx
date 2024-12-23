import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const Profile = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminId } = useParams();

  useEffect(() => {
    if (!adminId || isNaN(adminId)) {
      setError("Invalid admin ID.");
      setLoading(false);
      return;
    }

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/profile/${adminId}`
        );
        setAdmin(response.data.data || {});
      } catch (err) {
        setError("Failed to fetch admin details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container text-center mt-5">
      <h4>Admin Management System</h4>
      <div className="d-flex flex-column align-items-center">
        <div className="mb-4">
          <img
            src={`${process.env.REACT_APP_API_URL}/Images/` + admin.image}
            alt="Admin"
            className="img-fluid rounded-circle shadow"
            style={{ maxWidth: "250px", height: "250px" }}
          />
        </div>
        <h3 className="text-white">Name: {admin.name}</h3>
        <h3 className="text-white">Email: {admin.email}</h3>
        <h3 className="text-white">
          Date of Birth: {new Date(admin.dob).toLocaleDateString("en-CA")}
        </h3>
        <h3 className="text-white">Address: {admin.address}</h3>
      </div>
    </div>
  );
};

export default Profile;
