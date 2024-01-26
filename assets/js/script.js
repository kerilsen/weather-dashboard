$(document).foundation();

$(function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const units = "imperial";

    // Populating the current date at the top of the page
    $('#currentDay').text(dayjs().format('dddd, MMMM DD'));

    let storedCities = JSON.parse(localStorage.getItem("city")) || [];
    renderHistory();

    function addCity(array) {
        let name = array[0];
        let pastCity = $("<li></li>").text(`${name}`).addClass('list-group-item');
        let anchor = $("<a></a>").addClass('pastCities');
        console.log(`city name is ${name}`);
        pastCity.append(anchor);
        $('#history').prepend(pastCity);
    }

    // Needs to first clear the previous values
    // Function that renders the search history using stored values
    function renderHistory() {
        // const storedCities = JSON.parse(localStorage.getItem("city")) || [];
        storedCities.forEach((city) => {
            addCity(city);
        })
    }

    // Function that appends the new city to the storedCities array and sends it back to storage
    function saveCity(city) {
        storedCities.push(city);
        localStorage.setItem("city", JSON.stringify(storedCities));
    };

    // Listener for click events on the search history items
    const pastCities = $('#history');
    pastCities.click(function (event) {
        if (event.target.classList.contains('pastCities')) {
            let pastCity = event.target.textContent;
            storedCities.forEach((city) => {
                if (pastCity.trim() == city[0].trim()) {
                    getCurrent(city);
                    getForecast(city);
                }
                else return;
            })
        }
        else return;
    });

    // Function that generates a URL for the appropriate weather icon
    function addIcon(object, id) {
        let elementID = `#${id}Icon`;
        // Clear the previous icon
        $(`${elementID}`).html("");
        const iconURL = `https://openweathermap.org/img/wn/${object.icon}@2x.png`;
        let image = `<img src="${iconURL}" alt="${object.description}" />`;
        $(`${elementID}`).append(image);
    }

    // Array is city[name, lat, lon, temp, wind, humidity]
    function populateData(array, id) {
        $(`#${id}Temp`).text(`${Math.round(array[3])}°F`);
        $(`#${id}Wind`).text(`${Math.round(array[4])}mph`);
        $(`#${id}Humidity`).text(`${array[5]}%`);
    }

    // Function to get current weather that gets called by the search button event listener and takes in a "city" array parameter
    // city[name, lat, lon]
    function getCurrent(array) {
        $('#cityName').text(array[0]);
        let lat = array[1];
        let lon = array[2];
        const openWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
        fetch(openWeatherCurrent)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                array.push(data.main.temp, data.wind.speed, data.main.humidity);
                populateData(array, "current");
                addIcon(data.weather[0], "current");
                console.log(data);
            })
            .catch(error => console.error('Error fetching data from Open Weather API:', error));
    };

    // Function to get 5 day forecast that gets called by the search button event listener and takes in a "city" array parameter
    // city[name, lat, lon] 
    function getForecast(array) {
        let lat = array[1];
        let lon = array[2];
        const openWeather5Day = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
        fetch(openWeather5Day)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                let day = 1;
                let length = data.list.length;
                console.log(`list length is ${length}`);
                // Caught in infinite loop where console will log 'The index is at 4' repeatedly
                // for (let i = 4; i < 40; i + 8) 
                // {
                //     console.log("The index is at " + i);
                // }
                // End test code

                // To replace the test code when for loop resolved
                //   {  let temp = [];
                //     let dayID = `#day${day}`;
                //     console.log("dayID is " + dayID);
                //     $(`${dayID}`).text(dayjs.unix(data.list[i].dt).format("ddd MMM D"));
                //     temp = [...array];
                //     temp.push(data.list[i].temp, data.list[i].wind.speed, data.list[i].humidity);
                //     console.log(`temp array is ${temp}`);
                //     populateData(temp, day);
                //     addIcon(data.list[i].weather[0], day);
                //     day++;
                // }
            })
            .catch((error) => {
                console.error(`Error getting 5 day weather forecast: ${error}`);
            });
    };


    // Clear history function that runs when user clicks on the "clear"/"X" button
    $('#clearHistory').click(function () {
        localStorage.clear();
        location.reload();
    });

    // Search function that runs when user enters a city and clicks the search button
    $('#searchCity').click(function () {
        console.log("search button clicked");
        const city = $('#inputCity').val();
        console.log(`city input is ${city}`);
        // Fetch request to geocoding to get the coordinates of the city name
        const geocodingEndpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`;
        fetch(geocodingEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                data.forEach(city => {
                    console.log(city);
                    // Create array to hold the city name, lat and lon and then send it to helper functions
                    // that save the city to local storage and populates the search history for the user
                    // as well as the current and 5-day forecast fields
                    let cityArray = [city.name, city.lat, city.lon];
                    getCurrent(cityArray);
                    getForecast(cityArray);
                    saveCity(cityArray);
                    renderHistory(cityArray[0]);
                })
            })
            .catch(error => console.error('Error fetching data from Open Weather API:', error));
    })

    // Let search history persist when window is reloaded
    window.addEventListener('load', function () {
        console.log("window is reloaded");
        renderHistory();
    })
});