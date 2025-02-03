import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import "./Navbar.css";

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          LogicCross
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              <FaHome className="nav-icon" /> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="nav-link">
              <FaUser className="nav-icon" /> Perfil
            </Nav.Link>
            <Nav.Link as={Link} to="/logout" className="nav-link logout">
              <FaSignOutAlt className="nav-icon" /> Cerrar Sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;