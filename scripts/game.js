
Game = {
    fps: 60,

    states: {
        activeNPC: ''
    },

    engine: {
        friction        : 0.4,
        pressedKeys     : [],
        player          :
        {
            allowMoving : true,
            direction   : null
        },
        scrollAmount    : 1,

        /**
         *
         */
        collisionCheck: function () {
            for (var i = 0; i < $('.obstacle, .npc').length; i++) {
                var
                    player              = $('#player'),
                    playerCollision     = $('#player-collision'),
                    obstacle            = $('.obstacle, .npc').eq(i),
                    obstacleCollision   = obstacle.is('.npc') ? obstacle.find('.npc-collision') : obstacle,
                    playerH             = playerCollision.outerHeight(),
                    playerL             = parseFloat(player.css('left')),
                    playerT             = parseFloat(player.css('top')) + parseFloat(playerCollision.css('top')),
                    playerW             = player.outerWidth(),
                    obstacleH           = obstacleCollision.outerHeight(),
                    obstacleL           = parseFloat(obstacle.css('left')),
                    obstacleT           = obstacle.is('npc') ? parseFloat(obstacle.css('top')) + parseFloat(obstacleCollision.css('top')) : parseFloat(obstacleCollision.css('top')),
                    obstacleW           = obstacle.outerWidth();

                switch (Game.engine.player.direction) {
                    case 'l':
                        playerL -= (32 * Game.engine.player.speedMultiplier);

                        break;

                    case 'u':
                        playerT -= (32 * Game.engine.player.speedMultiplier);

                        break;

                    case 'r':
                        playerL += (32 * Game.engine.player.speedMultiplier);

                        break;

                    case 'd':
                        playerT += (32 * Game.engine.player.speedMultiplier);

                        break;
                }

                var
                    vX          = (playerL + (playerW / 2)) - (obstacleL + (obstacleW / 2)),
                    vY          = (playerT + (playerH / 2)) - (obstacleT + (obstacleH / 2)),
                    hWidths     = (playerW / 2) + (obstacleW / 2),
                    hHeights    = (playerH / 2) + (obstacleH / 2);

                if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                    var
                        dir = '',
                        oX  = hWidths - Math.abs(vX),
                        oY  = hHeights - Math.abs(vY);

                    if (oX >= oY) {
                        if (vY > 0) {
                            dir = 'u';
                        } else {
                            dir = 'd';
                        }
                    } else {
                        if (vX > 0) {
                            dir = 'l';
                        } else {
                            dir = 'r';
                        }
                    }

                    return {
                        state: true,
                        direction: dir
                    };
                }
            }

            return {
                state: false,
                direction: null
            };
        },

        /**
         *
         */
        update: function () {
            var
                player  = $('#player'),
                left    = parseFloat(player.css('left')),
                top     = parseFloat(player.css('top'));

            Game.engine.player.direction = null;
            Game.engine.player.speedMultiplier = 1;

            if (Game.engine.pressedKeys[16]) { // Shift
                Game.engine.player.speedMultiplier = 2;
            }

            switch (true) {
                case ((Game.engine.pressedKeys[65] || Game.engine.pressedKeys[37]) && !player.is(':animated')) : // A, Left
                    Game.engine.player.direction = 'l';

                    var collide = Game.engine.collisionCheck();

                    player.removeClass('down right up').addClass('walking left');

                    if (collide.state == false && collide.direction != Game.engine.player.direction && !player.is(':animated')) {
                        player.stop().animate({
                            left: left - (32 * Game.engine.player.speedMultiplier)
                        }, 200, 'linear', function () {

                        });
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.engine.pressedKeys[87] || Game.engine.pressedKeys[38]) && !player.is(':animated')) : // W, Up
                    Game.engine.player.direction = 'u';

                    var collide = Game.engine.collisionCheck();

                    player.removeClass('down left right').addClass('walking up');

                    if (collide.state == false && collide.direction != Game.engine.player.direction && !player.is(':animated')) {
                        player.stop().animate({
                            top: top - (32 * Game.engine.player.speedMultiplier)
                        }, 200, 'linear', function () {

                        });
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.engine.pressedKeys[68] || Game.engine.pressedKeys[39]) && !player.is(':animated')) : // D, Right
                    Game.engine.player.direction = 'r';

                    var collide = Game.engine.collisionCheck();

                    player.removeClass('down left up').addClass('walking right');

                    if (collide.state == false && collide.direction != Game.engine.player.direction && !player.is(':animated')) {
                        player.stop().animate({
                            left: left + (32 * Game.engine.player.speedMultiplier)
                        }, 200, 'linear', function () {

                        });
                    } else {
                        player.removeClass('walking');
                    }

                    break;

                case ((Game.engine.pressedKeys[83] || Game.engine.pressedKeys[40]) && !player.is(':animated')) : // S, Down
                    Game.engine.player.direction = 'd';

                    var collide = Game.engine.collisionCheck();

                    player.removeClass('left right up').addClass('walking down');

                    if (collide.state == false && collide.direction != Game.engine.player.direction && !player.is(':animated')) {
                        player.stop().animate({
                            top: top + (32 * Game.engine.player.speedMultiplier)
                        }, 200, 'linear', function () {

                        });
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

            // Game.cameraCheck();
        },
    },

    player: {

    },

    start: function () {
        setInterval(function () {
            Game.engine.update();
        }, 1000 / Game.fps);

        $('#sprites').append('<div id="player" tabindex="0" style="left: 64px; top: 312px;"><div id="player-collision"></div></div>');

        $('#player').trigger('focus');

        $.npc.create(
            'npc0',
            {
                height  : 40,
                width   : 32
            },
            {
                left    : 128,
                top     : 184
            },
            'd0'
        );

        $.npc.create(
            'npc1',
            {
                height  : 40,
                width   : 32
            },
            {
                left    : 160,
                top     : 216
            },
            'd1'
        );
    }
};

