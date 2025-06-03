const API_KEY = "1c8bfa00f959ec8014fd63d0b74ee9cd";

const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

let refreshTimer;

async function updateWeather() {
  const city = cityInput.value;
  if (!city) {
    displayError("City name cannot be empty");
    return;
  }

  try {
    const { name, sys, main, weather, wind, cod } = await getWeatherData(city);
    if (cod === "404") {
      displayError("Please enter a valid city name");
      return;
    }

    weatherInfo.innerHTML = `
        <h2>${name}, ${sys.country}</h2>
        <p>Temperature: ${main.temp}</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Pressure: ${main.pressure} hPa</p>
    `;
    weatherInfo.classList.remove("hidden");

    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(updateWeather, 60 * 1000);
  } catch (error) {
    displayError("Server error: something went wrong on our side");
  }
}

function displayError(message) {
  errorMessage.textContent = message;
  weatherInfo.innerHTML = "";
}

searchButton.addEventListener("click", updateWeather);
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    updateWeather();
  }
});
