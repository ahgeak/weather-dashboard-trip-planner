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

var longitude;
var latitude

function fetchGeocode(){
    fetch(geocodeApi)
        .then (function(response) {
            console.log(response);
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            latitude = data[0].lat;
            console.log(latitude);
            longitude = data[0].lon
            console.log(longitude);
            return latitude, longitude;
        })
        .catch(function (err) {
            console.error(err);
        });
}

function fetchWeather(){
    fetch(currentWeatherApi)
        .then (function(response) {
            console.log(response);
            return response.json();
        })
        .then (function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.error(err);
        });
}

console.log("this is the lat " + latitude); // this comes back undefined

fetchGeocode();

fetchWeather();

function currentWeather() {
}

function fiveDayForecast() {
}

function initializePage () {
}

function clearForecast (){
}