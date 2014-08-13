
/** PLAYER ****************************************************************************************/

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
        if (Game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        // Spacebar, Enter
        if (Game.pressedKeys[13] || Game.pressedKeys[32]) {
            var collision = Game.checkCollisions(player, player.data('player')['direction']);

            $.player.allowPress = false;

            if (collision) {
                switch (true) {
                    case (collision) :
                        // Do nothing

                        break;

                    case (collision.is('.npc')) :
                        collision.npc('talk', Dialogue[collision.data('npc')['dialogueId']]);

                        break;
                }
            }
        }

        switch (true) {

            // W, Up Arrow
            case ((Game.pressedKeys[87] || Game.pressedKeys[38])) :
                var direction = player.data('player')['direction'] = Game.directions.up;

                player.player('move', direction);

                break;

            // S, Down Arrow
            case ((Game.pressedKeys[83] || Game.pressedKeys[40])) :
                var direction = player.data('player')['direction'] = Game.directions.down;

                player.player('move', direction);

                break;

            // A, Left Arrow
            case ((Game.pressedKeys[65] || Game.pressedKeys[37])) :
                var direction = player.data('player')['direction'] = Game.directions.left;

                player.player('move', direction);

                break;

            // D, Right Arrow
            case ((Game.pressedKeys[68] || Game.pressedKeys[39])) :
                var direction = player.data('player')['direction'] = Game.directions.right;

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

        if (data.properties.prevArea === Game.prevArea) {
            $('#objects').append('<div id="player" style="left: ' + data.x + 'px; top: ' + (data.y - 32) + 'px;"><div id="player-sprite" class="' + Game.currentDirection + '"></div></div>');

            player = $('#player');

            player.data('player', new Player());

            if (!Stage.playersMap[(data.y / Game.gridCellSize) - 1]) {
                Stage.playersMap[(data.y / Game.gridCellSize) - 1] = {};
            }

            Stage.playersMap[(data.y / Game.gridCellSize) - 1][(data.x / Game.gridCellSize)] = player;
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
            playerPos       = Game.getCoordinates(player);
            playerSprite    = $('#player-sprite');

        if (player.data('player')['allowMove']) {
            var collision = Game.checkCollisions(player, direction);

            Game.currentDirection = direction;

            playerSprite.removeClass().addClass('walking ' + direction);

            if (collision) {
                switch (true) {

                    // Not Doorway or Stairs
                    case (collision) :
                        playerSprite.removeClass('walking');

                        Sounds.fx.bump.play();

                        break;

                    // Doorway
                    case (collision.is('.doorway')) :
                        player.data('player')['allowMove'] = false;

                        Sounds.fx.door.play();

                        Game.moveObject(player, direction, function () {
                            var newPos = Game.getCoordinates(player);

                            if (!Stage.playersMap[newPos.y]) {
                                Stage.playersMap[newPos.y] = {};
                            }

                            Stage.playersMap[newPos.y][newPos.x] = player;

                            Sounds.fx.enter.play();

                            delete Stage.playersMap[playerPos.y][playerPos.x];

                            Stage.init(collision.attr('data-area'));
                        });

                        break;

                    // Stairs
                    case (collision.is('.stairs')) :
                        player.data('player')['allowMove'] = false;

                        Sounds.fx.enter.play();

                        player.player('useStairs', collision.attr('data-direction'), function () {
                            Stage.init(collision.attr('data-area'));
                        });

                        break;
                }
            } else {
                player.data('player')['allowMove'] = false;

                Game.moveObject(player, direction, function () {
                    var newPos = Game.getCoordinates(player);

                    player.data('player')['allowMove'] = true;

                    if (!Stage.playersMap[newPos.y]) {
                        Stage.playersMap[newPos.y] = {};
                    }

                    Stage.playersMap[newPos.y][newPos.x] = player;

                    delete Stage.playersMap[playerPos.y][playerPos.x];
                });

                Stage.scrollStage(direction);
            }
        }
    }

    /**
     *
     */
    this.useStairs = function (direction, callback) {
        var
            player      = $(this),
            playerPos   = player.position(),
            offsetL     = 0,
            offsetT     = 0;

        switch (direction) {

            // Down & Left
            case 'dl':
                offsetL = -32;
                offsetT = 0; // Player clips through the stairs if set to 32

                break;

            // Down & Right
            case 'dr':
                offsetL = 32;
                offsetT = 32;

                break;

            // Up & Left
            case 'ul':
                offsetL = -32;
                offsetT = -32;

                break;

            // Up & Right
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
