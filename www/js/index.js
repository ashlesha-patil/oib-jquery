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
    $("#pickup").change(function(){
        $("#pickupAddress").val($(this).val());
    });
    $("#drop").change(function(){
        $("#dropAddress").val($(this).val());
    });
    $("#isOib").change(function(){
        $("#isOibMode").val($(this).val());
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