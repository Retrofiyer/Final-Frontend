import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import "../styles/login.css";

const URL_USER=import.meta.env.VITE_API_URL_USER

const LoginPage = () => {
  const [formData, setFormData] = useState({ idVolunteer: "", ci: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });

    if (name === "ci" && value.length !== 10) {
      setErrors({ ...errors, ci: "The ID must have 10 digits" });
    } else {
      setErrors({ ...errors, ci: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.ci.length !== 10) {
      setErrors({ ...errors, ci: "The ID must have 10 digits" });
      return;
    }

    try {
      const response = await axios.post(
        `${URL_USER}:3000/auth/login`,
        formData,
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Incorrect credentials. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>LogicCross</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="idVolunteer"
              placeholder="ID Volunteer"
              value={formData.idVolunteer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="text"
              name="ci"
              placeholder="C.I"
              value={formData.ci}
              onChange={handleChange}
              maxLength="10"
              required
            />
          </div>
          {errors.ci && <p className="error">{errors.ci}</p>}

          <button type="submit" className="btn btn-danger w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;