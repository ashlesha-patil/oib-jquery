/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    currentFormattedAddress: '',
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        
    
        console.log('Received Event: ' + id);
    },
    isOIBMode: false,
    toggleOIBMode: function(event) {
        console.log('isOIBMode: ' + event.value);
        if (event.value != '1') {
            this.isOIBMode = false;
          OIB.exitOIB('hideThis', 'OIB-Div');
        } else {
            this.isOIBMode = true;
            OIB.initialize('hideThis', 'OIB-Div');
        }
      },

    bookNow: function() {
        $.mobile.navigate( "#confirmation" );
      },
      confirmBooking: function() {
        $.mobile.navigate( "#final" );
      },
      changeAddressInput: function(mode) {
          if(mode == 'manual'){
              $('#pickup').show();
              $('#pickup').removeAttr('hidden');
              $('#oib-current-address').hide();
          } else if(mode == 'current'){
            $('#oib-current-address').html(currentFormattedAddress);
            $('#oib-current-address').show();
            $('#oib-current-address').removeAttr('hidden');
            $('#pickup').hide();
            $("#pickupAddress").val(currentFormattedAddress);
        } 
          
      }

      
};
function myMap() {
    var mapProp= {
        center:new google.maps.LatLng(51.508742,-0.120850),
        zoom:15,
        mapTypeId: 'roadmap',
        disableDefaultUI: true
    };
    var marker;
    var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var input = document.getElementById('pickup');
    var input2 = document.getElementById('drop');
    // map.controls[google.maps.ControlPosition.TOP].push(input);
    // map.controls[google.maps.ControlPosition.TOP].push(input2);

    var autocomplete = new google.maps.places.Autocomplete(input);
    var autocomplete2 = new google.maps.places.Autocomplete(input2);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);
    autocomplete2.bindTo('bounds', map);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location': initialLocation}, function(results, status) {
                if (status === 'OK') {
                  if (results[0]) {
                    // infowindow.setContent(results[0].formatted_address);
                    currentFormattedAddress = results[0].formatted_address
                  } else {
                    window.alert('No results found');
                  }
                } else {
                  window.alert('Geocoder failed due to: ' + status);
                }
              });
            marker = new google.maps.Marker({position: initialLocation, map: map});
            setAutocomplete(autocomplete, marker, map, 'pickup');
            setAutocomplete(autocomplete2, marker, map, 'drop');
        });
    }
}

function setAutocomplete(autocomplete, marker, map, elementId) {
// Set the data fields to return when the user selects a place.
autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name']);
    autocomplete.addListener('place_changed', function() {
        // infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }
        $('#'+elementId).val(address).change();

        // infowindowContent.children['place-icon'].src = place.icon;
        // infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        // infowindow.open(map, marker);
      });
}    
$(document).ready(() => {
    console.log('ready');
    $(document).on('change', '.pickup', function(){
        $("#pickupAddress").val($(this).val());
    });
    $(document).on('change', '.drop', function(){
        $("#dropAddress").val($(this).val());
    });
});

$(document).on("pagecreate", "#landing-page", function () {
    /* change event handler */
    function flipChanged(e) {
        var id = this.id,
            value = this.value;
        console.log(id + " has been changed! " + value);
        app.isOIBMode = value;
        OIB.initialize('hideThis', 'OIB-Div');
        $("#isOibMode").val(value);
    }

    /* add listener - this will be removed once other buttons are clicked */
    $("#flip-mini").on("change", flipChanged);
    
});

// $(document).on("pagehide","#landing-page",function(){
//     alert("pagehide event fired - landing");
// });