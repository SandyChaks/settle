// Connexion à socket.io
var url = 'https://settle-alaurelut.c9users.io';
var port = 8080;
if (document.location.hostname == "localhost") {
    url = 'localhost';
    var port = 3000;
}

var map = {};
map.maxDistance = 500;

map.socket = io.connect(url + ':' + port + '/');

map.socket.on('chatRoomGet', function(data) {
    console.log('chatRoomGet');
    console.log(data);
    map.chatRooms = data;
    map.setChatRoomsList(map.chatRooms, map.userPosition);
});

map.init = function() {

    map.instance = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    map.instance.addListener('dragend', function(e) {
        map.setChatRoomsList(map.chatRooms, map.instance.getCenter());
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            map.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var marker = new google.maps.Marker({
                position: map.userPosition,
                map: map.instance,
                icon: "img/map/pin.svg",
                size: new google.maps.Size(32, 32)
            });

            map.instance.setCenter(pos);

            map.socket.emit('chatRoomGet');

        }, function() {
            this.handleLocationError(true, infoWindow, map.instance.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.instance.getCenter());
    }
}

map.setChatRoomsList = function(chatRooms, mapCenter) {

    $('#chatRoomList').empty();

    for (i = 0; i < chatRooms.length; i++) {

        chatRooms[i].position = new google.maps.LatLng(chatRooms[i].latitude, chatRooms[i].longitude);

        chatRooms[i].distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(mapCenter, chatRooms[i].position));

        if (chatRooms[i].distance < this.maxDistance) {
            $('#chatRoomList').append('<a href="room/'+chatRooms[i]._id+'" class="chatRoom"><div id="chatRoom' + i + '" ><span class="name">' + chatRooms[i].name + ' - ' + chatRooms[i].distance + 'm</span><span class="users">' + chatRooms[i].users + ' Users</span><div class="clear"></div></div></a>');
        }
    }
}

function initMap() {
    map.init();
}
