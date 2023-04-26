// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
    function geoFindMe() {

        const status = document.querySelector('#status'),
            mapLink = document.querySelector('#map-link'),
            latitude = document.querySelector('#latitude'),
            longitude = document.querySelector('#longitude'),
            globe = document.querySelector('#globe');

        function success(position) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            longitude.textContent = `Longitude: ${long}°`;
            latitude.textContent = `Latitude: ${lat}°`;

            status.textContent = '';
            mapLink.href = `https://www.openstreetmap.org/#map=18/${lat}/${long}`;
            globe.style.visibility = "visible";
        }

        function error() {
            status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        } else {
            status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }

    document.querySelector('#find-me').addEventListener('click', geoFindMe);

});