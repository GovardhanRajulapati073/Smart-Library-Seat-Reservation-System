import { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("student");
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [newName, setNewName] = useState("");

  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const [userToDelete,setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [role]);



  // ================= FETCH USERS =================

  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/admin/users/${role}`
      );

      setUsers(res.data);

    } catch (err) {

      console.error(err);

    }

  };



  // ================= DELETE USER =================

  const confirmDelete = async () => {

    try{

      await axios.delete(
        `http://localhost:5000/api/admin/deleteUser/${userToDelete}`
      );

      fetchUsers();

      setShowDeleteModal(false);

    }catch(err){

      console.error(err);
      alert("Delete failed");

    }

  };



  // ================= UPDATE USER =================

  const updateUser = async () => {

    try {

      await axios.put(
        `http://localhost:5000/api/admin/updateUser/${editingUser.id}`,
        { name: newName }
      );

      alert("User updated successfully");

      setEditingUser(null);

      fetchUsers();

    } catch (err) {

      console.error(err);
      alert("Error updating user");

    }

  };



  // ================= PROFILE COMPLETION =================

  const profileStatus = (u) => {

    if(
      u.first_name &&
      u.last_name &&
      u.mobile &&
      u.dob
    ){
      return "complete";
    }

    return "incomplete";

  };



  return (

    <div className="p-6">

      {/* HEADER */}

      <h2 className="text-2xl font-bold mb-6 text-white">
        User Management
      </h2>



      {/* ROLE FILTER */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setRole("student")}
          className={`px-5 py-2 rounded-lg transition
          ${
            role === "student"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Students
        </button>

        <button
          onClick={() => setRole("faculty")}
          className={`px-5 py-2 rounded-lg transition
          ${
            role === "faculty"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Faculty
        </button>

      </div>



      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white"
      />



      {/* USERS TABLE */}

      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">

        <table className="w-full text-left text-gray-200">

          <thead className="bg-gray-800 text-gray-300 text-sm uppercase">

            <tr>

              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3 text-center">Actions</th>

            </tr>

          </thead>



          <tbody>

            {users
              .filter((u) =>
                (u.name + u.email)
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((u) => (

                <tr
                  key={u.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >

                  <td className="px-4 py-3 font-medium">
                    {u.name}
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {u.email}
                  </td>

                  <td className="px-4 py-3">
                    {role}
                  </td>



                  {/* PROFILE STATUS */}

                  <td className="px-4 py-3">

                    {profileStatus(u) === "complete" ? (

                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                        Complete
                      </span>

                    ) : (

                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs">
                        Incomplete
                      </span>

                    )}

                  </td>



                  {/* ACTIONS */}

                  <td className="px-4 py-3 text-center">

                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setNewName(u.name);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 mr-2 rounded text-black"
                    >
                      Update
                    </button>

                    <button
                      onClick={()=>{
                        setUserToDelete(u.id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>



      {/* UPDATE USER MODAL */}

      {editingUser && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

          <div className="bg-gray-900 p-6 rounded-xl w-80">

            <h2 className="text-lg mb-4 text-white">
              Update User
            </h2>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-800 p-3 rounded w-full mb-4 text-white"
            />

            <button
              onClick={updateUser}
              className="bg-green-500 px-4 py-2 mr-2 rounded hover:bg-green-600"
            >
              Save
            </button>

            <button
              onClick={() => setEditingUser(null)}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>

          </div>

        </div>

      )}



      {/* DELETE CONFIRM MODAL */}

      {showDeleteModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">

          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-80 text-center">

            <h2 className="text-lg font-semibold mb-3 text-white">
              ⚠ Delete User
            </h2>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this user?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={()=>setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ManageUsers;