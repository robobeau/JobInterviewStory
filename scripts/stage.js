
/** STAGE **/

function Stage () {
    this.collisionsMap  = [];
    this.height         = 0;
    this.npcsMap        = [];
    this.playersMap     = [];
    this.portalsMap     = [];
    this.tileMap        = {
        height  : 50,
        width   : 50
    }
    this.width          = 0;

    /**
     *
     */
    this.center = function () {
        var left        = 0,
            player      = $('#player'),
            playerPos   = player.position(),
            stage       = $('#stage'),
            top         = 0,
            windowH     = $(window).height(),
            windowW     = $(window).width();

        left    = (windowW / 2) - (playerPos.left + (player.width() / 2));
        top     = (windowH / 2) - (playerPos.top + ((player.height() + 8)/ 2));

        if ($.stage.width <= windowW && $.stage.height <= windowH) {
            left    = (windowW - $.stage.width) / 2;
            top     = (windowH - $.stage.height) / 2;
        }

        if ($.stage.width > windowW && stage.offset().left > 0 && playerPos.left < windowW
            && $.stage.height > windowH && stage.offset().top > 0 && playerPos.top < windowH) {
            left    = 0;
            top     = 0;
        }

        stage.css({
            height  : $.stage.height,
            left    : left + 'px',
            top     : top + 'px',
            width   : $.stage.width
        });
    }

    /**
     *
     */
    this.checkButtons = function () {
        // Shift

        if ($.game.pressedKeys[16]) {

        }

        // Spacebar, Enter

        if ($.game.pressedKeys[13] || $.game.pressedKeys[32]) {

        }

        switch (true) {

            // W, Up Arrow

            case (($.game.pressedKeys[87] || $.game.pressedKeys[38])) :

                break;

            // S, Down Arrow

            case (($.game.pressedKeys[83] || $.game.pressedKeys[40])) :

                break;

            // A, Left Arrow

            case (($.game.pressedKeys[65] || $.game.pressedKeys[37])) :

                break;

            // D, Right Arrow

            case (($.game.pressedKeys[68] || $.game.pressedKeys[39])) :

                break;

            default:

                break;
        }
    }

    /**
     *
     */
    this.cleanup = function () {
        $.stage.collisionsMap   = [];
        $.stage.npcsMap         = [];
        $.stage.playersMap      = [];
        $.stage.portalsMap      = [];

        // $.sounds.fade($.sounds.currentMusic, 0);

        $('.npc').each(function (index, element) {
            $(element).npc('destroy');
        });

        $('#player').each(function (index, element) {
            $(element).player('destroy');
        });

        $('#collisions').html('');
        $('#modals').html('');
        $('#objects').html('');
        $('#tiles').html('');

        $(document).trigger('keyup');
    }

    /**
     *
     */
    this.drawCollisions = function (collisions) {
        var counter = 0,
            height  = collisions.height,
            row     = 0,
            width   = collisions.width;

        $.each(collisions.data, function (index, value) {
            if (!$.stage.collisionsMap[row]) {
                $.stage.collisionsMap[row] = {};
            }

            $.stage.collisionsMap[row][counter] = value === 2;

            if (value !== 0) { // 0 is empty, 2 is a collision
                $('#collisions').append('<div class="collision" style="left: ' + counter * $.game.gridCellSize + 'px; top: ' + row * $.game.gridCellSize + 'px"></div>');
            }

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;
        });
    }

    /**
     *
     */
    this.drawObjects = function (objects) {
        $.each(objects.objects, function (index, value) {
            switch (value.type) {
                case 'player':
                    $.player.create(value);

                    break;

                case 'npc':
                    $.npc.create(value);

                    break;

                case 'doorway':
                    $('#objects').append('<div id="' + value.name + '" class="object doorway" data-area="' + value.properties.area + '" style="left: ' + value.x + 'px; top: ' + (value.y - $.game.gridCellSize) + 'px"></div>');

                    if (!$.stage.portalsMap[(value.y / $.game.gridCellSize) - 1]) {
                        $.stage.portalsMap[(value.y / $.game.gridCellSize) - 1] = {};
                    }

                    $.stage.portalsMap[(value.y / $.game.gridCellSize) - 1][(value.x / $.game.gridCellSize)] = $('#' + value.name);

                    break;

                case 'stairs':
                    $('#objects').append('<div id="' + value.name + '" class="object stairs" data-area="' + value.properties.area + '" data-direction="' + value.properties.direction + '" style="left: ' + value.x + 'px; top: ' + (value.y - $.game.gridCellSize) + 'px"></div>');

                    if (!$.stage.portalsMap[(value.y / $.game.gridCellSize) - 1]) {
                        $.stage.portalsMap[(value.y / $.game.gridCellSize) - 1] = {};
                    }

                    $.stage.portalsMap[(value.y / $.game.gridCellSize) - 1][(value.x / $.game.gridCellSize)] = $('#' + value.name);

                    break;
            }
        });
    }

    /**
     *
     */
    this.drawTiles = function (tiles) {
        var counter = 0,
            height  = tiles.height,
            row     = 0,
            width   = tiles.width;

        $.each(tiles.data, function (index, value) {
            var y   = Math.ceil(value / $.stage.tileMap.width),
                x   = (value - ((y - 1) * $.stage.tileMap.width));

            if (value !== 0) { // 0 is empty, therefore don't draw it
                $('#tiles').append('<div class="tile t' + value + ' ' + tiles.name + '" style="background-position: -' + ((x * $.game.gridCellSize) - $.game.gridCellSize) + 'px -' + ((y * $.game.gridCellSize) - $.game.gridCellSize) + 'px; left: ' + (counter * $.game.gridCellSize) + 'px; top: ' + (row * $.game.gridCellSize) + 'px"></div>');
            }

            counter += (index + 1) % width === 0 ? -counter : 1;
            row += (index + 1) % width === 0 ? 1 : 0;
        });
    }

    /**
     *
     */
    this.init = function (stage) {
        var transition = $('#transition');

        transition.animate({
            opacity: 1
        }, 180, function () {
            $.stage.cleanup();

            $.ajax({
                cache       : false,
                dataType    : 'json',
                type        : 'GET',
                url         : '../json/'+ stage +'.json',
            }).done(function (data, textStatus, jqXHR) {
                $.game.prevArea     = $.game.currentArea;
                $.game.currentArea  = stage;
                $.stage.height      = data.height * $.game.gridCellSize;
                $.stage.width       = data.width * $.game.gridCellSize;

                $.each(data.layers, function (index, value) {
                    var layer = value;

                    switch (true) {

                        // Collisions
                        case (layer.name == 'collisions') :
                            $.stage.drawCollisions(layer);

                            break;

                        // Objects
                        case (layer.type == 'objectgroup') :
                            $.stage.drawObjects(layer);

                            break;

                        // Tile Layer
                        default :
                            $.stage.drawTiles(layer);

                            break;
                    }
                });

                for (i = 0; i < $('#player, .npc, .object, .tiles3').length; i++) {
                    $.game.calculateZindex($('#player, .npc, .object, .tiles3').eq(i));
                }

                $.stage.center();

                if (data.properties.music && $.sounds.currentMusic != $.sounds.music[data.properties.music]) {
                    // $.sounds.changeMusic($.sounds.music[data.properties.music], 0);
                }

                transition.animate({
                    opacity: 0
                }, 180);
            }).fail(function (jqXHR, textStatus, errorThrown) {

            }).always(function (data, textStatus, jqXHR) {

            });
        });
    }

    this.scrollStage = function (direction) {
        var player      = $('#player'),
            playerOff   = player.offset(),
            offset      = 0,
            scrollArea  = $('#scroll-area'),
            stage       = $('#stage'),
            stagePos    = stage.position(),
            stageL      = stagePos.left,
            stageT      = stagePos.top,
            windowH     = $(window).height(),
            windowW     = $(window).width();

        if (($.stage.width > windowW || $.stage.height > windowH)) {
            switch (direction) {
                case $.game.directions.up:
                    if ((playerOff.top + ($.game.gridCellSize / 2)) < (windowH / 2) && stageT < 0) {
                        stage.stop().animate({
                            top: stageT + $.game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case $.game.directions.down:
                    if ((playerOff.top + ($.game.gridCellSize / 2)) > (windowH / 2)
                        && Math.abs(stageT - windowH) < $.stage.height) {
                        stage.stop().animate({
                            top: stageT - $.game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case $.game.directions.left:
                    if ((playerOff.left + ($.game.gridCellSize / 2)) < (windowW / 2) && stageL < 0) {
                        stage.stop().animate({
                            left: stageL + $.game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                case $.game.directions.right:
                    if ((playerOff.left + ($.game.gridCellSize / 2)) > (windowW / 2)
                        && Math.abs(stageL - windowW) < $.stage.width) {
                        stage.stop().animate({
                            left: stageL - $.game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;
            }
        }
    }
}

$.fn.stage = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('stage')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('stage')[option].call (this[0]);
    } else {
        return element.data('stage');
    }
}

$.stage = new Stage();
