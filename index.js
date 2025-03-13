const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const notFoundSetion


searchBtn.addEventListener('click', () =>{
    if(cityInput.value.trim() != ''){
        console.log(cityInput.value);
        updateWeatherInfo(cityInput.value)
        cityInput.value  = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) =>{ 
    if(event.key == 'Enter' && cityInput.value.trim() ! = ''){
        console.log(cityInput.value)
        updateWeatherInfo(cityInput.value)
        cityInput.value  = ''
        cityInput.blur()
    }
})
async function getFetchData(endPoint, city){
    const apiUri = 'https://api.openweathermap'
    const response  = await fetch(apiUrl)
    return response.json()
}
async function updateWeatherInfo(city){
    const weatherData  = getFetchData('weath')

    if(weatherData.weatherData != 200){
        showDisplaySection(notFoundSection)
        return
    }
}
function showDisplaySection(section){
    [weatherInfoSection,  SearhSection, notfoundSection]
}
