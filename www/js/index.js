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

      setRideType: function() {
          alert('Hiiiii NOT Byeeee')
      },
      bookNow: function() {
        $.mobile.navigate( "#confirmation" );
      },
      confirmBooking: function() {
        $.mobile.navigate( "#final" );
      }
      
};

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
    


    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
});

// $(document).on("pagehide","#landing-page",function(){
//     alert("pagehide event fired - landing");
// });