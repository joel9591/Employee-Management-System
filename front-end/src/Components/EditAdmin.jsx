import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const EditAdmin = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/admins/${adminId}` // Adjust this if the route is different
        );
        if (response.data.Status) {
          setAdminName(response.data.Result.name);
          setAdminEmail(response.data.Result.email);
        } else {
          alert(response.data.Error);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleNameChange = (e) => {
    setAdminName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setAdminEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/edit/${adminId}`, { // Adjust URL to match backend
        name: adminName,
        email: adminEmail,
      });

      if (response.data.message === 'Admin updated successfully') { // Check message instead of Status
        alert("Admin updated successfully");
        navigate("/dashboard");
      } else {
        alert("Failed to update admin: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update admin: " + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={adminName} onChange={handleNameChange} placeholder="Admin Name" />
      <input type="email" value={adminEmail} onChange={handleEmailChange} placeholder="Admin Email" />
      <button type="submit">Update Admin</button>
    </form>
  );
};

export default EditAdmin;
