$(document).on("pagecreate", "#confirmation", function () {
    // $('#confirmationHeader').load('../header.html');
    /* change event handler */
    function flipChanged(e) {
        var id = this.id,
            value = this.value;
        console.log(id + " has been changed! " + value);
        app.isOIBMode = value;
        OIB.initialize('hideThis', 'OIB-Div');
    }

    /* add listener - this will be removed once other buttons are clicked */
    $("#flip-mini").on("change", flipChanged);
});