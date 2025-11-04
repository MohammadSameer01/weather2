const apiKey = "e707dcb905a71e4ec1535e4b42453448"; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const autoDetectBtn = document.getElementById("autoDetectBtn");
const weatherResult = document.getElementById("weatherResult");

// Fetch weather by city name
getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }
    getWeatherByCity(city);
});

// Fetch weather by geolocation
autoDetectBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            error => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Fetch weather by city
function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// Fetch weather by coordinates
function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// Common fetch function
function fetchWeather(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found or unable to fetch data");
            }
            return response.json();
        })
        .then(data => {
            weatherResult.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            `;
        })
        .catch(error => {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
        });
}
