import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function Layout() {
  return (
    <>
      <Navbar />

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;