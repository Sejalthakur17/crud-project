import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

function Table() {
  const [users, setUsers] = useState([]);
  const hasFetchedUsers = useRef(false);

  // ✅ modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch users
  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) {
      console.error("Missing VITE_API_URL");
      toast.error("Server configuration error");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL);
        setUsers(response.data);

        if (!hasFetchedUsers.current) {
          toast.success("Data Fetched");
          hasFetchedUsers.current = true;
        }
      } catch (error) {
        console.log(error);
        if (!hasFetchedUsers.current) {
          toast.error("Error Fetching Data");
          hasFetchedUsers.current = true;
        }
      }
    };

    fetchUsers();
  }, []);

  // ✅ Add user (after create)
  const addUser = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  // ✅ Update user (after edit)
  const updateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // ✅ Delete user
  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <>
      <Toaster richColors closeButton />

      <div className="container">
        <h1>User Dashboard</h1>

        {/* ✅ BUTTONS */}
        <div className="btn-group">
          <button className="btn create" onClick={() => setShowCreate(true)}>
            Create User
          </button>

          <button
            className="btn edit"
            onClick={() => {
              if (!selectedUser) {
                toast.error("Select a user first");
                return;
              }
              setShowEdit(true);
            }}
          >
            Edit User
          </button>

          <button
            className="btn delete"
            onClick={() => {
              if (!selectedUser) {
                toast.error("Select a user first");
                return;
              }
              setShowDelete(true);
            }}
          >
            Delete User
          </button>
        </div>

        {/* ✅ TABLE */}
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  backgroundColor:
                    selectedUser?.id === user.id ? "#d3f9d8" : "",
                  cursor: "pointer",
                }}
              >
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MODALS */}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onUserCreated={addUser}
        />
      )}

      {showEdit && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEdit(false)}
          onUserUpdated={updateUser}
        />
      )}

      {showDelete && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDelete(false)}
          onUserDeleted={deleteUser}
        />
      )}
    </>
  );
}

export default Table;