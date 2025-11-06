// =========================================================
// 🌤️ Weatherly – Professional Weather App JS
// Author: Mohammad Sameer
// =========================================================

// -------------------- 🌐 API Configuration --------------------
const API_KEY = "e707dcb905a71e4ec1535e4b42453448";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// -------------------- 🔧 DOM Elements --------------------
const elements = {
    form: document.getElementById("search-form"),
    cityInput: document.getElementById("city-input"),
    weatherCard: document.getElementById("weather-card"),
    errorMessage: document.getElementById("error-message"),
    cityName: document.getElementById("city-name"),
    temperature: document.getElementById("temperature"),
    description: document.getElementById("description"),
    icon: document.getElementById("weather-icon"),
    locateBtn: document.querySelector(".action--location"),
};

// -------------------- ⚙️ Event Listeners --------------------
elements.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = elements.cityInput.value.trim();
    if (!city) return showError("Please enter a city name.");

    await handleWeatherRequest({ q: city });
    elements.cityInput.value = "";
});

elements.locateBtn.addEventListener("click", async () => {
    if (!navigator.geolocation) {
        return showError("Geolocation is not supported by your browser.");
    }

    showLoading("Getting your location...");

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            const { latitude, longitude } = coords;
            await handleWeatherRequest({ lat: latitude, lon: longitude });
        },
        () => showError("Unable to retrieve your location. Please try again.")
    );
});

// -------------------- 🌍 Main Fetch Handler --------------------
async function handleWeatherRequest(params) {
    showLoading("Fetching weather data...");

    try {
        const url = buildURL(params);
        const response = await fetch(url);

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error("City not found. Try another name.");
                default:
                    throw new Error("Something went wrong. Please try again later.");
            }
        }

        const data = await response.json();
        renderWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

// -------------------- 🔗 Helper to build API URL --------------------
function buildURL(params) {
    const query = new URLSearchParams({
        ...params,
        appid: API_KEY,
        units: "metric",
    });
    return `${BASE_URL}?${query}`;
}

// -------------------- 🎨 Render Weather --------------------
function renderWeather(data) {
    const { name, main, weather } = data;
    const weatherMain = weather[0].main;
    const iconCode = weather[0].icon;
    const isNight = iconCode.endsWith("n");

    elements.cityName.textContent = name;
    elements.temperature.textContent = `${Math.round(main.temp)}°C`;
    elements.description.textContent = capitalize(weather[0].description);

    elements.icon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    elements.icon.alt = weather[0].description;
    elements.icon.style.visibility = "visible";

    elements.weatherCard.classList.remove("hidden");
    elements.errorMessage.classList.add("hidden");

    updateBackground(weatherMain, isNight);
}

// -------------------- 🚨 Show Error --------------------
function showError(message) {
    elements.weatherCard.classList.add("hidden");
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove("hidden");
}

// -------------------- ⏳ Loading State --------------------
function showLoading(message = "Loading...") {
    elements.errorMessage.classList.add("hidden");
    elements.weatherCard.classList.remove("hidden");

    elements.cityName.textContent = message;
    elements.temperature.textContent = "";
    elements.description.textContent = "";
    elements.icon.style.visibility = "hidden";
    elements.icon.src = "";
}

// -------------------- 🧠 Utility --------------------
const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";


function updateBackground(weatherMain, isNight = false) {
    const body = document.body;

    const gradients = {
        Thunderstorm: isNight
            ? "linear-gradient(to right, #232526, #414345)" // dark storm
            : "linear-gradient(to right, #141E30, #243B55)",

        Drizzle: isNight
            ? "linear-gradient(to right, #4e54c8, #8f94fb)"
            : "linear-gradient(to right, #89f7fe, #66a6ff)",

        Rain: isNight
            ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)" // deep blue rain
            : "linear-gradient(to right, #4b6cb7, #182848)",

        Snow: isNight
            ? "linear-gradient(to right, #5C258D, #4389A2)"
            : "linear-gradient(to right, #E0EAFC, #CFDEF3)",

        Mist: isNight
            ? "linear-gradient(to right, #232526, #414345)"
            : "linear-gradient(to right, #D3CCE3, #E9E4F0)",

        Smoke: "linear-gradient(to right, #606c88, #3f4c6b)",
        Haze: "linear-gradient(to right, #bdc3c7, #2c3e50)",
        Dust: "linear-gradient(to right, #b79891, #94716b)",
        Fog: "linear-gradient(to right, #757F9A, #D7DDE8)",
        Sand: "linear-gradient(to right, #eacda3, #d6ae7b)",
        Ash: "linear-gradient(to right, #3C3B3F, #605C3C)",
        Squall: "linear-gradient(to right, #485563, #29323c)",
        Tornado: "linear-gradient(to right, #283E51, #485563)",

        Clear: isNight
            ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)" // night sky
            : "linear-gradient(to right, #56CCF2, #2F80ED)", // bright sky

        Clouds: isNight
            ? "linear-gradient(to right, #232526, #414345)" // grey cloudy night
            : "linear-gradient(to right, #bdc3c7, #2c3e50)", // silver clouds
    };

    // Default fallback
    const fallback = "linear-gradient(to right, #83a4d4, #b6fbff)";

    body.style.background = gradients[weatherMain] || fallback;
    body.style.transition = "background 1s ease"; // smooth fade
}
