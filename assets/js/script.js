$(document).foundation();

$(function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const unit = "metric";
    $('#currentDay').text(dayjs().format('dddd, MMMM DD'));
    console.log(dayjs().format('dddd, MMMM DD'));

    const currentWeather = document.getElementById('currentWeather');
    const searchButton = document.getElementById('searchCity');

    function saveCity(x) {
        let city = x;
        $('#cityName').text(city);
        localStorage.setItem("city", city);
        // retrieve from local storage
        // append item to array
        // send to local storage
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
                $('#currentTemp').text(data.main.temp);
                $('#currentWind').text(data.wind.speed);
                $('#currentHumidity').text(data.main.humidity);
                let icon = data.weather[0].icon;
                console.log("weather icon is " + icon);
                console.log(`img src = "https://openweathermap.org/img/wn/${icon}@2x.png"`);
                $('#currentIcon').src = `"https://openweathermap.org/img/wn/${icon}@2x.png"`
                console.log(data);
                /*   $('#day1temp').text(data.list[0].main.temp);
                   $('#day2temp').text(data.list[1].main.temp);
                   $('#day3temp').text(data.list[2].main.temp);
                   $('#day4temp').text(data.list[3].main.temp);
                   $('#day5temp').text(data.list[4].main.temp);*/
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
                let rise = new Date(data.city.sunrise);
                $('#sunrise').text(rise.toLocaleString());
                let set = new Date(data.city.sunset);
                $('#sunset').text(set.toLocaleString());
                console.log(data);
                $('#day1temp').text(data.list[0].main.temp + '°');
                $('#day2temp').text(data.list[1].main.temp + '°');
                $('#day3temp').text(data.list[2].main.temp + '°');
                $('#day4temp').text(data.list[3].main.temp + '°');
                $('#day5temp').text(data.list[4].main.temp + '°');
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
