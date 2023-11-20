// current weather API documentation: https://openweathermap.org/current#name
// geocode API documentation: https://openweathermap.org/api/geocoding-api
// // forecast API documentation: https://openweathermap.org/forecast16

// Global variables
var weatherApiKey = "83bc9be355d058eefcfe18d969db5d21";
var searchBtn = document.querySelector("#search");
var userInput = document.querySelector("#input");
var currentWeatherContainer = document.querySelector("#current");
var historyContainer = document.querySelector("#history");
var forecastWeatherContainer = document.querySelector("#forecast");
var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

// Start funciton takes the user input and passes city into API fetch function
function start() {
  var city = userInput.value;
  fetchGeocode(city);
}

// fetchGeocode uses the inputed city to get the longitude and lattidue and pass thoses into the Weather and Forecast APIs
function fetchGeocode(city) {
  var geocodeUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
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

// fetchWeaher will take the latitude and longitude into the WeatherAPI and display that on the page
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
      var currentTemp = data.main.temp;
      var currentWind = data.wind.speed;
      var currentHumidity = data.main.humidity;
      var iconcode = data.weather[0].icon;
      var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";

      // Display the searched city on the page, update the HTML elements with the temp, wind, humidity and icon
      cityNameEl.textContent = `${data.name} (${currentDate})`;
      currentWeatherContainer.append(cityNameEl);

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

// fetchForecast is passed in lat and lon to get the 5 day forecast data to pass into displayForecast function
function fetchForecast(lat, lon) {
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  var forecastApi = `${forecastUrl}lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  fetch(forecastApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayForecast(data.list);
    })
    .catch(function (err) {
      console.error(err);
    });
}

// displayForecast will take the data from the forecastAPI and use DayJS to display the data on the page
function displayForecast(dailyForecast) {
  var startDate = dayjs().add(1, "day").startOf("day").unix();
  var endDate = dayjs().add(6, "day").startOf("day").unix();

  // This for loop will take the length of dailyForecast to iterate through
  for (var i = 0; i < dailyForecast.length; i++) {
    // This if statement will determine if the current date is within the range of the 5 days to be displayed
    if (dailyForecast[i].dt > startDate && dailyForecast[i].dt < endDate) {
      // This if statment will ensure that only the data for the noon forecast is displayed to prevent repeat days
      if (dailyForecast[i].dt_txt.slice(11, 13) === "12") {
        createForecastCard(dailyForecast[i]);
      }
    }
  }
}

// createForecastCard function will create the cards for each of the 5-day forecast cards
function createForecastCard(forecast) {
  var day = dayjs(forecast.dt_txt).format("dddd");
  var iconCode = forecast.weather[0].icon;
  var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
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

  // cardContainerEl.setAttribute("class", "col");
  // cardEl.setAttribute("class", "col");

  cardContainerEl.setAttribute(
    "class",
    "border border-primary rounded m-1 border-5 text-center"
  );
  forecastWeatherContainer.append(cardContainerEl);
}

// saveToStorage will save the searched cities to localStorage and display the city names on the screen with a button
function saveToStorage(city) {
  if (!searchHistory.includes(city)) {
    // Sets the searched items to local storage
    searchHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(searchHistory));

    // Displays the searched city buttons on the screen
    var historyEl = document.createElement("div");
    var titleEl = document.createElement("button");
    historyEl.append(titleEl);
    titleEl.textContent = city;

    // titleEl.setAttribute("class", "btn btn-secondary m-2");
    // console.log(city);
    historyContainer.append(historyEl);
  }
}

// This function is to call the searched cities back
// function searchButtonClicked(citySearched) {
//   var city = userInput.value;
//   fetchGeocode(citySearched);
// }

searchBtn.addEventListener("click", start);
// historyContainer.addEventListener("click", searchButtonClicked(titleEl.value));
