
Stage = {
    collisionMap    : [],
    height          : 0,
    tileMap         : {
        height  : 50,
        width   : 50
    },
    width           : 0,

    /**
     *
     */
    center: function () {
        var left        = 0,
            player      = $('#player'),
            playerPos   = player.position(),
            stage       = $('#stage'),
            top         = 0,
            windowH     = $(window).height(),
            windowW     = $(window).width();

        left    = (windowW / 2) - (playerPos.left + (player.width() / 2));
        top     = (windowH / 2) - (playerPos.top + ((player.height() + 8)/ 2));

        if (Stage.width <= windowW && Stage.height <= windowH) {
            left    = (windowW - Stage.width) / 2;
            top     = (windowH - Stage.height) / 2;
        }

        if (Stage.width > windowW && stage.offset().left > 0 && playerPos.left < windowW
            && Stage.height > windowH && stage.offset().top > 0 && playerPos.top < windowH) {
            left    = 0;
            top     = 0;
        }

        stage.css({
            height  : Stage.height,
            left    : left + 'px',
            top     : top + 'px',
            width   : Stage.width
        });
    },

    /**
     *
     */
    cleanup: function () {
        $('.npc').each(function (index, element) {
            $(element).npc('destroy');
        });

        $('#collisions').html('');
        $('#objects').html('');
        $('#tiles').html('');
    },

    /**
     *
     */
    drawCollisions: function (collisions) {
        var counter = 0,
            height  = collisions.height,
            row     = 0,
            width   = collisions.width;

        $.each(collisions.data, function (index, value) {
            if (!Stage.collisionMap[row]) {
                Stage.collisionMap[row] = {};
            }

            Stage.collisionMap[row][counter] = value === 2;

            if (value !== 0) { // 0 is empty, 2 is a collision
                $('#collisions').append('<div class="collision" style="left: ' + counter * Game.gridCellSize + 'px; top: ' + row * Game.gridCellSize + 'px"></div>');
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
                    $.player.create(value);

                    break;

                case 'npc':
                    $.npc.create(value);

                    break;

                case 'doorway':
                    $('#objects').append('<div id="' + value.name + '" class="object doorway" data-area="' + value.properties.area + '" style="left: ' + value.x + 'px; top: ' + (value.y - Game.gridCellSize) + 'px"></div>');

                    break;

                case 'stairs':
                    $('#objects').append('<div id="' + value.name + '" class="object stairs" data-area="' + value.properties.area + '" data-direction="' + value.properties.direction + '" style="left: ' + value.x + 'px; top: ' + (value.y - Game.gridCellSize) + 'px"></div>');

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
            var y   = Math.ceil(value / Stage.tileMap.width),
                x   = (value - ((y - 1) * Stage.tileMap.width));

            if (value !== 0) { // 0 is empty, therefore don't draw it
                $('#tiles').append('<div class="tile t' + value + '" style="background-position: -' + ((x * Game.gridCellSize) - Game.gridCellSize) + 'px -' + ((y * Game.gridCellSize) - Game.gridCellSize) + 'px; left: ' + (counter * Game.gridCellSize) + 'px; top: ' + (row * Game.gridCellSize) + 'px"></div>');
            }

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;
        });
    },

    /**
     *
     */
    getTile: function (x, y) {

    },

    /**
     *
     */
    init: function (stage) {
        var transition = $('#transition');

        transition.animate({
            opacity: 1
        }, 200, function () {
            Stage.cleanup();

            $.ajax({
                cache       : false,
                dataType    : 'json',
                type        : 'GET',
                url         : '../json/'+ stage +'.json',
            }).done(function (data, textStatus, jqXHR) {
                Game.prevArea       = Game.currentArea;
                Game.currentArea    = stage;
                Stage.height    = data.height * Game.gridCellSize;
                Stage.width     = data.width * Game.gridCellSize;

                $.each(data.layers, function (index, value) {
                    var layer = value;

                    switch (true) {

                        // Collisions
                        case (layer.name == 'collisions') :
                            Stage.drawCollisions(layer);

                            break;

                        // Objects
                        case (layer.type == 'objectgroup') :
                            Stage.drawObjects(layer);

                            break;

                        // Tile Layer
                        default :
                            Stage.drawTiles(layer);

                            break;
                    }
                });

                Stage.center();

                Game.areaObstacles = $('#player, .npc, .collision, .doorway, .stairs');

                transition.animate({
                    opacity: 0
                }, 200);
            }).fail(function (jqXHR, textStatus, errorThrown) {

            }).always(function (data, textStatus, jqXHR) {

            });
        });
    },

    scrollStage: function (direction) {
        var player      = $('#player'),
            offset      = 0,
            scrollArea  = $('#scroll-area'),
            stage       = $('#stage'),
            stagePos    = stage.position(),
            stageL      = stagePos.left,
            stageT      = stagePos.top,
            windowH     = $(window).height(),
            windowW     = $(window).width();

        if ((Stage.width > windowW || Stage.height > windowH)) {
            switch (direction) {
                case 'u':
                    if ((player.offset().top + 24) < (windowH / 2) && stageT < 0) {
                        stage.stop().animate({
                            top: stageT + Game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case 'd':
                    if ((player.offset().top + 24) > (windowH / 2)
                        && Math.abs(stageT - windowH) < Stage.height) {
                        stage.stop().animate({
                            top: stageT - Game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case 'l':
                    if ((player.offset().left + 16) < (windowW / 2) && stageL < 0) {
                        stage.stop().animate({
                            left: stageL + Game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case 'r':
                    if ((player.offset().left + 16) > (windowW / 2)
                        && Math.abs(stageL - windowW) < Stage.width) {
                        stage.stop().animate({
                            left: stageL - Game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;
            }
        }
    }
}