const apiKey = "10a297b6e5c1d6d371b109b1314ff2c7"; 

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const error = document.getElementById("error");
const weatherBox = document.getElementById("weather-box");

const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

// ⏰ CITY TIME FUNCTION
function updateCityTime(timezoneOffset) {
    const now = new Date();

    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (1000 * timezoneOffset));

    const h = cityTime.getHours().toString().padStart(2, "0");
    const m = cityTime.getMinutes().toString().padStart(2, "0");
    const s = cityTime.getSeconds().toString().padStart(2, "0");

    document.getElementById("Clock").innerText = `${h}:${m}:${s}`;
}

let timer;

// 🌤 WEATHER FUNCTION
async function getWeather() {
    const city = cityInput.value.trim();

    error.innerText = "";
    weatherBox.style.display = "none";

    if (!city) {
        error.innerText = "Enter city name!";
        return;
    }

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        if (data.cod !== 200) {
            error.innerText = "City not found!";
            return;
        }

        // ✅ WEATHER UI
        temp.innerText = `${Math.round(data.main.temp)}°C`;
        condition.innerText = data.weather[0].main;
        humidity.innerText = `Humidity: ${data.main.humidity}%`;
        wind.innerText = `Wind: ${data.wind.speed} km/h`;
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // ✅ TIME UPDATE
        const timezoneOffset = data.timezone;

        if (timer) clearInterval(timer);

        updateCityTime(timezoneOffset);
        timer = setInterval(() => updateCityTime(timezoneOffset), 1000);

        weatherBox.style.display = "block";

    } catch (err) {
        error.innerText = "Error fetching data!";
        console.log(err);
    }
}

// 🔥 IMPORTANT (ye missing tha)
searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});