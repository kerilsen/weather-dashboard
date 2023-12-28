$(document).foundation();
const API_key = "dc9ecf3a826a9bf23eb9e0e35c3b2ca8";
const lat = "52.1097594";
const long = "-106.5539789";

const openWeatherEndpoint = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_key}";
const currentWeather = document.getElementById('currentWeather');
const searchButton = document.getElementById('searchCity');

searchButton.addEventListener("click", function () {
    fetch(openWeatherEndpoint)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // work with all data in here
            console.log(data);

            data.forEach(item => {
                // work with each item here
                console.log(item);
            })
        })
        .catch(error => console.error('Error fetching data from Open Weather API:', error));
});
