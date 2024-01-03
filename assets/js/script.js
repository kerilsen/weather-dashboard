$(document).foundation();

$(function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const unit = "metric";
    const id = "5327684"; // city id for Berkeley
    $('#currentDay').text(dayjs().format('dddd, MMMM DD'));
    console.log(dayjs().format('dddd, MMMM DD'));

    const searchButton = document.getElementById('searchCity');

    function saveCity(x) {
        let city = x;
        $('#cityName').text(city);
        let storedCities = JSON.parse(localStorage.getItem("city")) || [];
        storedCities.push(x);
        let cityList = document.getElementById('history');
        storedCities.forEach(item => {
            let pastCity = document.createElement('li');
            pastCity.classList.add("list-group-item");
            pastCity.textContent = item.city;
            console.log("item.city is " + item.city);
            cityList.appendChild(pastCity);
        })
        localStorage.setItem("city", JSON.stringify(storedCities));
    };

    function getCurrent(x, y) {
        let lat = x;
        let lon = y;
        const openWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${unit}`;
        fetch(openWeatherCurrent)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                $('#currentTemp').text(Math.round(data.main.temp) + "°");
                $('#currentWind').text(Math.round(data.wind.speed) + " mph");
                $('#currentHumidity').text(data.main.humidity + "%");
                let icon = data.weather[0].icon;
                console.log("weather icon is " + icon);
                console.log(`img src = "https://openweathermap.org/img/wn/${icon}@2x.png"`);
                let iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                $('#currentIcon').src = iconURL;
                $('#currentIcon').alt = "not working";
                console.log(data);
            })
    };

    function getForecast(x, y) {
        let lat = x;
        let lon = y;
        const openWeather5Day = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=${unit}`;
        fetch(openWeather5Day)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                $('#sunrise').text(dayjs.unix(data.city.sunrise).format("h:mm a"));
                $('#sunset').text(dayjs.unix(data.city.sunset).format("h:mm a"));
                console.log(data);

                $('#day1').text(dayjs.unix(data.list[4].dt).format("ddd MMM D"));
                $('#day1temp').text(Math.round(data.list[4].main.temp) + "°");
                $('#day1Wind').text(Math.round(data.list[4].wind.speed) + " mph");
                $('#day1Humidity').text(`${data.list[4].main.humidity}%`);

                $('#day2').text(dayjs.unix(data.list[12].dt).format("ddd MMM D"));
                $('#day2temp').text(Math.round(data.list[12].main.temp) + "°");
                $('#day2Wind').text(Math.round(data.list[12].wind.speed) + " mph");
                $('#day2Humidity').text(`${data.list[12].main.humidity}%`);

                $('#day3').text(dayjs.unix(data.list[20].dt).format("ddd MMM D"));
                $('#day3temp').text(Math.round(data.list[20].main.temp) + "°");
                $('#day3Wind').text(Math.round(data.list[20].wind.speed) + " mph");
                $('#day3Humidity').text(`${data.list[20].main.humidity}%`);

                $('#day4').text(dayjs.unix(data.list[28].dt).format("ddd MMM D"));
                $('#day4temp').text(Math.round(data.list[28].main.temp) + "°");
                $('#day4Wind').text(Math.round(data.list[28].wind.speed) + " mph");
                $('#day4Humidity').text(`${data.list[28].main.humidity}%`);

                $('#day5').text(dayjs.unix(data.list[36].dt).format("ddd MMM D"));
                $('#day5temp').text(Math.round(data.list[36].main.temp) + "°");
                $('#day5Wind').text(Math.round(data.list[36].wind.speed) + " mph");
                $('#day5Humidity').text(`${data.list[36].main.humidity}%`);
            })
    };

    searchButton.addEventListener("click", function () {
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

                data.forEach(city => {

                    saveCity(city.name);
                    console.log(city);
                    const lat = city.lat;
                    const lon = city.lon;
                    getCurrent(lat, lon);
                    getForecast(lat, lon);
                })
            })
            .catch(error => console.error('Error fetching data from Open Weather API:', error));
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
        */
});
