let map;
let infowindow;

function showStations(stations) {
    /*
    for(let station of stations) {
        const data = `
        Name: ${station.name}
        Bikes: ${station.free_bikes} / ${station.empty_slots}
        Location: ${station.latitude}, ${station.longitude}`;
    }  
    */  

    for(station of stations) {
        const marker = new google.maps.Marker({
            position: {lat: station.latitude, lng: station.longitude},
            map: map
        });
        const content = `<h4>${station.name}</h4> <br> <p>Pyöriä tällä asemalla: ${station.free_bikes} / ${station.empty_slots}</p>`;
        marker.addListener('click', () => {
            infowindow.setContent(content);
            infowindow.open(map, marker);
        })
    }
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
}