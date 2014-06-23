
Stage = {

    /**
    *
    */
    drawObjects: function () {

    },

    /**
     *
     */
    drawTiles: function (tiles) {
        $.each(tiles, function (index, value) {
            var row = index;

            $.each(value, function (index, value) {
                $('#tiles').append('<div class="tile t' + value + '" style="left: ' + index * 32 + 'px; top: ' + row * 32 + 'px"></div>');
            });
        });
    }
}