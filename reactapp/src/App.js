

import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Portal from './portal';
import Login from './login';

const clientId = "1050865228486-13vmt2la5vqmdc49eciaq87h1qrq4t3n.apps.googleusercontent.com";

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
