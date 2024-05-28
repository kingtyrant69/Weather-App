import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherApp from './component/weatherapp';
import Login from './component/login';
import Signup from './component/signup';
import CardDisplay from './component/carddisplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path='/carddisplay' element={<CardDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
