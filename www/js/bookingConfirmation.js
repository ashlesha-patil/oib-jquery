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
});
$(document).ready(() => {
    $("#pickup .oib-mode").on('change', function(){
        $("#pickupAddress").val($(this).val());
    });
    $("#drop .oib-mode").on('change', function(){
        $("#dropAddress").val($(this).val());
    });
    $("#isOib .oib-mode").on('change', function(){
        $("#isOibMode").val($(this).val());
    });
});