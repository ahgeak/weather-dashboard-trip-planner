// Psudo code:
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
var historyContainer = document.querySelector("#history");
var forecastWeatherContainer = document.querySelector("#forecast");
var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];
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
      return response.json();
    })
    .then(function (data) {
      var latitude = data[0].lat;
      var longitude = data[0].lon;
      fetchWeather(latitude, longitude);
      fetchForecast(latitude, longitude);
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
      return response.json();
    })
    .then(function (data) {
      currentWeatherContainer.innerHTML = "";
      var cityNameEl = document.createElement("h2");
      var currentDate = dayjs().format("M/D/YYYY"); //use DayJS
      // console.log(currentDate);
      // var currentDate = new Date(data.dt * 1000).toLocaleDateString();

      cityNameEl.textContent = `${data.name} (${currentDate})`;
      currentWeatherContainer.append(cityNameEl);

      var currentTemp = data.main.temp;
      var currentWind = data.wind.speed;
      var currentHumidity = data.main.humidity;

      var iconcode = data.weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

      document.querySelector("#icon").setAttribute("src", iconurl);
      document.querySelector(
        "#temperature"
      ).textContent = `Temp: ${currentTemp}°F`;
      document.querySelector("#wind").textContent = `Wind: ${currentWind} MPH`;
      document.querySelector(
        "#humidity"
      ).textContent = `Humidity: ${currentHumidity}%`;

      saveToStorage(data.name);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchForecast(lat, lon) {
  var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?";
  var forecastApi = `${forecastUrl}lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  console.log(forecastApi);

  fetch(forecastApi)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data.list);
      // console.log(data.list[2].dt_txt);
      displayForecast(data.list);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function displayForecast(dailyForecast) {
  var startDate = dayjs().add(1, "day").startOf("day").unix();
  var endDate = dayjs().add(6, "day").startOf("day").unix();
  // use DayJS instead of new Date

  // next I need to get the 5 day forecast to display on the screen
  for (var i = 0; i < dailyForecast.length; i++) {
    if (dailyForecast[i].dt > startDate && dailyForecast[i].dt < endDate) {
      if (dailyForecast[i].dt_txt.slice(11, 13) === "12") {
        // console.log(dailyForecast[i]);
        createForecastCard(dailyForecast[i]);
      }
    }
  }
}

function createForecastCard(forecast) {
  // console.log(forecast.dt_txt);
  var day = dayjs(forecast.dt_txt).format("dddd");
  // console.log(day);

  var iconCode = forecast.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  var forecastTemp = forecast.main.temp;
  var forecastWind = forecast.wind.speed;
  var forecastHumidity = forecast.main.humidity;

  var cardContainerEl = document.createElement("div");
  var cardEl = document.createElement("div");
  var cardBodyEl = document.createElement("div");
  var titleEl = document.createElement("h4");
  var iconEl = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");

  cardContainerEl.append(cardEl);
  cardEl.append(cardBodyEl);
  cardBodyEl.append(titleEl, iconEl, tempEl, windEl, humidityEl);

  titleEl.textContent = day;
  iconEl.setAttribute("src", iconUrl);
  tempEl.textContent = `Temp: ${forecastTemp}°F`;
  windEl.textContent = `Wind: ${forecastWind} MPH`;
  humidityEl.textContent = `Humidity: ${forecastHumidity}%`;

  // cardContainerEl.setAttribute("class", "row");
  // cardEl.setAttribute("class", "col");

  forecastWeatherContainer.append(cardContainerEl);
}

function saveToStorage(city) {
  // need to save the cities that the user types in into local storage
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    
    // history.innerHTML = "";
    var historyEl = document.createElement("div");
    var titleEl = document.createElement("button");
    historyEl.append(titleEl);
    titleEl.textContent = city;
    // console.log(city);
    historyContainer.append(historyEl);
    return titleEl.value;
  }
}

// function searchButtonClicked(citySearched) {
//   var city = userInput.value;
//   fetchGeocode(citySearched);
// }

searchBtn.addEventListener("click", start);
// historyContainer.addEventListener("click", searchButtonClicked(titleEl.value));