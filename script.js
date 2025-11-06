// =========================================================
// 🌤️ Weatherly – Professional Weather App JS
// Author: Mohammad Sameer
// =========================================================

// -------------------- 🌐 API Configuration --------------------
const API_KEY = "e707dcb905a71e4ec1535e4b42453448";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// -------------------- 🔧 DOM Elements --------------------
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");

const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("weather-icon");

const locateBtn = document.querySelector('.action--location');

// -------------------- ⚙️ Event Listeners --------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    showLoading();
    await fetchWeatherByCity(city);
    cityInput.value = "";
});

locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showError("Unable to retrieve your location. Please try again.");
        }
    );
});

// -------------------- 🌍 Fetch Weather --------------------
async function fetchWeatherByCity(city) {
    const url = buildURL({ q: city });
    await fetchWeather(url);
}

async function fetchWeatherByCoords(lat, lon) {
    const url = buildURL({ lat, lon });
    await fetchWeather(url);
}

async function fetchWeather(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found. Try another name.");
            else throw new Error("Something went wrong. Please try again later.");
        }

        const data = await response.json();
        renderWeather(data);

    } catch (error) {
        showError(error.message);
    }
}

// -------------------- 🔗 Helper to build API URL --------------------
function buildURL(params) {
    const query = new URLSearchParams({ ...params, appid: API_KEY, units: "metric" });
    return `${BASE_URL}?${query.toString()}`;
}

// -------------------- 🎨 Render Weather --------------------
function renderWeather(data) {
    const { name, main, weather } = data;
    console.log(data)
    cityNameEl.textContent = name;
    tempEl.textContent = `${Math.round(main.temp)}°C`;
    descEl.textContent = capitalize(weather[0].description);
    iconEl.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    iconEl.alt = weather[0].description;
    iconEl.style.visibility = "visible";

    weatherCard.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

// -------------------- 🚨 Show Error --------------------
function showError(message) {
    weatherCard.classList.add("hidden");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

// -------------------- ⏳ Loading State --------------------
function showLoading() {
    errorMessage.classList.add("hidden");
    weatherCard.classList.remove("hidden");

    cityNameEl.textContent = "Loading...";
    tempEl.textContent = "";
    descEl.textContent = "";
    iconEl.src = "";
    iconEl.style.visibility = "hidden";
}

// -------------------- 🧠 Utility --------------------
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
