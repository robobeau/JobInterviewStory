
Game = {
    activeNPC       : '',
    areaObstacles   : '',
    currentArea     : 'a000',
    directions      : [
        'u',
        'd',
        'l',
        'r'
    ],
    fps             : 60,
    gridCellSize    : 32,
    pressedKeys     : [],
    prevArea        : 'a000',

    /**
     *
     */
    calculateZindex: function (object) {
        var objectCollision = object.is('#player, .npc') ? object.find('#player-collision, .npc-collision') : object;

        object.css({
            zIndex: objectCollision.offset().top
        });
    },

    /**
     *
     */
    checkButtons: function () {
        var
            player  = $('#player'),
            left    = parseFloat(player.css('left')),
            top     = parseFloat(player.css('top'));

        player.data('player')['speedMultiplier'] = 1;

        // Shift

        if (Game.pressedKeys[16]) {
            player.data('player')['speedMultiplier'] = 2;
        }

        // Spacebar, Enter

        if (Game.pressedKeys[13] || Game.pressedKeys[32]) {
            var collide = Game.checkCollision(player, player.data('player')['direction']);

            if (collide.state == true && player.data('player')['allowMove']) {
                if (collide.obstacle.is('.npc')) {
                    collide.obstacle.npc('talk', collide.obstacle.data('npc')['dialogue']);
                }
            }
        }

        switch (true) {

            // W, Up Arrow

            case ((Game.pressedKeys[87] || Game.pressedKeys[38]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'u';

                var collide = Game.checkCollision(player, player.data('player')['direction']);

                player.removeClass('down left right').addClass('walking up');

                if (collide.state == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collide.doorway || collide.stairs) {
                        if (collide.stairs) {
                            player.player('useStairs', collide.direction);
                        }

                        Stage.init(collide.area);
                    }
                } else {
                    player.removeClass('walking');
                }

                break;

            // S, Down Arrow

            case ((Game.pressedKeys[83] || Game.pressedKeys[40]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'd';

                var collide = Game.checkCollision(player, player.data('player')['direction']);

                player.removeClass('left right up').addClass('walking down');

                if (collide.state == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collide.doorway || collide.stairs) {
                        if (collide.stairs) {
                            player.player('useStairs', collide.direction);
                        }

                        Stage.init(collide.area);
                    }
                } else {
                    player.removeClass('walking');
                }

                break;

            // A, Left Arrow

            case ((Game.pressedKeys[65] || Game.pressedKeys[37]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'l';

                var collide = Game.checkCollision(player, player.data('player')['direction']);

                player.removeClass('down right up').addClass('walking left');

                if (collide.state == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collide.doorway || collide.stairs) {
                        if (collide.stairs) {
                            player.player('useStairs', collide.direction);
                        }

                        Stage.init(collide.area);
                    }
                } else {
                    player.removeClass('walking');
                }

                break;

            // D, Right Arrow

            case ((Game.pressedKeys[68] || Game.pressedKeys[39]) && player.data('player')['allowMove']) :
                player.data('player')['direction'] = 'r';

                var collide = Game.checkCollision(player, player.data('player')['direction']);

                player.removeClass('down left up').addClass('walking right');

                if (collide.state == false && player.data('player')['allowMove']) {
                    player.data('player')['allowMove'] = false;

                    Game.moveObject(player, player.data('player')['direction'], function () {
                        player.data('player')['allowMove'] = true;
                    });

                    if (collide.doorway || collide.stairs) {
                        if (collide.stairs) {
                            player.player('useStairs', collide.direction);
                        }

                        Stage.init(collide.area);
                    }
                } else {
                    player.removeClass('walking');
                }

                break;


            default:
                if (player.data('player')['allowMove']) {
                    player.removeClass('walking');
                }

                break;
        }
    },

    /**
     *
     */
    checkCollision: function (object, direction) {
        var offsetL = 0,
            offsetT = 0;

        switch (direction) {
            case 'u':
                offsetT = -32;

                break;

            case 'd':
                offsetT = 32;

                break;

            case 'l':
                offsetL = -32;

                break;

            case 'r':
                offsetL = 32;

                break;
        }

        var
            objectCollision     = object.is('#player, .npc') ? object.find('#player-collision, .npc-collision') : object,
            objectOffsetT       = object.is('#player, .npc') ? 8 : 0,
            obstacle            = Game.areaObstacles.filter(function () {
                var obstacleOffsetT = $(this).is('#player, .npc') ? 8 : 0;

                return parseFloat($(this).css('left')) == parseFloat(object.css('left')) + offsetL && parseFloat($(this).css('top')) + obstacleOffsetT == (parseFloat(object.css('top')) + offsetT + objectOffsetT);
            }),
            obstacleCollision   = obstacle.is('.npc') ? obstacle.find('.npc-collision') : obstacle,
            objectH             = objectCollision.outerHeight(),
            objectL             = parseFloat(object.css('left')) + offsetL,
            objectT             = parseFloat(object.css('top')) + parseFloat(objectCollision.css('top')) + offsetT,
            objectW             = object.outerWidth(),
            obstacleH           = obstacleCollision.outerHeight(),
            obstacleL           = parseFloat(obstacle.css('left')),
            obstacleT           = obstacle.is('.npc') ? parseFloat(obstacle.css('top')) + parseFloat(obstacleCollision.css('top')) : parseFloat(obstacleCollision.css('top')),
            obstacleW           = obstacle.outerWidth(),
            hWidths             = (objectW / 2) + (obstacleW / 2),
            hHeights            = (objectH / 2) + (obstacleH / 2),
            vX                  = (objectL + (objectW / 2)) - (obstacleL + (obstacleW / 2)),
            vY                  = (objectT + (objectH / 2)) - (obstacleT + (obstacleH / 2));

        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights && obstacle.is(':not(.doorway, .stairs)')) {
            // var
            //     dir = '',
            //     oX  = hWidths - Math.abs(vX),
            //     oY  = hHeights - Math.abs(vY);

            // if (oX >= oY) {
            //     if (vY > 0) {
            //         dir = 't';
            //     } else {
            //         dir = 'b';
            //     }
            // } else {
            //     if (vX > 0) {
            //         dir = 'l';
            //     } else {
            //         dir = 'r';
            //     }
            // }

            return {
                state       : true,
                obstacle    : obstacle
            };
        }

        return {
            state       : false,
            obstacle    : obstacle,
            doorway     : obstacle.is('.doorway'),
            area        : obstacle.is('.doorway, .stairs') ? obstacle.attr('data-area') : '',
            stairs      : obstacle.is('.stairs'),
            direction   : obstacle.is('.stairs') ? obstacle.attr('data-direction') : ''
        };
    },

    /**
     *
     */
    moveObject: function (object, direction, callback) {
        var
            animateOptions  = {},
            left            = parseFloat(object.css('left')),
            top             = parseFloat(object.css('top'));

        switch (direction) {
            case 'u':
                animateOptions = {
                    top: top - 32
                }

                break;

            case 'd':
                animateOptions = {
                    top: top + 32
                }

                break;

            case 'l':
                animateOptions = {
                    left: left - 32
                }

                break;

            case 'r':
                animateOptions = {
                    left: left + 32
                }

                break;

        }

        object.stop().animate(
            animateOptions,
            180,
            'linear',
            function () {
                Game.calculateZindex(object);

                if (callback) {
                    callback();
                }
            }
        );

        if (object.is('#player')) {
            Stage.scrollStage(direction);
        }
    },

    /**
     *
     */
    start: function () {
        setInterval(function () {
            Game.update();
        }, 1000 / Game.fps);

        Stage.init('a000');

        for (i = 0; i < $('#player, .npc, .object').length; i++) {
            Game.calculateZindex($('#player, .npc, .object').eq(i));
        }
    },

    /**
     *
     */
    update: function () {
        var player = $('#player');

        if (player.length > 0) { // Don't bother updating if there isn't a player
            Game.checkButtons();
        }
    }
};

/** PLAYER **/

function Player () {
    this.allowMove          = true;
    this.direction          = null;
    this.speedMultiplier    = 1;

    /**
     *
     */
    this.create = function (data) {
        var player;

        if (data.properties.prevArea === Game.prevArea) {
            $('#objects').append('<div id="player" tabindex="0" style="left: ' + data.x + 'px; top: ' + ((data.y - 8) - 32) + 'px;"><div id="player-collision"></div></div>');

            player = $('#player');

            player.data('player', new Player());

            player.trigger('focus');
        }
    },

    /**
     *
     */
    this.useStairs = function (direction, callback) {
        var player  = $(this),
            offsetL = 0,
            offsetT = 0;

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

        player.stop().animate({
            left    : parseFloat(player.css('left')) + offsetL,
            top     : parseFloat(player.css('top')) + offsetT
        }, 180, 'linear');
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


//
$(document).on('keydown', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = true;
});

//
$(document).on('keyup', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.pressedKeys[event.keyCode] = false;
});

/** START **/

//
$(document).on('ready', function () {
    Game.start();
});
