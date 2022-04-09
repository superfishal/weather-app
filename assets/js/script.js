// grabs form input from HTML page
var citySearchForm = document.getElementById("citySearchForm");
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
    .then(function (data) {
      // console logs JSON content
      console.log(data);
      // passes latitude and longitude of the first city searched to getWeather
      getWeather(data[0].lat, data[0].lon);
      // console logs name from JSON content
      console.log(data[0].name);
      // checks if name it citySearches doesn't already exist
      if (citySearches.indexOf(data[0].name) === -1) {
        // pushes name to array
        citySearches.push(data[0].name);
        // sets local storage key: Search History and value to stringified citySearches array
        localStorage.setItem("Search History", JSON.stringify(citySearches));
      }
    });
}
// takes passed JSON lat, lon data
function getWeather(lat, lon) {
  // fetches One Call Weather API with latitude and longitude
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=2dae66028d1538a64d259cd639a030f5`
  )
    // fetch response for weather data into JSON
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console logs API weather data
      console.log(data);
    });
}
