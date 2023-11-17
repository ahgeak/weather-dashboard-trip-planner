// Psudo code:
// array to store icons (do this last, not MVP)
// Get user input using event listener this will call currentWeather and fiveDayForecast functions maybe clearForecast
// pass user input into API to fetch data
// display current weather data
// update and create HTML elements based on 5 day weather forecast
// Local storage to save a search history.
// when save city is clicked update HTML elements on the page

// current weather API documentation: https://openweathermap.org/current#name
// API call link: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
var weatherApiKey = "83bc9be355d058eefcfe18d969db5d21";

var searchBtn = document.querySelector("#search");
var userInput = document.querySelector("#input");
var currentWeatherContainer = document.querySelector("#current");
var searchHistory = JSON.parse(localStorage.getItem('cities')) || []
// geocode API documentation: https://openweathermap.org/api/geocoding-api
// API call link: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// // forecast API documentation: https://openweathermap.org/forecast16
// // API call link: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?";

// var forecastApi = `${forecastUrl}lat=${enteredCityLat}&lon=${enteredCityLon}&appid=${weatherApiKey}`
// console.log(forecastApi);

function start() {
  var city = userInput.value;
  fetchGeocode(city);
}

function fetchGeocode(city) {
  var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";

  var geocodeApi = `${geocodeUrl}${city}&limit=5&appid=${weatherApiKey}`;
  fetch(geocodeApi)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      var latitude = data[0].lat;
      // console.log(latitude);
      var longitude = data[0].lon;
      // console.log(longitude);
      fetchWeather(latitude, longitude);
    })
    .catch(function (err) {
      console.error(err);
    });
}
// console.log("this is the lat " + latitude); // this comes back undefined

function fetchWeather(lat, lon) {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

  fetch(weatherUrl)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
        currentWeatherContainer.innerHTML = ''
      var cityNameEl = document.createElement("h2");

      cityNameEl.textContent = data.name;

      currentWeatherContainer.append(cityNameEl);
      console.log(data);
      var currentDate = new Date(data.dt * 1000).toLocaleDateString();
      var currentTemp = data.main.temp;

      var iconcode = data.weather[0].icon;
      console.log(currentTemp); //Why is this 280 degrees?
      var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

      //    document.querySelector('#icon').setAttribute('src', iconurl)

      // currentWind = data.wind.speed;
      // console.log(currentWind);
      // console.log(data.weather[0].icon) //Not sure if this can connect to icon later? Need to research
      // currentHumidity = data.main.humidity;
      // console.log(currentHumidity);
      saveToStorage(data.name)
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchForecast() {
  fetch(forecastApi)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // next I need to get the 5 day forecast to display on the screen
    })
    .catch(function (err) {
      console.error(err);
    });
}

function saveToStorage(city){
// need to save the cities that the user types in into local storage
if(!searchHistory.includes(city)){
    searchHistory.push(city)
    localStorage.setItem('cities', JSON.stringify(searchHistory))

}

}

searchBtn.addEventListener("click", start);
