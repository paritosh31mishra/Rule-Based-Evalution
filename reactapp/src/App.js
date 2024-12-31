/*import { useEffect } from 'react';
import Portal from './portal';
import Login from './login';
import { gapi } from 'gapi-script';

const clientId = "925306536966-8krnsg2kdor08se5s6d47vla1pec5f2f.apps.googleusercontent.com";

function App() {
  useEffect(() =>{
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start);
  });
  
  let userid = localStorage.getItem("fullname");
  if(userid == null)
   return (<Login/>)
  else
  return (<Portal/>)
}

export default App;
*/

import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Portal from './portal';
import Login from './login';

const clientId = "925306536966-8krnsg2kdor08se5s6d47vla1pec5f2f.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    // This is now optional if you're using @react-oauth/google
    console.log("App initialized"); 
  }, []);

  const userId = localStorage.getItem("fullname");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {userId == null ? <Login /> : <Portal />}
    </GoogleOAuthProvider>
  );
}

export default App;
