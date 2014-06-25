
Stage = {

    /**
    *
    */
    drawCollisions: function (collisions) {
        $.each(collisions, function (index, value) {
            var row = index;

            $.each(value, function (index, value) {
                if (value == 1) {
                    $('#collisions').append('<div class="collision" style="left: ' + index * 32 + 'px; top: ' + row * 32 + 'px"></div>');
                }
            });
        });
    },

    /**
    *
    */
    drawObjects: function (objects) {
        $.each(objects, function (index, value) {
            var row = index;

            $.each(value, function (index, value) {
                if (value > 0) {
                    $('#objects').append('<div class="object o' + value + '" style="left: ' + index * 32 + 'px; top: ' + row * 32 + 'px"></div>');
                }
            });
        });
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