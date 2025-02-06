

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { googleLogout } from '@react-oauth/google';

const Header = () => {
  const logout = () => {
    googleLogout(); // Perform Google logout
    window.localStorage.clear(); // Clear localStorage
    window.location.href = "https://rule-based-evalution-frontend.onrender.com/#/"; // Redirect to dashboard
    window.location.reload(); // Reload the app
  };

  let [isHidden, setIsHidden] = useState(true);

  return (
    <nav className="navbar text-white p-4">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 text-white">
          <h2>Rule Engine</h2>
        </span>

        <div className="btn-group" role="group">
          <button className="btn btn-dark fw-bold" onClick={logout}>
            Welcome - {localStorage.getItem("fullname")} Logout <i className="fa fa-power-off"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;


