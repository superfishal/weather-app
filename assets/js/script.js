// grabs form input from HTML page
var citySearchForm = document.getElementById("citySearchForm");
var citySearchName;
// empty array for previous city searches
var citySearches = [];
// submit event listener (enter or button click) on citySearchForm
citySearchForm.addEventListener("submit", function (event) {
  // prevents page reloading on submit
  event.preventDefault();
  // console logs search input from user
  console.log(event.target.children[0].value.trim());
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
    });
}

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
  $("#current-uv").text("UV Index: " + dataWeather.current.uvi);
}
function displayForecast(dataWeather) {
  dataForecast = dataWeather.daily;
  $("#date-icon")
    .text(dayjs(dataForecast[1].dt * 1000).format("MM/DD/YYYY"))
    .append(
      `<img src="https://openweathermap.org/img/wn/${dataForecast[1].weather[0].icon}.png"></img>`
    );
  $("#forecast-temp").text("Temp: " + dataForecast[1].temp.day + "°F");
  $("#forecast-wind").text("Wind: " + dataForecast[1].wind_speed + "mph");
  $("#forecast-humidity").text("Humidity: " + dataForecast[1].humidity + "%");
}
// for (i=1; i <=5; i++) {}
//  OR
//  $.each(dataForecast, function(i) {
//     var templateString = '<article class="card"><h2>' + dataForecast[i].category + '</h2><p>' + dataForecast[i].name + '</p><p>' + dataForecast[i].id + '</p><button class="alertButton">Start</button></article>';
//     $('#test12').append(templateString);
//   })
// for loop up to 5 in the Array generate a brand new card and use template literals
// for each item in the array.

// const $animalForm = document.querySelector('#animals-form');
// const $displayArea = document.querySelector('#display-area');

// const printResults = resultArr => {
//   console.log(resultArr);

//   const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
//     return `
//   <div class="col-12 col-md-5 mb-3">
//     <div class="card p-3" data-id=${id}>
//       <h4 class="text-primary">${name}</h4>
//       <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
//       Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
//       Personality Traits: ${personalityTraits
//         .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
//         .join(', ')}</p>
//     </div>
//   </div>
//     `;
//   });

//   $displayArea.innerHTML = animalHTML.join('');
// };

// const getAnimals = (formData = {}) => {
//   let queryUrl = '/api/animals?';

//   Object.entries(formData).forEach(([key, value]) => {
//     queryUrl += `${key}=${value}&`;
//   });

//   console.log(queryUrl);

// };
