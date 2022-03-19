var citySearchForm = document.getElementById("citySearchForm");
var citySearches = [];
citySearchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(event.target.children[0].value);
  getCoords(event.target.children[0].value);
});

function getCoords(citySearch) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${citySearch}&limit=1&appid=2dae66028d1538a64d259cd639a030f5`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (banana) {
      getWeather(banana[0].lat, banana[0].lon);
      console.log(banana[0].name);
      if (citySearches.indexOf(banana[0].name) === -1) {
        citySearches.push(banana[0].name);
        localStorage.setItem("Search History", JSON.stringify(citySearches));
      }
    });
}

function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=2dae66028d1538a64d259cd639a030f5`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