/** PLAYER **/

$(document).on('keydown', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.engine.pressedKeys[event.keyCode] = true;
});

$(document).on('keyup', '#player', function (event) {
    var key = event.keyCode || event.which;

    Game.engine.pressedKeys[event.keyCode] = false;
});

/** NPCS **/

function NPC () {
    this.dialogue   = 'd0';
    this.id         = 0;

    /**
     *
     */
    this.create = function (id, size, position, dialogue) {
        var npc = $('#' + id);

        if (npc.length === 0) {
            $('#sprites').append('<div id="' + id + '" class="npc"><div class="npc-collision"></div></div>');
        } else {
            return false;
        }

        npc = $('#' + id);

        npc.data('npc', new NPC());

        npc.data('npc')['id']       = id;
        npc.data('npc')['dialogue'] = dialogue;

        npc.css({
            left    : position.left + 'px',
            top     : position.top + 'px',
            zIndex  : position.zIndex
        });
    },

    /**
     *
     */
    this.destroyEmote = function () {
        var npc = $(this);

        npc.find('.emote').animate({
            opacity : 0,
            top     : '-48px'
        }, 100, function () {
            $(this).remove();
        });
    }

    /**
     *
     */
    this.emote = function (emotion) {
        var npc     = $(this),
            emote   = npc.find('.emote');

        if (emote.length === 0) {
            npc.html('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>');

            npc.find('.emote').animate({
                opacity : 1,
                top     : '-32px'
            }, 100);
        } else {
            npc.html('<div class="emote ' + emotion + '"></div>');
        }
    },

    /**
     *
     */
    this.move = function (direction, steps) {
        var npc     = $(this),
            speed   = 2;

        switch (direction) {
            case 'd':
                var top = parseFloat(npc.css('top'));

                npc.animate({
                    top: top + (steps * speed)
                }, 200);

                break;

            case 'l':
                var left = parseFloat(npc.css('left'));

                npc.animate({
                    left: left - (steps * speed)
                }, 200);

                break;

            case 'r':
                var left = parseFloat(npc.css('left'));

                npc.animate({
                    left: left + (steps * speed)
                }, 200);

                break;

            case 'u':
                var top = parseFloat(npc.css('top'));

                npc.animate({
                    top: top - (steps * speed)
                }, 200);

                break;
        }
    },

    /**
     *
     */
    this.talk = function (dialogue) {
        var npc = $(this);

        Game.states.activeNPC = npc;

        $.window.create(
            'dialogue',
            {
                height  : 110,
                width   : 640
            },
            {
                left    : 20,
                top     : 20
            },
            Dialogues[dialogue]
        );
    }
}

