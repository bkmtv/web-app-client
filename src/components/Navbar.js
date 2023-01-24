import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <ul className="nav justify-content-center m-5">
            <li className="nav-item display-6">
              <Link to="/login" className="nav-link">Вход</Link>
            </li>
            <li className="nav-item display-6">
              <Link to="/registration" className="nav-link">Регистрация</Link>
            </li>
          </ul>
    </div>
  )
}

export default Navbar;