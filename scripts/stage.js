
Stage = {

    /**
     *
     */
    drawCollisions: function (collisions) {
        var counter = 0,
            height  = collisions.height,
            row     = 0,
            width   = collisions.width;

        $.each(collisions.data, function (index, value) {
            var x   = value - (Math.floor(value / 88) * 88) - 1,
                y   = Math.floor(value / 88);

            if (value > 0) {
                $('#collisions').append('<div class="collision" style="left: ' + counter * 32 + 'px; top: ' + row * 32 + 'px"></div>');
            }

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;
        });
    },

    /**
     *
     */
    drawObjects: function (objects) {
        $.each(objects.objects, function (index, value) {
            switch (value.type) {
                case 'player':
                    $('#objects').append('<div id="player" tabindex="0" style="left: ' + value.x + 'px; top: ' + ((value.y - 8) - 32) + 'px;"><div id="player-collision"></div></div>');

                    $('#player').trigger('focus');

                    break;

                case 'npc':
                    $.npc.create(
                        value.name,
                        {
                            height  : 40,
                            width   : 32
                        },
                        {
                            left    : value.x,
                            top     : (value.y - 8) - 32
                        },
                        value.properties.dialogue
                    );

                    break;

                case 'doorway':
                    $('#objects').append('<div id="' + value.name + '" class="object doorway" style="left: ' + value.x + 'px; top: ' + (value.y - 32) + 'px"></div>');

                    break;
            }
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
            var x   = value - (Math.floor(value / 88) * 88) - 1,
                y   = Math.floor(value / 88);

            $('#tiles').append('<div class="tile t' + value + '" style="background-position: -' + (x * 32) + 'px -' + (y * 32) + 'px; left: ' + counter * 32 + 'px; top: ' + row * 32 + 'px"></div>');

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;
        });

        $('#stage').css({
            height  : height * 32,
            left    : ($(window).width() - (width * 32)) / 2 + 'px',
            top     : ($(window).height() - (height * 32)) / 2 + 'px',
            width   : width * 32
        });
    }
}