$.fn.npc = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('npc')[option].apply(this[0], [].concat(otherArgs));
    } else if (typeof option !== 'undefined') {
        return element.data('npc')[option].call (this[0]);
    } else {
        return element.data('npc');
    }
}

$.npc = new NPC();

/** START **/

$(document).on('ready', function () {
    Game.start();
});

/** WINDOWS **/

function Window () {
    this.backgroundColor = '#303030',
    this.id              = 0,

    /**
     *
     */
    this.create = function (id, size, position, content) {
        var modal = $('#' + id);

        if (modal.length === 0) {
            $('#windows').append('<div id="' + id + '" class="window"><div class="window-content" tabindex="0"></div></div>');
        } else {
            return false;
        }

        modal = $('#' + id);

        modal.data('window', new Window());

        modal.data('window')['id'] = id;

        modal.css({
            backgroundColor: modal.data('window')['backgroundColor']
        });

        modal.animate({
            height  : size.height + 'px',
            left    : position.left + 'px',
            top     : position.top + 'px',
            width   : size.width + 'px',
            zIndex  : position.zIndex
        }, 200, function () {
            $(this).window('populate', content);
        });
    },

    /**
     *
     */
    this.destroy = function (id, focus) {
        var
            modal = $('#' + id),
            modalContent = modal.find('.window-content');

        modalContent.html('');

        modal.animate({
            height  : '30px',
            left    : '0px',
            top     : '0px',
            width   : '30px',
            zIndex  : '0'
        }, 200, function () {
            $(this).remove();
        });

        if (Game.states.activeNPC) {
            Game.states.activeNPC.npc('destroyEmote');
        }

        focus.trigger('focus');
    },

    /**
     *
     */
    this.option = function (option, value) {
        var
            element = $(this),
            data    = element.data('window');

        if (typeof value === 'undefined') {
            return data[option];
        } else {
            data[option] = value;

            switch (option) {
                case 'backgroundColor':
                    element.css({
                        backgroundColor: value
                    });

                    break;
            }
        }
    },

    /**
     *
     */
    this.populate = function (content) {
        var
            emote           = content.emote,
            modal           = $(this),
            modalContent    = modal.find('.window-content'),
            npc             = Game.states.activeNPC,
            type            = content.type;

        if (npc && emote) {
            npc.npc('emote', emote);
        }

        switch (type) {
            case 'choice':
                var choices = '<ul class="choice">';

                $.each(content.choices, function (index, value) {
                    choices += '<li tabindex="0">' + value.label + '</li>'
                });

                choices += '</ul>';

                modalContent.html(choices).find('li:first').trigger('focus');

                //
                modalContent.off().on('keyup', function (event) {
                    var choice  = $(document.activeElement),
                        key     = event.keyCode || event.which;

                    switch (key) {
                        case 13:
                        case 32: // Enter, Spacebar
                            var choice = content.choices[choice.index()];

                            if (choice.action) {
                                choice.action();
                            }

                            if (choice.goTo) {
                                return modal.window('populate', Dialogues[choice.goTo]);
                            }

                            break;

                        case 38:
                        case 87: // Up Arrow
                            choice.prev('li').trigger('focus');

                            break;

                        case 40:
                        case 83: // Down Arrow
                            choice.next('li').trigger('focus');

                            break;
                    }
                });

                break;

            case 'dialogue':
                modalContent.html(content.text).trigger('focus');

                if (content.action) {
                    content.action();
                }

                //
                modalContent.off().on('keyup', function (event) {
                    var key = event.keyCode || event.which;

                    switch (key) {
                        case 13:
                        case 32: // Enter, Spacebar
                            if (content.goTo) {
                                return modal.window('populate', Dialogues[content.goTo]);
                            } else if (content.end) {
                                return modal.window('destroy', modal.data('window')['id'], $('#player'));
                            }

                            break;
                    }
                });

                break;
        }
    }
}

$.fn.window = function (option) {
    var
        element     = $(this[0]),
        otherArgs   = Array.prototype.slice.call(arguments, 1);

    if (typeof option !== 'undefined' && otherArgs.length > 0) {
        return element.data('window')[option].apply(this[0], [].concat(otherArgs));
    }

    return element.data('window');
}

$.window = new Window();
