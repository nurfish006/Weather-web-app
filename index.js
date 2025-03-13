const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const apiKey = 'd71c166647dba28ae0faa3f5dd9e856a'; // Replace with your OpenWeatherMap API key
const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const countryTxt = document.querySelector('.city-name');
const tempTxt = document.querySelector('.temp-text');
const conditionTxt = document.querySelector('.weather-description');
const humidityValueText = document.querySelector('.humiditiy-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummeryImg = document.querySelector('.weather-icon');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemContainer = document.querySelector('.forecast-items-container');

// Event Listeners
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value); // Fetch weather for the searched city
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value); // Fetch weather for the searched city
        cityInput.value = '';
        cityInput.blur();
    }
});

// Fetch Data from API
async function getFetchData(endPoint, query, isCoordinates = false) {
    try {
        let apiUri;
        if (isCoordinates) {
            // Fetch data using latitude and longitude
            const { latitude, longitude } = query;
            apiUri = `https://api.openweathermap.org/data/2.5/${endPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        } else {
            // Fetch data using city name
            apiUri = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${query}&appid=${apiKey}&units=metric`;
        }

        const response = await fetch(apiUri);

        // Handle 404 responses without throwing an error
        if (response.status === 404) {
            return response.json(); // Return the response for "city not found"
        }

        // Throw an error for other failed responses
        if (!response.ok) throw new Error('Failed to fetch data');

        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Get Weather Icon Based on Weather ID
function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    else return 'clouds.svg';
}

// Get Current Date
function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleString('en-GB', options);
}

// Update Forecast Info
async function updateForecastInfo(query, isCoordinates = false) {
    const forecastData = await getFetchData('forecast', query, isCoordinates); // Fetch forecast data
    console.log('Forecast API Response:', forecastData); // Debugging line

    if (!forecastData || forecastData.cod === "404") {
        console.log('Forecast data not found'); // Debugging line
        return;
    }

    // Clear previous forecast items
    forecastItemContainer.innerHTML = '';

    // Loop through the forecast data and create forecast items
    forecastData.list.slice(0, 5).forEach(item => { // Display only the first 5 items
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const forecastTime = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const forecastTemp = `${Math.round(item.main.temp)}°C`;
        const forecastIcon = `./assets/weather/${getWeatherIcon(item.weather[0].id)}`;

        forecastItem.innerHTML = `
            <p>${forecastTime}</p>
            <img src="${forecastIcon}" alt="${item.weather[0].main}" class="forecast-item-icon">
            <p>${forecastTemp}</p>
        `;

        forecastItemContainer.appendChild(forecastItem);
    });
}

// Update Weather Info
async function updateWeatherInfo(query, isCoordinates = false) {
    const weatherData = await getFetchData('weather', query, isCoordinates);
    console.log('API Response:', weatherData); // Debugging line

    // Check if the city was not found or if there was an error
    if (!weatherData || weatherData.cod === "404") {
        console.log('City not found'); // Debugging line
        showDisplaySection(notFoundSection); // Show the "City Not Found" section
        return;
    }

    // Update the weather info
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = `${Math.round(temp)}°C`;
    conditionTxt.textContent = main;
    humidityValueText.textContent = `${humidity}%`;
    windValueTxt.textContent = `${speed} M/s`;
    currentDateTxt.textContent = getCurrentDate();
    weatherSummeryImg.src = `./assets/weather/${getWeatherIcon(id)}`;

    // Update the forecast info
    await updateForecastInfo(query, isCoordinates); // Call the forecast function
    showDisplaySection(weatherInfoSection); // Show the weather info section
}

// Show/Hide Sections
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(sec => {
        sec.style.display = 'none'; // Hide all sections
    });
    section.style.display = 'flex'; // Show the requested section
    console.log('Showing section:', section); // Debugging line
}

// Get User Location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Load Weather for User's Location on App Start
async function loadUserLocationWeather() {
    try {
        const userLocation = await getUserLocation(); // Get user's location
        await updateWeatherInfo(userLocation, true); // Fetch weather data using coordinates
    } catch (error) {
        console.error('Error loading user location weather:', error);
        showDisplaySection(searchCitySection); // Fallback to the "Search City" section
    }
}

// Call this function when the app loads
window.addEventListener('load', () => {
    loadUserLocationWeather();
});