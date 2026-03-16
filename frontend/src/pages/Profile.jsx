import Sidebar from "../components/Sidebar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

function Profile() {

  const { setUser } = useContext(UserContext);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");

  const [editing, setEditing] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    hallticket: "",
    empid: "",
    mobile: "",
    dob: "",
    branch: "",
    specialization: "",
    year: ""
  });

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {

        const data = res.data;

        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          hallticket: data.hall_ticket || "",
          empid: data.emp_id || "",
          branch: data.branch || "",
          specialization: data.specialization || "",
          year: data.year || "",
          mobile: data.mobile || "",
          dob: formatDate(data.dob)
        });

        if (data.profile_image) {

          setPreview(
            `http://localhost:5000/uploads/${data.profile_image}`
          );

          setProfileImage(data.profile_image);

        }

        setLoading(false);

      });

  }, [userId]);


  /* ================= UPDATED HANDLE SAVE ================= */

  const handleSave = async () => {

    try {

      const formData = new FormData();

      formData.append("first_name", form.firstName);
      formData.append("last_name", form.lastName);
      formData.append("hall_ticket", form.hallticket);
      formData.append("emp_id", form.empid);
      formData.append("mobile", form.mobile);
      formData.append("dob", form.dob);
      formData.append("branch", form.branch);
      formData.append("specialization", form.specialization);
      formData.append("year", form.year);

      if (profileImage && typeof profileImage !== "string") {
        formData.append("profile_image", profileImage);
      }

      const res = await axios.put(
        `http://localhost:5000/api/auth/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // update sidebar / dashboard name instantly
      localStorage.setItem(
        "name",
        form.firstName + " " + form.lastName
      );

      alert("Profile updated successfully");

    } catch (err) {

      console.log(err);
      alert("Error updating profile");

    }

  };

  /* ======================================================= */

  const calculateCompletion = () => {

    let fields;

    if (role === "student") {

      fields = [
        form.firstName,
        form.lastName,
        form.email,
        form.hallticket,
        form.branch,
        form.specialization,
        form.year,
        form.mobile,
        form.dob,
        profileImage
      ];

    } else {

      fields = [
        form.firstName,
        form.lastName,
        form.email,
        form.empid,
        form.mobile,
        form.dob,
        profileImage
      ];

    }

    const filled = fields.filter(Boolean).length;

    return Math.round((filled / fields.length) * 100);

  };

  const completion = calculateCompletion();

  if (loading) {
    return <div className="text-white p-10">Loading Profile...</div>;
  }

  return (

    <div className="flex bg-gray-950 min-h-screen text-white">

      <Sidebar />

      <div className="ml-64 flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          Personal Information
        </h1>

        <button
          onClick={() => setEditing(!editing)}
          className="bg-blue-500 px-4 py-2 rounded mb-6"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

        <div className="mb-6">

          <p className="text-gray-400 mb-1">
            Profile Completion: {completion}%
          </p>

          <div className="w-full bg-gray-800 rounded h-3">

            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${completion}%` }}
            ></div>

          </div>

        </div>

        <div className="mb-6">

          <label className="block mb-2">
            Profile Picture
          </label>

          {preview && (

            <img
              src={preview}
              alt="profile"
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />

          )}

          <input
            type="file"
            accept="image/*"
            disabled={!editing}
            onChange={(e) => {

              const file = e.target.files[0];

              if (!file) return;

              setProfileImage(file);

              setPreview(URL.createObjectURL(file));

            }}
          />

        </div>

        <div className="grid grid-cols-2 gap-6 max-w-4xl">

          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            disabled={!editing}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            disabled={!editing}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />

          <input
            value={email}
            disabled
            className="p-3 rounded bg-gray-800 border border-gray-700 text-gray-400"
          />

          {role === "student" && (

            <>
              <input
                name="hallticket"
                placeholder="Hall Ticket No"
                value={form.hallticket}
                disabled={!editing}
                onChange={handleChange}
                className="p-3 rounded bg-gray-900 border border-gray-700"
              />

              <select
                name="branch"
                value={form.branch}
                disabled={!editing}
                onChange={handleChange}
                className="p-3 rounded bg-gray-900 border border-gray-700"
              >

                <option value="">Select Branch</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>EEE</option>
                <option>MECH</option>
                <option>AGRI</option>
                <option>CIVIL</option>
                <option>BBA</option>
                <option>BCA</option>
                <option>MBA</option>
                <option>MTECH</option>

              </select>

              <select
                name="specialization"
                value={form.specialization}
                disabled={!editing}
                onChange={handleChange}
                className="p-3 rounded bg-gray-900 border border-gray-700"
              >

                <option value="">Select Specialization</option>

                <option>CSE - GEN</option>
                <option>AIML</option>
                <option>DS</option>
                <option>CS</option>
                <option>VLSI</option>

              </select>

              <select
                name="year"
                value={form.year}
                disabled={!editing}
                onChange={handleChange}
                className="p-3 rounded bg-gray-900 border border-gray-700"
              >

                <option value="">Select Year</option>

                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>

              </select>
            </>
          )}

          {role === "faculty" && (

            <input
              name="empid"
              placeholder="Employee ID"
              value={form.empid}
              disabled={!editing}
              onChange={handleChange}
              className="p-3 rounded bg-gray-900 border border-gray-700"
            />

          )}

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            disabled={!editing}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            disabled={!editing}
            onChange={handleChange}
            className="p-3 rounded bg-gray-900 border border-gray-700"
          />

        </div>

        {editing && (

          <button
            onClick={handleSave}
            className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2 rounded"
          >
            Save Profile
          </button>

        )}

      </div>

    </div>

  );

}

export default Profile;