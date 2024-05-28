import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    // Send signup request to the server
    // You can use fetch or axios to make the API request
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        // You can redirect the user or perform other actions based on the response
        console.log(data);
        console.log(data.success);
        if(data.success){
          window.location = '/login';
        }
        else {
          alert('could not signup');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToSignup = () => {
    navigate("/register");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToCard = () => {
    console.log("working");
    navigate("/carddisplay");
  };
  const shouldDisplayLoginButton = () => {
    return !localStorage.getItem("user");
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
    <div className="navbar">
        <ul>
          <li>
            <a href="/" onClick={navigateToHome}>
              🌧️
            </a>
          </li>
          <li>
            <a href="/carddisplay" onClick={navigateToCard}>
              Weather
            </a>
          </li>
          <li className="navbar-buttons">
            {shouldDisplayLoginButton() ? (
              <div className="zipcodeInput" style={{marginLeft: '1050px'}}>
                <button onClick={navigateToLogin}>Login</button>
                <button onClick={navigateToSignup}>Signup</button>
              </div>
            ) : (
              <div className="zipcodeInput" style={{marginLeft: '1100px'}}>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </div>
    <div className='login'>
      <h2>Signup</h2>
      <input
      className='login-signup'
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
      className='login-signup'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='loginbutton' onClick={handleSignup}>Signup</button>
    </div>
    </>
  );
};

export default Signup;
