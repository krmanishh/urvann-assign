import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", background: "#e6ffe6" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/add-plant">Add Plant</Link> |{" "}
      {!user ? (
        <Link to="/login">Login</Link>
      ) : (
        <>
          <span style={{ marginLeft: "1rem" }}>Hello, {user.username}</span>
          <button onClick={logout} style={{ marginLeft: "1rem" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
