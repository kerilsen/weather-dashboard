$(document).foundation();

$(function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const units = "imperial";
    // Switch button for Fahrenheit or Celsius for future development
    // let unit;
    // const F = document.getElementById('F');
    // if (F.classList === "switch-active")
    //     unit = "imperial";
    // else unit = "metric";
    // const switchButton = document.getElementById('yes-no');
    // switchButton.addEventListener("click", function () {
    //     location.reload();
    // })

    $('#currentDay').text(dayjs().format('dddd, MMMM DD'));
    console.log(dayjs().format('dddd, MMMM DD'));

    const searchButton = document.getElementById('searchCity');
    const clearHistory = document.getElementById('clearHistory');

    function saveCity(city) {
        let storedCities = JSON.parse(localStorage.getItem("city")) || [];
        storedCities.push(city);
        let cityList = document.getElementById('history');
        storedCities.forEach(city => {
            let pastCity = document.createElement('li');
            pastCity.classList.add("list-group-item");
            let anchor = document.createElement('a');
            anchor.href = "#";
            anchor.text = city[0];
            anchor.classList.add("pastCities");
            pastCity.append(anchor);
            cityList.prepend(pastCity);
        })
        localStorage.setItem("city", JSON.stringify(storedCities));
    };

    // Listener for click events on the search history items
    const pastCities = document.querySelectorAll('.pastCities');
    let storedCities = JSON.parse(localStorage.getItem("city")) || [];
    pastCities.forEach(function (city) {
        city.addEventListener('click', (event) => {
            event.preventDefault();
            let target = event.currentTarget.textContent;
            console.log("past city clicked");
            storedCities.forEach(function (array) {
                if (array[i] === city[0]) {
                    getCurrent(city);
                    getForecast(city)
                };
            });
        });
    });

    function addIcon(object, element) {
        element.innerHTML = "";
        const icon = object.icon;
        const altText = object.alt;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const iconEl = document.createElement('img');
        iconEl.src = iconURL;
        iconEl.alt = altText;
        element.appendChild(iconEl);
    }

    function getCurrent(city) {
        let name = city[0];
        $('#cityName').text(name);
        let lat = city[1];
        let lon = city[2];
        const openWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
        fetch(openWeatherCurrent)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                $('#currentTemp').text(Math.round(data.main.temp) + "°F");
                $('#currentWind').text(Math.round(data.wind.speed) + " mph");
                $('#currentHumidity').text(data.main.humidity + "%");
                const iconContainer = document.getElementById('currentIcon');
                addIcon(data.weather[0], iconContainer);
                console.log(data);
            })
    };

    function getForecast(city) {
        let lat = city[1];
        let lon = city[2];
        const openWeather5Day = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
        fetch(openWeather5Day)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Fetch and display sunrise and sunset for future development
                // Time shift algorithm isn't right
                // const sunrise = data.city.sunrise + (data.city.timezone / 60);
                // $('#sunrise').text(dayjs.unix(sunrise).format("h:mm a"));
                // const sunset = data.city.sunset + (data.city.timezone / 60);
                // $('#sunset').text(dayjs.unix(sunset).format("h:mm a"));
                console.log(data);

                $('#day1').text(dayjs.unix(data.list[4].dt).format("ddd MMM D"));
                const icon1 = document.getElementById('icon1');
                addIcon(data.list[4].weather[0], icon1);
                $('#day1temp').text(Math.round(data.list[4].main.temp) + "°F");
                $('#day1Wind').text(Math.round(data.list[4].wind.speed) + " mph");
                $('#day1Humidity').text(`${data.list[4].main.humidity}%`);

                $('#day2').text(dayjs.unix(data.list[12].dt).format("ddd MMM D"));
                const icon2 = document.getElementById('icon2');
                addIcon(data.list[12].weather[0], icon2);
                $('#day2temp').text(Math.round(data.list[12].main.temp) + "°F");
                $('#day2Wind').text(Math.round(data.list[12].wind.speed) + " mph");
                $('#day2Humidity').text(`${data.list[12].main.humidity}%`);

                $('#day3').text(dayjs.unix(data.list[20].dt).format("ddd MMM D"));
                const icon3 = document.getElementById('icon3');
                addIcon(data.list[20].weather[0], icon3);
                $('#day3temp').text(Math.round(data.list[20].main.temp) + "°F");
                $('#day3Wind').text(Math.round(data.list[20].wind.speed) + " mph");
                $('#day3Humidity').text(`${data.list[20].main.humidity}%`);

                $('#day4').text(dayjs.unix(data.list[28].dt).format("ddd MMM D"));
                const icon4 = document.getElementById('icon4');
                addIcon(data.list[28].weather[0], icon4);
                $('#day4temp').text(Math.round(data.list[28].main.temp) + "°F");
                $('#day4Wind').text(Math.round(data.list[28].wind.speed) + " mph");
                $('#day4Humidity').text(`${data.list[28].main.humidity}%`);

                $('#day5').text(dayjs.unix(data.list[36].dt).format("ddd MMM D"));
                const icon5 = document.getElementById('icon5');
                addIcon(data.list[36].weather[0], icon5);
                $('#day5temp').text(Math.round(data.list[36].main.temp) + "°F");
                $('#day5Wind').text(Math.round(data.list[36].wind.speed) + " mph");
                $('#day5Humidity').text(`${data.list[36].main.humidity}%`);
            })
    };

    clearHistory.addEventListener("click", function () {
        localStorage.clear();
        location.reload();
    })

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
                    console.log(city);
                    const cityString = [city.name, city.lat, city.lon];
                    saveCity(cityString);
                    getCurrent(cityString);
                    getForecast(cityString);
                })
            })
            .catch(error => console.error('Error fetching data from Open Weather API:', error));
    })
    console.log("button clicked");
});