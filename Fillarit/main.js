let map;
let infowindow;
let directionsService;
let directionsRenderer;
let markers = [];

document.querySelector('.close').addEventListener('click', () => {
	directionsRenderer.set('directions', null);
	resizeElements();
	getData();
});

function showStations(stations) {
	for (let station of stations) {
		const marker = new google.maps.Marker({
			position: { lat: station.latitude, lng: station.longitude },
			map: map
		});
		markers.push(marker);
		const content = `
        <h4>${station.name}</h4>
        <br>
        <p>Pyöriä tällä asemalla: ${station.free_bikes} / ${
			station.empty_slots
		}</p>
        <br>
        <input id="destination" type="text" placeholder="Minne?">
        <button id="route">Reittiohjeet</button>`;
		marker.addListener('click', () => {
			infowindow.setContent(content);
			infowindow.open(map, marker);
			document.getElementById('route').addEventListener('click', () => {
				clearMarkers(marker);
				router(infowindow.position);
			});
		});
	}
}

function router(location) {
	const start = { lat: location.lat(), lng: location.lng() };
	const destination = document.getElementById('destination').value;
	const mode = 'BICYCLING';
	calcRoute(start, destination, mode);
}

function clearMarkers(excluded) {
	for (let marker of markers) {
		if (marker === excluded) {
			console.log('not the one');
			markers = [];
			markers.push(marker);
			continue;
		}
		marker.setMap(null);
	}
	console.log(markers);
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
	weatherIcon.src = `https://openweathermap.org/img/w/${
		data.weather[0].icon
	}.png`;
	weatherIcon.alt = data.weather[0].main;
}

function calcRoute(startPoint, endPoint, mode) {
	const options = {
		origin: startPoint,
		destination: endPoint,
		travelMode: mode,
		transitOptions: {
			modes: ['BUS', 'RAIL'],
			routingPreference: 'FEWER_TRANSFERS'
		},
		drivingOptions: {
			departureTime: new Date(Date.now()),
			trafficModel: 'bestguess'
		},
		provideRouteAlternatives: true,
		region: 'FI'
	};
	directionsService.route(options, function(result, status) {
		if (status == 'OK') {
			directionsRenderer.setDirections(result);
			resizeElements();
			infowindow.close();
		}
	});
}

function resizeElements() {
	const map = document.querySelector('#map');
	const instructions = document.querySelector('.instructions');
	if (instructions.classList.contains('open')) {
		console.log('closing');
		instructions.classList.remove('open');
		map.style.width = '100vw';
	} else {
		console.log('opening');
		instructions.classList.add('open');
		const width = instructions.offsetWidth;
		console.log(width);
		map.style.width = `calc(100vw - ${width}px)`;
	}
}

function getWeather() {
	fetch(
		'https://api.openweathermap.org/data/2.5/weather?id=658226&lang=fi&units=metric&APPID=bd5e378503939ddaee76f12ad7a97608'
	)
		.then(response => response.json())
		.then(data => formatWeatherData(data));
}

function getData() {
	fetch('http://api.citybik.es/v2/networks/citybikes-helsinki')
		.then(response => response.json())
		.then(data => showStations(data.network.stations));
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: { lat: 60.1706, lng: 24.939671 },
		gestureHandling: 'greedy'
	});
	infowindow = new google.maps.InfoWindow();
	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(document.querySelector('.instructions'));

	getData();
	getWeather();
}
