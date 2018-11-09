$(document).on("pagecreate", "#confirmation", function () {
	// $('#confirmationHeader').load('../header.html');
	/* change event handler */
	console.log('isOib' + $('#isOibMode').val());
	console.log('pickup' + $('#pickupAddress').val());
	console.log('drop' + $('#dropAddress').val());
	$('#pickupAddressConfirm').html($('#pickupAddress').val());
	$('#dropAddressConfirm').html($('#dropAddress').val());
	function flipChanged(e) {
		var id = this.id,
			value = this.value;
		console.log(id + " has been changed! " + value);
		app.isOIBMode = value;
		OIB.initialize('hideThis-confirm', 'OIB-Div-confirm');
	}
	if ($('#isOibMode').val() === 'on') {
		OIB.initialize('hideThis-confirm', 'OIB-Div-confirm');
	}
	/* add listener - this will be removed once other buttons are clicked */
	$("#flip-mini").on("change", flipChanged);
	displayRouteConfirm();
});
$(document).ready(() => {
	$("#pickup .oib-mode").on('change', function () {
		$("#pickupAddress").val($(this).val());
	});
	$("#drop .oib-mode").on('change', function () {
		$("#dropAddress").val($(this).val());
	});
	$("#isOib .oib-mode").on('change', function () {
		$("#isOibMode").val($(this).val());
	});
});

function displayRouteConfirm() {
	var directionsService = new google.maps.DirectionsService;
	var map = new google.maps.Map(document.getElementById('confirmationMap'), {
		zoom: 17,
		center: { lat: 40.771, lng: -73.974 },
		disableDefaultUI: true,
		mapTypeId: 'roadmap',
	});
	var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
	directionsService.route({
		origin: document.getElementById('pickupAddress').value,
		destination: document.getElementById('dropAddress').value,
		travelMode: 'DRIVING'
	}, function (response, status) {
		console.log("got directions");
		directionsDisplay.setDirections(response);
        map.setZoom(17);
        idleListener = google.maps.event.addListenerOnce(map, 'idle', function() {
            var bounds =  map.getBounds();
            map.fitBounds(map.getBounds());
            //do whatever you want with those bounds
          });
        zoomChangeBoundsListener =
            google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
                if (this.getZoom()) {   // or set a minimum
                    this.setZoom(14);  // set zoom here
                }
                google.maps.event.removeListener(idleListener);
                google.maps.event.removeListener(zoomChangeBoundsListener);
            });

		// var bounds = new google.maps.LatLngBounds();
		// map.fitBounds(bounds);
		// map.setZoom(22);
		// directionsDisplay.setDirections(response);
		
	});
}

