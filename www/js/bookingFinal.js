$(document).on("pagecreate", "#final", function () {
    /* change event handler */
	$('#pickupAddressFinal').html($('#pickupAddress').val());
	$('#dropAddressFinal').html($('#dropAddress').val());
    function flipChanged(e) {
        var id = this.id,
        value = this.value;
        app.isOIBMode = value;
        OIB.initialize('hideThis-final', 'OIB-Div-final');
    }
    if ($('#isOibMode').val() === 'on') {
        OIB.initialize('hideThis-final', 'OIB-Div-final');
    }
    /* add listener - this will be removed once other buttons are clicked */
    $("#flip-mini").on("change", flipChanged);
    setTimeout(function(){
        displayRouteFinal();
    }, 0)

});
$(document).on("pagehide","#final",function(){
    alert("pagehide event fired - final");
});

function displayRouteFinal() {
	var directionsService = new google.maps.DirectionsService;
	var map1 = new google.maps.Map(document.getElementById('finalMap'), {
		zoom: 17,
        center: { lat: 18.5204, lng: 73.8567 },
        disableDefaultUI: true,
        mapTypeId: 'roadmap',
    });
	var directionsDisplay = new google.maps.DirectionsRenderer({ map: map1 });
	directionsService.route({
		origin: document.getElementById('pickupAddress').value,
		destination: document.getElementById('dropAddress').value,
        travelMode: 'DRIVING',
	}, function (response, status) {
        console.log("got directions");
        directionsDisplay.setDirections(response);
        map1.setZoom(17);
        idleListener = google.maps.event.addListenerOnce(map1, 'idle', function () {
            var bounds = map1.getBounds();
            map1.fitBounds(map1.getBounds());
            //do whatever you want with those bounds
        });
        zoomChangeBoundsListener =
            google.maps.event.addListenerOnce(map1, 'bounds_changed', function (event) {
                if (this.getZoom()) {   // or set a minimum
                    this.setZoom(14);  // set zoom here
                }
                google.maps.event.removeListener(idleListener);
                google.maps.event.removeListener(zoomChangeBoundsListener);
            });
        
	});
}