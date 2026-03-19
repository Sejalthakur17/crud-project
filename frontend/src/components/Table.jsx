import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

function Table() {
  const [users, setUsers] = useState([]);
  const hasFetchedUsers = useRef(false);

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

  return (
    <>
      <Toaster richColors closeButton />

      <div className="container">
        <h1>User Dashboard</h1>

        {/* ✅ Buttons with modals */}
        <div className="btn-group">
          <CreateUserModal />
          <EditUserModal />
          <DeleteUserModal />
        </div>

        {/* ✅ Table */}
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
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;