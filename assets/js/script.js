function getCoords() {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=Springfield&limit=1&appid=2dae66028d1538a64d259cd639a030f5"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (banana) {
      getWeather(banana[0].lat, banana[0].lon);
      console.log(banana[0].name);
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
getCoords();
