import { Table, Form, Button, Container, Spinner, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const URL_USER=import.meta.env.VITE_API_URL_USER

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [authRole, setAuthRole] = useState("");
  const [updatedRoles, setUpdatedRoles] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${URL_USER}:3002/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          console.error("Unexpected API response format:", response.data);
        }

        setAuthRole(response.data.authRole || "");
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (idVolunteer, newRole) => {
    setUpdatedRoles((prev) => ({
      ...prev,
      [idVolunteer]: newRole,
    }));
  };

  const handleUpdateRole = async (idVolunteer) => {
    const token = localStorage.getItem("token");
    const newRole = updatedRoles[idVolunteer];

    if (!newRole) return;

    try {
      console.log("Updating role for:", idVolunteer, "New Role:", newRole);

      const authResponse = await axios.post(
        `${URL_USER}:3001/auth/authorize`,
        { action: "update_role" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Auth API Response:", authResponse.data);

      if (!authResponse.data.authorized) {
        alert("You do not have permission to update roles.");
        return;
      }

      await axios.put(
        `${URL_USER}:3003/users/role/${idVolunteer}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Role updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Update role error:", error.response?.data || error.message);
      alert("Error updating role");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading users...</p>
      </Container>
    );
  }

  return (
    <Container className="user-list-container">
      <h2 className="text-center">User Management</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID Volunteer</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Cellphone</th>
            <th>Email</th>
            <th>C.I</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 &&
            currentUsers.map((user) => (
              <tr key={user.idVolunteer}>
                <td>{user.idVolunteer}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.cellphone}</td>
                <td>{user.email}</td>
                <td>{user.ci}</td>
                <td>
                  {authRole === "admin" ||
                  (authRole === "manager" && user.role !== "admin") ? (
                    <Form.Select
                      value={updatedRoles[user.idVolunteer] || user.role}
                      onChange={(e) =>
                        handleRoleChange(user.idVolunteer, e.target.value)
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="driver">Driver</option>
                    </Form.Select>
                  ) : (
                    <span>{user.role}</span>
                  )}
                </td>
                <td>
                  {authRole === "admin" ||
                  (authRole === "manager" && user.role !== "admin") ? (
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateRole(user.idVolunteer)}
                    >
                      Update
                    </Button>
                  ) : (
                    <span>No Permission</span>
                  )}
                </td>
              </tr>
            ))}
          {currentUsers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {currentPage > 3 && <Pagination.Ellipsis />}

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;

          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          }
          return null;
        })}

        {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

        <Pagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};

export default UserList;