// grabs form input from HTML page
var citySearchForm = document.getElementById("citySearchForm");
var citySearchName;
const deleteButtonEl = document.getElementById("delete-btn");
// empty array for previous city searches
var citySearches = JSON.parse(localStorage.getItem("Search History")) || [];
// submit event listener (enter or button click) on citySearchForm
citySearchForm.addEventListener("submit", function (event) {
  // prevents page reloading on submit
  event.preventDefault();
  // passes the input to and runs getCoords function
  getCoords(event.target.children[0].value.trim());
  $("#citySearchInput").val("");
  $("div").removeClass("hide");
});
// input from citySearchForm
function getCoords(citySearch) {
  // fetching geographical API with city search input
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${citySearch}&limit=1&appid=2dae66028d1538a64d259cd639a030f5`
  )
    // returns promise that resolves with a HTTP response
    .then(function (response) {
      // extracts JSON body content
      return response.json();
    })
    // returns second promise that resolves with the result of parsing the response body text as JSON.
    .then(function (dataCoords) {
      // console logs JSON content
      console.log(dataCoords);
      // passes latitude and longitude of the first city searched to getWeather
      getWeather(dataCoords[0].lat, dataCoords[0].lon);
      // console logs name from JSON content
      console.log(dataCoords[0].name);
      // setting city name globally
      citySearchName = dataCoords[0].name;
      // checks if name it citySearches doesn't already exist
      if (citySearches.indexOf(dataCoords[0].name) === -1) {
        // pushes name to array
        citySearches.push(dataCoords[0].name);
        // sets local storage key: Search History and value to stringified citySearches array
        localStorage.setItem("Search History", JSON.stringify(citySearches));
      }
    });
}
// takes passed JSON lat, lon data
function getWeather(lat, lon) {
  // fetches One Call Weather API with latitude and longitude
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=2dae66028d1538a64d259cd639a030f5`
  )
    // fetch response for weather data into JSON
    .then(function (response) {
      return response.json();
    })
    .then(function (dataWeather) {
      // console logs API weather data
      console.log(dataWeather);
      displayWeather(dataWeather);
      displayForecast(dataWeather);
      renderSearchHistory();
    });
}

const uvElement = document.getElementById("current-uv");

function displayWeather(dataWeather) {
  $("#cityNameEl")
    .text(
      citySearchName +
        " (" +
        dayjs(dataWeather.current.dt * 1000).format("MM/DD/YY") +
        ") "
    )
    .append(
      `<img src="https://openweathermap.org/img/wn/${dataWeather.current.weather[0].icon}@2x.png"></img>`
    );

  $("#current-temp").text("Temperature: " + dataWeather.current.temp + "°F");
  $("#current-humidity").text(
    "Humidity: " + dataWeather.current.humidity + "%"
  );
  $("#current-wind").text(
    "Wind Speed: " + dataWeather.current.wind_speed + " mph"
  );
  console.log(uvElement);

  function getUVColor() {
    if (dataWeather.current.uvi < 3) {
      return "green";
    } else if (dataWeather.current.uvi < 6) {
      return "yellow";
    } else if (dataWeather.current.uvi < 8) {
      return "orange";
    } else if (dataWeather.current.uvi < 11) {
      return "red";
    } else {
      return "purple";
    }
  }
  uvElement.innerHTML = `UV Index: <span class="${getUVColor(
    dataWeather.current.uvi
  )}">${dataWeather.current.uvi}</span>`;

  // $("#current-uv").text("UV Index: " + dataWeather.current.uvi);
}

const forecastCardsContainer = document.getElementById(
  "forecast-cards-container"
);
function displayForecast(dataWeather) {
  forecastCardsContainer.innerHTML = "";
  for (i = 1; i <= 5; i++) {
    const day = dataWeather.daily[i];
    const dayCard = document.createElement("div");
    dayCard.classList.add("card", "m-3");
    dayCard.style.width = "18rem";
    dayCard.innerHTML = `<p id="date-icon" class="card-header">${new Date(
      day.dt * 1000
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
    <img src="https://openweathermap.org/img/wn/${
      day.weather[0].icon
    }.png"></img>
    <ul class="list-group list-group-flush">
      <li id="forecast-temp" class="list-group-item">Temp: ${day.temp.day}</li>
      <li id="forecast-wind" class="list-group-item">Wind: ${
        day.wind_speed
      }</li>
      <li id="forecast-humidity" class="list-group-item">
        Humidity: ${day.humidity}
      </li>
    </ul>`;
    forecastCardsContainer.appendChild(dayCard);
  }
}
const searchHistoryElement = document.getElementById("search-history");
function renderSearchHistory() {
  searchHistoryElement.innerHTML = "";
  console.log(JSON.parse(localStorage.getItem("Search History")));
  if (citySearches.length === 0) {
    return;
  }

  citySearches.forEach((cityName) => {
    const cityButtonEl = document.createElement("button");
    cityButtonEl.classList.add("list-group-item", "list-group-item-action");
    cityButtonEl.innerText = cityName;
    cityButtonEl.addEventListener("click", () => {
      getCoords(cityName);
      $("#citySearchInput").val("");
      $("div").removeClass("hide");
    });
    searchHistoryElement.appendChild(cityButtonEl);
  });
}
deleteButtonEl.addEventListener("click", () => {
  localStorage.removeItem("Search History");
  citySearches = [];
  renderSearchHistory();
});
renderSearchHistory();
