import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/styles.css";
import thunderstorm from '../images/rain.png';
import sunny from '../images/sunny.png';
import partiallycloudy from '../images/partiallycloudy.png';
import cleannight from '../images/clearnight.png';
import rainy from '../images/rainy.png';
import haze from '../images/hazy.png';
import latehaze from '../images/hazynight.png';
import laterain from '../images/laterain.png';
import cloudynight from '../images/cloudynight.png';
import cloudyday from '../images/cloudyday.png';


function WeatherApp() {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState(null);
  const navigate = useNavigate();
  const [weatherIcon, setIcon] = useState(null);
  const [sunrisetime, setsunrise] = useState(null);
  const [sunsettime, setsunset] = useState(null);
  const [speed, setspeed] = useState(null);
  const [degree, setdegree] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=5742cc42b5c06616dc61ea777dd3b089`;
      const resp = await fetch(url);
      const respJson = await resp.json();
      setCity(respJson.main);
      const weatherId = respJson.weather;
      if(weatherId && weatherId.length > 0){
        const id = weatherId[0].id;
        const obj = respJson;
        const timestamp = obj.dt;
        const timezoneOffsetInSeconds = obj.timezone; 
        const localDateTime = new Date((timestamp + timezoneOffsetInSeconds) * 1000);
        const dstOffset = localDateTime.getTimezoneOffset() * 60 * 1000;
        const adjustedDateTime = new Date(localDateTime.getTime() + dstOffset);
        const hours = adjustedDateTime.getHours();
        const sunrise = respJson.sys.sunrise;
        const sunset = respJson.sys.sunset;
        const date1 = new Date(sunrise * 1000);
        const date2 = new Date(sunset * 1000);
        const sunrise_time = date1.toLocaleTimeString();
        const sunset_time = date2.toLocaleTimeString();
        const wind_speed = respJson.wind.speed;
        const wind_degree = respJson.wind.deg;
        console.log(wind_speed);
        console.log(wind_degree);
        console.log(sunrise_time);
        console.log(sunset_time);
        setsunrise(sunrise_time);
        setsunset(sunset_time);
        setspeed(wind_speed);
        setdegree(wind_degree);
        // console.log(weatherId);
        console.log(id);
        console.log(weatherId);
        console.log(hours);
        // setIcon(id);
        let w_icon = null;
      if (id >= 200 && id < 300 && hours<=19 && hours>=5) {
        w_icon = thunderstorm;
      } else if (id >= 300 && id < 500 && hours<=19 && hours>=5) {
        w_icon = rainy;
      } else if (id >= 500 && id < 600 && hours<=19 && hours>=5) {
        w_icon = rainy;
      } else if (id >= 600 && id < 700 && hours<=19 && hours>=5) {
        w_icon = thunderstorm;
      } else if (id >= 700 && id < 800 && hours<=19 && hours>=5) {
        w_icon = haze;
      } else if (id === 800 && hours<=19 && hours>=5) {
        w_icon = sunny;
      } else if (id > 800 && hours<=19 && hours>=5) {
        w_icon = cloudyday;
      } else if (id >= 300 && id < 500) {
        w_icon = laterain;
      } else if (id >= 500 && id < 600) {
        w_icon = laterain;
      } else if (id >= 600 && id < 700) {
        w_icon = thunderstorm;
      } else if (id >= 700 && id < 800) {
        w_icon = latehaze;
      } else if (id === 800) {
        w_icon = cleannight;
      } else if (id > 800) {
        w_icon = cloudynight;
      }

      setIcon(w_icon);
      }
      else{
        setIcon(partiallycloudy);
      }
      // console.log(setIcon);
    };

    fetchApi();
  }, [search]);

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

      <div className="weatherCardContainer" style={{textAlign: 'center'}}>
        <div className="weatherCard" style={{backgroundImage: `url(${weatherIcon})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
          <div className="input">
            <input
              type="search"
              className="inputField"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </div>
          {!city ? (
            <p></p>
          ) : (
            <div className="info">
              <h1 className="loc">{search}</h1>
              <h2 className="temp">🌡️ {city.temp} °C</h2>
              <h3 className="othertemp">
                Min : {city.temp_min} <span className="tab">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Max : {city.temp_max}
              </h3>
              <h4>Humidity : {city.humidity} </h4>
              <h4>Pressure : {city.pressure}</h4>
              <h4 style={{color: 'orange'}}> 🌅 Sunrise : {sunrisetime} AM</h4>
              <h4 style={{color: 'orange'}}> 🌇 Sunset : {sunsettime} PM</h4>
              <h4> 🌫️ Wind Speed : {speed} </h4>
              <h4> 🧭 Wind Degree : {degree} </h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WeatherApp;
