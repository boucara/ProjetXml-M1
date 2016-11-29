function initMap() {
    // Paris
    var paris = {lat: 48.862725, lng: 2.287592};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: paris
    });
    var marker = new google.maps.Marker({
        position: paris,
        map: map
    });
}