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
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
var enteredCityLat = "47.6038321"; // get this from geocode API
var enteredCityLon = "-122.330062"; // get this from geocode API

var currentWeatherApi = `${weatherUrl}lat=${enteredCityLat}&lon=${enteredCityLon}&appid=${weatherApiKey}`
console.log(currentWeatherApi);

// geocode API documentation: https://openweathermap.org/api/geocoding-api
// API call link: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
var enteredCity = "seattle"; // get this from the city input section
var enteredState = "wa";
var countryCode = "us";

var geocodeApi = `${geocodeUrl}${enteredCity},${enteredState},${countryCode}&limit=5&appid=${weatherApiKey}`

// forecast API documentation: https://openweathermap.org/forecast16
// API call link: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?";

var forecastApi = `${forecastUrl}lat=${enteredCityLat}&lon=${enteredCityLon}&appid=${weatherApiKey}`
console.log(forecastApi);

var longitude;
var latitude;

function fetchGeocode(){
    fetch(geocodeApi)
        .then (function(response) {
            // console.log(response);
            return response.json();
        })
        .then (function (data) {
            // console.log(data);
            latitude = data[0].lat;
            // console.log(latitude);
            longitude = data[0].lon
            // console.log(longitude);
            return latitude, longitude;
        })
        .catch(function (err) {
            console.error(err);
        });
}
console.log("this is the lat " + latitude); // this comes back undefined

var currentDate; // I need to figure out how to do the date element
var currentTemp;
var currentWind;
var currentHumidity;

function fetchWeather(){
    fetch(currentWeatherApi)
        .then (function(response) {
            // console.log(response);
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            currentTemp = data.main.temp;
            console.log(currentTemp); //Why is this 280 degrees?
            currentWind = data.wind.speed;
            console.log(currentWind);
            console.log(data.weather[0].icon) //Not sure if this can connect to icon later? Need to research
            currentHumidity = data.main.humidity;
            console.log(currentHumidity);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function fetchForecast(){
    fetch(forecastApi)
        .then (function(response) {
            // console.log(response);
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            // next I need to get the 5 day forecast to display on the screen
        })
        .catch(function (err) {
            console.error(err);
        });
}

fetchGeocode();

fetchWeather();

fetchForecast();

function currentWeather() {
}

function fiveDayForecast() {
}

function initializePage () {
}

function clearForecast (){
}