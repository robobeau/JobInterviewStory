
Stage = {

    /**
     *
     */
    drawCollisions: function (collisions) {
        $.each(collisions.data, function (index, value) {
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
        var counter = 0,
            height  = tiles.height,
            row     = 0,
            width   = tiles.width;

        $.each(tiles.data, function (index, value) {
            var x   = value % 88,
                y   = value % 88;

            console.log(x);
            console.log(y);

            $('#tiles').append('<div class="tile t' + value + '" style="background-position: -' + (x * 32) + 'px -' + (y * 32) + 'px; left: ' + counter * 32 + 'px; top: ' + row * 32 + 'px"></div>');

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;

            // var row = index;

            // $.each(value, function (index, value) {
            //     $('#tiles').append('<div class="tile t' + value + '" style="left: ' + index * 32 + 'px; top: ' + row * 32 + 'px"></div>');
            // });
        });
    }
}