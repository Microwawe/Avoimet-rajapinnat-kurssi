let map;
let infowindow;

function showStations(stations) {
    for (let station of stations) {
        const marker = new google.maps.Marker({
            position: { lat: station.latitude, lng: station.longitude },
            map: map
        });
        const content = `<h4>${station.name}</h4> <br> <p>Pyöriä tällä asemalla: ${station.free_bikes} / ${station.empty_slots}</p>`;
        marker.addListener('click', () => {
            infowindow.setContent(content);
            infowindow.open(map, marker);
        })
    }
}

function formatWeatherData(data) {
    console.log(data);
    const weatherIcon = document.querySelector('.weather-icon');
    const windIcon = document.querySelector('.wind-icon');
    const windText = document.querySelector('.wind-text');
    const temperature = document.querySelector('.degrees');
    const weatherDesc = document.querySelector('.description');
    const degrees = data.main.temp;
    const description = data.weather[0].description;
    const windSpeed = data.wind.speed;
    const windDir = data.wind.deg + 180;

    temperature.innerHTML = `${degrees}&ordm;C`;
    weatherDesc.textContent = description;

    windText.textContent = `${windSpeed} m/s`;
    windIcon.style.transform = `rotate(${windDir}deg)`;
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    weatherIcon.alt = data.weather[0].main;


}







function getWeather() {
    fetch("https://api.openweathermap.org/data/2.5/weather?id=658226&lang=fi&units=metric&APPID=bd5e378503939ddaee76f12ad7a97608")
        .then(response => response.json())
        .then(data => formatWeatherData(data));
}

function getData() {
    fetch("http://api.citybik.es/v2/networks/citybikes-helsinki")
        .then(response => response.json())
        .then(data => showStations(data.network.stations))
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 60.1706, lng: 24.939671 },
        gestureHandling: 'greedy'
    });
    infowindow = new google.maps.InfoWindow();

    getData();
    getWeather();
}