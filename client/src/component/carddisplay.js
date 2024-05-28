import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CardDisplay() {
  const navigate = useNavigate();
  const [cityname, setCityname] = useState('');
  const [message, setMessage] = useState('');
  const [cities, setCities] = useState([]);
  const [citytemp, setcitytemp] = useState('');
  const [citymintemp, setcitymintemp] = useState('');
  const [citymaxtemp, setcitymaxtemp] = useState('');
  const [cityIcons, setCityIcons] = useState({});
  const [cityhum, setcityhum] = useState('');
  const [citypressure, setcitypressure] = useState('');
  const [citynames, setcitynames] = useState('');
  const [cityweather, setcityweather] = useState('');


  const fetchCitiesData = async () => {
    try {
      const response = await fetch(`/api/cities?email=${localStorage.getItem('user')}`);
      const data = await response.json();
      console.log(data);
      const citynames = data.map(city => city.cityname);
      console.log(citynames);
      citynames.forEach(async (cityname) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=5742cc42b5c06616dc61ea777dd3b089`;
        const resp = await fetch(url);
        if (!resp.ok) {
          alert(`No weather data found for city: ${cityname}`);
          return;
        }
        const respJson = await resp.json();
        console.log(respJson.main);
        const temperature = respJson.main.temp;
        const humidity = respJson.main.humidity;
        const pressure = respJson.main.pressure;
        const min_temp = respJson.main.temp_min;
        const max_temp = respJson.main.temp_max;
        const name = respJson.name;
        const obj = respJson;
        const timestamp = obj.dt;
        const timezoneOffsetInSeconds = obj.timezone; 
        const localDateTime = new Date((timestamp + timezoneOffsetInSeconds) * 1000);
        const dstOffset = localDateTime.getTimezoneOffset() * 60 * 1000;
        const adjustedDateTime = new Date(localDateTime.getTime() + dstOffset);
        const weath = respJson.weather[0].main;
        console.log(weath);
        console.log(adjustedDateTime);
        const hours = adjustedDateTime.getHours();
        console.log(hours);
        console.log(name);
        console.log(temperature);
        console.log(respJson.weather[0].id);
        const weatherIcon = getWeatherIcon(respJson.weather[0].id, hours);
      
        setcitytemp(prevState => ({
          ...prevState,
          [cityname]: temperature
        }));
        setcityhum(prevState => ({
          ...prevState,
          [cityname]: humidity
        }));
        setcitypressure(prevState => ({
          ...prevState,
          [cityname]: pressure
        }));
        setcitymintemp(prevState => ({
          ...prevState,
          [cityname]: min_temp
        }));
        setcitymaxtemp(prevState => ({
          ...prevState,
          [cityname]: max_temp
        }));
        setCityIcons(prevState => ({
          ...prevState,
          [cityname]: weatherIcon
        }));
        setcityweather(prevState => ({
          ...prevState,
          [cityname]: weath
        }));
        setcitynames(prevState => ({
          ...prevState,
          [cityname]: name
        }));

      });
      
    //   const url = `http://api.openweathermap.org/data/2.5/weather?q=${data.cityname}&units=metric&appid=5742cc42b5c06616dc61ea777dd3b089`;
    //   const resp = await fetch(url);
    //   const respJson = await resp.json();
    //   setCity(respJson.main);
    // console.log(respJson.main);
      setCities(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getWeatherIcon = (id, hrs) => {
    if (id >= 200 && id < 300) {
      return thunderstorm;
    } else if (id >= 300 && id < 500 && hrs<=19 && hrs>=5) {
      return rainy;
    } else if (id >= 500 && id < 600 && hrs<=19 && hrs>=5) {
      return thunderstorm;
    } else if (id >= 600 && id < 700 && hrs<=19 && hrs>=5) {
      return thunderstorm;
    } else if (id >= 700 && id < 800 && hrs<=19 && hrs>=5) {
      return haze;
    } else if (id === 800 && hrs<=19 && hrs>=5) {
      return sunny;
    } else if (id === 800) {
      return cleannight;
    } else if (id > 800 && hrs<=19  && hrs>=5) {
      return cloudyday;
    } else if(id > 800) {
      return cloudynight;
    } else if (id >= 300 && id < 500) {
      return laterain;
    } else if (id >= 500 && id < 600) {
      return laterain;
    } else if (id >= 600 && id < 700) {
      return thunderstorm;
    } else if (id >= 700 && id < 800) {
      return latehaze;
    } else {
      return partiallycloudy;
    }
  };
  

  useEffect(() => {
    fetchCitiesData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = localStorage.getItem('user');
    if (!email) {
      console.log('No user found');
      return; // Return early if no user is found in local storage
    }

    fetch('/api/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, cityname }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log('adding city');
        setMessage('');
        // Fetch the updated city list after adding a new city
        fetchCitiesData();
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('An error occurred while adding the city');
      });
  };

  const handleDeleteCity = (cityname) => {
    console.log(`Deleting city: ${cityname}`);
    fetch(`/api/cities/${cityname}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchCitiesData(); // Fetch updated city data after deletion
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToSignup = () => {
    navigate('/register');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToCard = () => {
    navigate('/carddisplay');
  };

  const shouldDisplayLoginButton = () => {
    return !localStorage.getItem('user');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
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
            <a href="/" onClick={navigateToCard}>
              Weather
            </a>
          </li>
          
          <li className="navbar-buttons" style={{marginLeft: '1030px'}}>
            {shouldDisplayLoginButton() ? (
              <div className="zipcodeInput">
                <button onClick={navigateToLogin}>Login</button>
                <button onClick={navigateToSignup}>Signup</button>
              </div>
            ) : (
              <div className="zipcodeInput">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </div>
          <div className='addcity'>
          <div>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter City Name" value={cityname} onChange={(e) => setCityname(e.target.value)} />
              <button type="submit">Add City</button>
            </form>
            <p>{message}</p>
            </div>
          </div>
        <div className='cardelse'>
        <div className="weathercard">
          {Array.isArray(cities) && cities.length > 0 ? (
            cities.map((city) => (
              <div className="card" style={{backgroundImage: `url(${cityIcons[city.cityname]})`}} key={city._id}>
                <div className="card-body" >
                  <h2 className="card-title">{citynames[city.cityname]}<a className='deletionlink' href="#" onClick={() => handleDeleteCity(city.cityname)}>-</a></h2>
                  <h2 className="card-title">{citytemp[city.cityname]}°C</h2>
                  <h3 className="card-title">{cityweather[city.cityname]}</h3>
                  <div className="bar-wrapper">
                  <h5>{citymintemp[city.cityname]}°C</h5>
                    <div className="bar" style={{ "--value": `${citymaxtemp[city.cityname]}%` }}></div>
                  <h5 style={{marginLeft: '10px'}}>{citymaxtemp[city.cityname]}°C</h5>
                  </div>
                  {/* <div className="bar-wrapper">
                    <h5>{citymintemp[city.cityname]}</h5>
                    <div className="bar" style={{ "--value": `${citymintemp[city.cityname]}%` }}></div>
                  </div> */}
                  <div className="bar-wrapper">
                    <h5>{cityhum[city.cityname]} Humidity</h5>
                    <div className="bar" style={{ "--value": `${cityhum[city.cityname]}%` }}></div>
                  </div>

                  <div className="bar-wrapper">
                    <h5>{citypressure[city.cityname]} Pressure</h5>
                    <div className="bar" style={{ "--value": `${citypressure[city.cityname]}%` }}></div>
                  </div>
                  
                </div>
              </div>
            ))
          ) : (
            <p>No cities found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default CardDisplay;
