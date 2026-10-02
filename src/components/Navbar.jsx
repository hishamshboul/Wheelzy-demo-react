import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      className="navbar bg-dark"
      data-bs-theme="dark"
      aria-label="Main navigation"
    >
      <div className="container">
        <Link to="/" className="navbar-brand">
          WheelzyDemo
        </Link>

        <div className="navbar-nav flex-row flex-wrap gap-3">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>

          <NavLink to="/car-cases" className="nav-link" end>
            Car Cases
          </NavLink>

          <NavLink to="/car-cases/create" className="nav-link" end>
            Create Case
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;