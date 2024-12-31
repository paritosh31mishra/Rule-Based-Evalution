/*
import {Link}  from 'react-router-dom';
import { useState, useEffect } from 'react';
import {GoogleLogout} from 'react-google-login';
import { gapi } from 'gapi-script';

const clientId = "925306536966-8krnsg2kdor08se5s6d47vla1pec5f2f.apps.googleusercontent.com";
const Header = () =>{

  const logout = () =>{
    window.localStorage.clear();
    window.location.href="http://localhost:3000/#/"; // it will go to dashboard
    window.location.reload(); // it will reload the app. js(window) file
  }
  
    let[isHidden, setIsHidden] = useState(true);
    return(
      <nav className="navbar text-white  p-4 ">
      <div class="container-fluid">
      <span className="navbar-brand mb-0 h1 text-white"><h2>Rule Engine</h2></span>
       
      <div class="btn-group" role="group" >
      
        <button className="btn btn-dark fw-bold" onClick={logout}> Welcome - {localStorage.getItem("fullname") } Logout <i className="fa fa-power-off"></i>  </button>
</div>   
 </div>
 </nav>
   )
}
export default Header;
*/

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { googleLogout } from '@react-oauth/google';

const Header = () => {
  const logout = () => {
    googleLogout(); // Perform Google logout
    window.localStorage.clear(); // Clear localStorage
    window.location.href = "http://localhost:3000/#/"; // Redirect to dashboard
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


