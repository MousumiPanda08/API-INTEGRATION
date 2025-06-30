
function fetchWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (city === "") {
        document.getElementById("result").innerText = "Please enter a city name.";
        return;
    }

    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    fetch(geoURL)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                document.getElementById("result").innerText = "City not found.";
                return;
            }

            const { latitude, longitude, name, country, country_code } = geoData.results[0];
            const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

            fetch(weatherURL)
                .then(response => response.json())
                .then(data => {
                    const weather = data.current_weather;

                    const icons = {
                        0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
                        45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌧️",
                        61: "🌧️", 63: "🌧️", 65: "🌧️", 71: "🌨️", 73: "🌨️",
                        75: "❄️", 80: "🌧️", 81: "🌧️", 82: "⛈️", 95: "⛈️",
                        96: "⛈️", 99: "⛈️"
                    };
                    const icon = icons[weather.weathercode] || "❓";
                    const flagURL = `https://flagcdn.com/48x36/${country_code.toLowerCase()}.png`;

                    document.getElementById("result").innerHTML =
                        `<div class="card">
                            <div class="header">
                                <img src="${flagURL}" alt="${country}" class="flag">
                                <h3>${name}, ${country}</h3>
                            </div>
                            <div class="weather">
                                <div class="icon">${icon}</div>
                                <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
                                <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
                                <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
                            </div>
                        </div>`;
                })
                .catch(() => {
                    document.getElementById("result").innerText = "Failed to fetch weather data.";
                });
        })
        .catch(() => {
            document.getElementById("result").innerText = "Failed to fetch location data.";
        });
}
