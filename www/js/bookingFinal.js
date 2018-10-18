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
		zoom: 22,
		center: { lat: 40.771, lng: -73.974 },
		disableDefaultUI: true
	});
	var directionsDisplay = new google.maps.DirectionsRenderer({ map: map1 });
	directionsService.route({
		origin: document.getElementById('pickupAddress').value,
		destination: document.getElementById('dropAddress').value,
		travelMode: 'DRIVING'
	}, function (response, status) {
		console.log("got directions");
        directionsDisplay.setDirections(response);
       // map1.setZoom(17);
	});
}