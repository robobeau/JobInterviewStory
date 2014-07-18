
/** PLAYER **/

function Player () {
    this.allowMove          = true;
    this.allowPress         = true;
    this.direction          = null;
    this.speedMultiplier    = 1;

    /**
     *
     */
    this.checkButtons = function () {
        var player = $('#player');

        if (player.length == 0) {
            return;
        }

        var
            allowMove       = player.data('player')['allowMove'],
            allowPress      = $.player.allowPress;
            playerSprite    = $('#player-sprite');

        if (!allowPress) {
            return;
        }

        player.data('player')['speedMultiplier'] = 1;

        // Shift

        if ($.game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        // Spacebar, Enter

        if ($.game.pressedKeys[13] || $.game.pressedKeys[32]) {
            var collision = $.game.checkCollisions(player, player.data('player')['direction']);

            $.player.allowPress = false;

            if (collision) {
                switch (true) {
                    case (collision) :
                        // Do nothing

                        break;

                    case (collision.is('.npc')) :
                        collision.npc('talk', collision.data('npc')['dialogue']);

                        break;
                }
            }
        }

        switch (true) {

            // W, Up Arrow

            case (($.game.pressedKeys[87] || $.game.pressedKeys[38])) :
                var direction = player.data('player')['direction'] = $.game.directions.up;

                player.player('move', direction);

                break;

            // S, Down Arrow

            case (($.game.pressedKeys[83] || $.game.pressedKeys[40])) :
                var direction = player.data('player')['direction'] = $.game.directions.down;

                player.player('move', direction);

                break;

            // A, Left Arrow

            case (($.game.pressedKeys[65] || $.game.pressedKeys[37])) :
                var direction = player.data('player')['direction'] = $.game.directions.left;

                player.player('move', direction);

                break;

            // D, Right Arrow

            case (($.game.pressedKeys[68] || $.game.pressedKeys[39])) :
                var direction = player.data('player')['direction'] = $.game.directions.right;

                player.player('move', direction);

                break;

            default:
                playerSprite.removeClass('walking');

                break;
        }
    }

    /**
     *
     */
    this.create = function (data) {
        var player;

        if (data.properties.prevArea === $.game.prevArea) {
            $('#objects').append('<div id="player" style="left: ' + data.x + 'px; top: ' + (data.y - 32) + 'px;"><div id="player-sprite" class="' + $.game.currentDirection + '"></div></div>');

            player = $('#player');

            player.data('player', new Player());

            player.trigger('focus');
        }
    }

    /**
     *
     */
    this.destroy = function () {
        var player = $(this);

        player.remove();
    }

    /**
     *
     */
    this.move = function (direction, callback) {
        var
            player          = $(this),
            playerSprite    = $('#player-sprite');

        if (player.data('player')['allowMove']) {
            var collision = $.game.checkCollisions(player, direction);

            $.game.currentDirection = direction;

            playerSprite.removeClass().addClass('walking ' + direction);

            if (collision) {
                switch (true) {
                    case (collision) :
                        playerSprite.removeClass('walking');

                        $.sounds.fx.bump.play();

                        break;

                    case (collision.is('.doorway')) :
                        player.data('player')['allowMove'] = false;

                        $.sounds.fx.door.play();

                        $.game.moveObject(player, direction, function () {
                            $.sounds.fx.enter.play();

                            $.stage.init(collision.attr('data-area'));
                        });

                        break;

                    case (collision.is('.stairs')) :
                        player.data('player')['allowMove'] = false;

                        $.sounds.fx.enter.play();

                        player.player('useStairs', collision.attr('data-direction'), function () {
                            $.stage.init(collision.attr('data-area'));
                        });

                        break;
                }
            } else {
                player.data('player')['allowMove'] = false;

                $.game.moveObject(player, direction, function () {
                    player.data('player')['allowMove'] = true;
                });

                $.stage.scrollStage(direction);
            }
        }
    }

    /**
     *
     */
    this.useStairs = function (direction, callback) {
        var player      = $(this),
            playerPos   = player.position(),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {
            case 'dl':
                offsetL = -32;
                offsetT = 0;

                break;

            case 'dr':
                offsetL = 32;
                offsetT = 32;

                break;

            case 'ul':
                offsetL = -32;
                offsetT = -32;

                break;

            case 'ur':
                offsetL = 32;
                offsetT = -32;

                break;
        }

        player.addClass('walking').stop().animate({
            left    : playerPos.left + offsetL,
            top     : playerPos.top + offsetT
        }, 180, 'linear', function () {
            if (callback) {
                callback();
            }
        });
    }
}

$.fn.player = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('player')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('player')[option].call (this[0]);
    } else {
        return element.data('player');
    }
}

$.player = new Player();
