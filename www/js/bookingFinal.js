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
});
$(document).on("pagehide","#final",function(){
    alert("pagehide event fired - final");
});