import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="p-4 bg-gray-200 flex gap-4">
      <Link to="/auth">Auth Page</Link>
      <Link to="/admin">Admin page</Link>
    </nav>
  );
}

export default Navbar;