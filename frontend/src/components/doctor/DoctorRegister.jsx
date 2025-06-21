// // pages/DoctorRegister.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./DoctorForm.css";

// function DoctorRegister() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     fees: "",
//     specialization: "",
//     experience: "",
//     availability: "",
//     profileImage: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:3000/api/doctor/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.message || "Registration failed");
//         return;
//       }

//       alert("Registration successful!");
//       navigate("/doctor-login");
//     } catch (err) {
//       setError("Server error");
//     }
//   };

//   return (
//     <div className="doctor-form-container">
//       <div className="doctor-form-card">
//         <h2>Doctor Registration</h2>
//         {error && <p className="error">{error}</p>}
//         <form onSubmit={handleRegister}>
//           <label>Name</label>
//           <input name="name" onChange={handleChange} required />

//           <label>Email</label>
//           <input type="email" name="email" onChange={handleChange} required />

//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             onChange={handleChange}
//             required
//           />

//           <label>Fees (₹)</label>
//           <input name="fees" onChange={handleChange} />

//           <label>Specialization</label>
//           <input name="specialization" onChange={handleChange} />

//           <label>Experience (years)</label>
//           <input name="experience" onChange={handleChange} />

//           <label>Availability</label>
//           <input name="availability" onChange={handleChange} />

//           <label>Profile Image URL</label>
//           <input name="profileImage" onChange={handleChange} />

//           <button type="submit">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default DoctorRegister;


// pages/DoctorRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorForm.css";

function DoctorRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    fees: "",
    specialization: "",
    experience: "",
    availableDays: "",
    languagesSpoken: "",
    location: "",
    profileImage: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        fees: Number(form.fees),
        experience: Number(form.experience),
        availableDays: form.availableDays
          ? form.availableDays.split(",").map((d) => d.trim())
          : [],
        languagesSpoken: form.languagesSpoken
          ? form.languagesSpoken.split(",").map((l) => l.trim())
          : [],
      };

      const res = await fetch("http://localhost:3000/api/doctor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      navigate("/doctor-login");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="doctor-form-container">
      <div className="doctor-form-card">
        <h2>Doctor Registration</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <label>Name</label>
          <input name="name" onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />

          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />

          <label>Fees (₹)</label>
          <input
            type="number"
            name="fees"
            onChange={handleChange}
            min="0"
          />

          <label>Specialization</label>
          <input name="specialization" onChange={handleChange} />

          <label>Experience (years)</label>
          <input
            type="number"
            name="experience"
            onChange={handleChange}
            min="0"
          />

          <label>Available Days (comma separated)</label>
          <input
            name="availableDays"
            placeholder="e.g. Monday, Wednesday, Friday"
            onChange={handleChange}
          />

          <label>Languages Spoken (comma separated)</label>
          <input
            name="languagesSpoken"
            placeholder="e.g. English, Hindi, Punjabi"
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            placeholder="City or Address"
            onChange={handleChange}
          />

          <label>Profile Image URL</label>
          <input name="profileImage" onChange={handleChange} />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default DoctorRegister;
