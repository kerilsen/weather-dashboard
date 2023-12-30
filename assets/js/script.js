$(document).foundation();


const lat = "52.1097594";
const lat2 = "51.509865";
const lon = "-106.5539789";
const lon2 = "0.118092";

const openWeatherEndpoint = `https://api.openweathermap.org/data/3.0/onecall?lat2=${lat}&lon=${lon}&appid=${API_key}`;
const demoEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=a91de93fc5fcff0a9d6b724ff2c97849`;

const openWeather5Day = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
const currentWeather = document.getElementById('currentWeather');
const searchButton = document.getElementById('searchCity');

searchButton.addEventListener("click", function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const cityEl = document.getElementById("inputCity");
    const city = cityEl.value;
    console.log("city input is " + city);
    const geocodingEndpoint = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`;
    fetch(geocodingEndpoint)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })

    console.log("button clicked");

    /* fetch(openWeather5Day)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            // work with all data in here
            console.log(data);
            const cityName = data.city.name;
            console.log(cityName);
            const fiveDay = data.list;

            fiveDay.forEach(item => {
                // work with each item here
                console.log(item);
            })

        })
        .catch(error => console.error('Error fetching data from Open Weather API:', error));*/
});
