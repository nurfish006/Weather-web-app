document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    fetchWeather(city);
});

function fetchWeather(city) {
    // Use a weather API like OpenWeatherMap
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('city-name').textContent = data.name;
            document.getElementById('temperature').textContent = `${data.main.temp}°C`;
            document.getElementById('weather-description').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
            // Update forecast similarly
        })
        .catch(error => console.error('Error fetching weather data:', error));
}