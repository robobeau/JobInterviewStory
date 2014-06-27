
Game = {
    activeNPC   : '',
    directions  : [
        'u',
        'd',
        'l',
        'r'
    ],
    fps         : 60,
    pressedKeys : [],

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
    collisionCheck: function (object, direction) {
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
            objectOffsetT       = object.is('#player, .npc') ? 8 : 0;
            obstacle            = $('#player, .npc, .collision, .doorway').filter(function () {
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
            vX                  = (objectL + (objectW / 2)) - (obstacleL + (obstacleW / 2)),
            vY                  = (objectT + (objectH / 2)) - (obstacleT + (obstacleH / 2)),
            hWidths             = (objectW / 2) + (obstacleW / 2),
            hHeights            = (objectH / 2) + (obstacleH / 2);

        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights && obstacle.is(':not(.doorway)')) {
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
            doorway     : obstacle.is('.doorway'),
            area        : obstacle.is('.doorway') ? obstacle.attr('rel') : ''
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
            200,
            'linear',
            function () {
                Game.calculateZindex(object);

                if (callback) {
                    callback();
                }
            }
        );
    },

    /**
     *
     */
    start: function () {
        setInterval(function () {
            Game.update();
        }, 1000 / Game.fps);

        Stage.init('a001');

        for (i = 0; i < $('#player, .npc, .object').length; i++) {
            Game.calculateZindex($('#player, .npc, .object').eq(i));
        }
    },

    /**
     *
     */
    update: function () {
        var
            player  = $('#player'),
            left    = parseFloat(player.css('left')),
            top     = parseFloat(player.css('top'));

        if (player.length > 0) { // Don't bother updating if there isn't a player
            player.data('player')['speedMultiplier'] = 1;

            if (Game.pressedKeys[16]) { // Shift
                player.data('player')['speedMultiplier'] = 2;
            }

            if (Game.pressedKeys[13] || Game.pressedKeys[32]) { // Spacebar, Enter
                var collide = Game.collisionCheck(player, player.data('player')['direction']);

                if (collide.state == true && !player.is(':animated')) {
                    if (collide.obstacle.is('.npc')) {
                        collide.obstacle.npc('talk', collide.obstacle.data('npc')['dialogue']);
                    }
                }
            }

            switch (true) {
                case ((Game.pressedKeys[87] || Game.pressedKeys[38]) && !player.is(':animated')) : // W, Up Arrow
                    player.data('player')['direction'] = 'u';

                    var collide = Game.collisionCheck(player, player.data('player')['direction']);

                    player.removeClass('down left right').addClass('walking up');

                    if (collide.state == false && !player.is(':animated')) {
                        Game.moveObject(player, player.data('player')['direction']);

                        if (collide.doorway) {
                            Stage.init(collide.area);
                        }
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.pressedKeys[83] || Game.pressedKeys[40]) && !player.is(':animated')) : // S, Down Arrow
                    player.data('player')['direction'] = 'd';

                    var collide = Game.collisionCheck(player, player.data('player')['direction']);

                    player.removeClass('left right up').addClass('walking down');

                    if (collide.state == false && !player.is(':animated')) {
                        Game.moveObject(player, player.data('player')['direction']);

                        if (collide.doorway) {
                            Stage.init(collide.area);
                        }
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.pressedKeys[65] || Game.pressedKeys[37]) && !player.is(':animated')) : // A, Left Arrow
                    player.data('player')['direction'] = 'l';

                    var collide = Game.collisionCheck(player, player.data('player')['direction']);

                    player.removeClass('down right up').addClass('walking left');

                    if (collide.state == false && !player.is(':animated')) {
                        Game.moveObject(player, player.data('player')['direction']);

                        if (collide.doorway) {
                            Stage.init(collide.area);
                        }
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.pressedKeys[68] || Game.pressedKeys[39]) && !player.is(':animated')) : // D, Right Arrow
                    player.data('player')['direction'] = 'r';

                    var collide = Game.collisionCheck(player, player.data('player')['direction']);

                    player.removeClass('down left up').addClass('walking right');

                    if (collide.state == false && !player.is(':animated')) {
                        Game.moveObject(player, player.data('player')['direction']);

                        if (collide.doorway) {
                            Stage.init(collide.area);
                        }
                    } else {
                        player.removeClass('walking');
                    }

                    break;


                default:
                    if (!player.is(':animated')) {
                        player.removeClass('walking');
                    }

                    break;
            }
        }

        // Game.cameraCheck();
    }
};

/** PLAYER **/

function Player () {
    this.allowMoving        = true;
    this.direction          = null;
    this.speedMultiplier    = 1;

    /**
     *
     */
    this.create = function (data) {
        var player;

        $('#objects').append('<div id="player" tabindex="0" style="left: ' + data.x + 'px; top: ' + ((data.y - 8) - 32) + 'px;"><div id="player-collision"></div></div>');

        player = $('#player');

        player.data('player', new Player());

        player.trigger('focus');
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
