$(document).ready(function (event) {
    $('#serviceid').change(function () {
        $this = $(this);
        $('.card-deck').hide();
        $('.' + $this.val()).show();
        console.log("showing " + $this.val() + " boxes");
    });
});