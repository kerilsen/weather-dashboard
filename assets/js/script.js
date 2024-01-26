$(document).foundation();

$(function () {
    const API_key = "a91de93fc5fcff0a9d6b724ff2c97849";
    const units = "imperial";

    // Populating the current date at the top of the page
    $('#currentDay').text(dayjs().format('dddd, MMMM DD'));

    // Setting a global variable for storedCities that is pulled out of local storage when page is loaded or set to empty
    let storedCities = JSON.parse(localStorage.getItem("city")) || [];

    // Search history is rendered if available when page is loaded
    renderHistory();

    // Helper function to add a new city to the search history
    // Array parameter consists of city name, lat, lon
    function renderCity(array) {
        let name = array[0];
        let pastCity = $("<li><a></a></li>").text(`${name}`).addClass('list-group-item pastCities');
        $('#history').prepend(pastCity);
    }

    // Function that first clears the HTML list element then renders the search history using stored values
    function renderHistory() {
        $('#history').empty();
        storedCities.forEach((city) => {
            renderCity(city);
        })
    }

    // Helper function that stores a new searched city to local storage
    function storeCity(city) {
        storedCities.push(city);
        localStorage.setItem("city", JSON.stringify(storedCities));
    }

    // Helper function that pulls a searched city out of local storage
    // Sends the name, lat, lon to getCurrent and getForecast to repopulate data fields
    function recoverCity(name) {
        storedCities.forEach((city) => {
            if (name.trim() == city[0].trim()) {
                getCurrent(city);
                getForecast(city);
            }
            else return;
        });
    }

    // Listener for click events on the search history items that sends target text content to recoverCity function
    $('#history').click(function (event) {
        console.log(`history was clicked and target is ${event.target.textContent} and the class list is ${event.target.classList}`);
        if (event.target.classList.contains('pastCities')) {
            let pastCity = event.target.textContent;
            recoverCity(pastCity);
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

    // New array is city[name, lat, lon, temp, wind, humidity]
    function populateData(newArray, id) {
        $(`#${id}Temp`).text(`${Math.round(newArray[3])}°F`);
        $(`#${id}Wind`).text(`${Math.round(newArray[4])}mph`);
        $(`#${id}Humidity`).text(`${newArray[5]}%`);
    }

    // Function to get current weather that gets called by the search button event listener and takes in a "city" array parameter
    // city[name, lat, lon]
    function getCurrent(array) {
        $('#cityName').text(array[0]);
        let lat = array[1];
        let lon = array[2];
        console.log(`lat is ${lat} and lon is ${lon} and array is ${array}`);
        const openWeatherCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
        fetch(openWeatherCurrent)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                let temp = [];
                temp.push(...array);
                console.log(`temp + array is ${temp}`);
                temp.push(data.main.temp, data.wind.speed, data.main.humidity);
                console.log(`temp with temperature, wind and humidity pushed is ${temp}`);
                populateData(temp, "current");
                addIcon(data.weather[0], "current");
                console.log(data);
            })
            .catch(error => console.error('Error fetching data from Open Weather API:', error));
    };

    // Function to get 5 day forecast that gets called by the search button event listener and recoverCity function and takes in a "city" array parameter
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
                for (let i = 4; i < length; i += 8) {
                    let temp = [];
                    let dayID = `day${day}`;
                    console.log("dayID is " + dayID);
                    $(`#${dayID}`).text(dayjs.unix(data.list[i].dt).format("ddd MMM D"));
                    temp.push(...array);
                    temp.push(data.list[i].main.temp, data.list[i].wind.speed, data.list[i].main.humidity);
                    console.log(`temp array is ${temp} and day is ${dayID}`);
                    populateData(temp, dayID);
                    addIcon(data.list[i].weather[0], dayID);
                    day++;
                }
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
                    storeCity(cityArray);
                    renderCity(cityArray);
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