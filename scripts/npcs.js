
/** NPCS ******************************************************************************************/

function NPC () {
    this.dialogueId     = 'd000';
    this.id             = 0;
    this.talking        = false;
    this.wanderInterval = '';
    this.wanderPause    = false;

    /**
     *
     */
    this.create = function (data) {
        var npc;

        $('#objects').append('<div id="' + data.name + '" class="npc"><div class="npc-sprite"></div></div>');

        npc = $('#' + data.name);

        npc.data('npc', new NPC());

        npc.data('npc')['id']           = data.name;
        npc.data('npc')['dialogueId']   = data.properties.dialogue;

        npc.css({
            left    : data.x + 'px',
            top     : (data.y - Game.gridCellSize) + 'px'
        });

        if (!Stage.npcsMap[(data.y / Game.gridCellSize) - 1]) {
            Stage.npcsMap[(data.y / Game.gridCellSize) - 1] = {};
        }

        Stage.npcsMap[(data.y / Game.gridCellSize) - 1][(data.x / Game.gridCellSize)] = npc;

        if (data.properties.wander) {
            npc.npc('wander');
        }
    },

    /**
     *
     */
    this.destroy = function () {
        var npc = $(this);

        clearInterval(npc.data('npc')['wanderInterval']);

        npc.remove();
    }

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
        var
            npc     = $(this),
            emote   = npc.find('.emote');

        if (emote.length === 0) {
            npc.append('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>');

            npc.find('.emote').animate({
                opacity : 1,
                top     : '-32px'
            }, 100);
        } else {
            npc.find('.emote').replaceWith('<div class="emote ' + emotion + '"></div>');
        }
    },

    /**
     *
     */
    this.move = function (direction) {
        var
            npc         = $(this),
            collision   = Game.checkCollisions(npc, direction),
            npcPos      = Game.getCoordinates(npc),
            npcSprite   = npc.find('.npc-sprite');

        Game.currentDirection = direction;

        npcSprite.removeClass('walking up down left right').addClass('walking ' + direction);

        if (collision) {
            npcSprite.removeClass('walking');
        } else {
            Game.moveObject(npc, direction, function () {
                var newPos = Game.getCoordinates(npc);

                if (!Stage.npcsMap[newPos.y]) {
                    Stage.npcsMap[newPos.y] = {};
                }

                Stage.npcsMap[newPos.y][newPos.x] = npc;

                delete Stage.npcsMap[npcPos.y][npcPos.x];

                npcSprite.removeClass('walking');
            });
        }
    },

    /**
     *
     */
    this.talk = function (dialogue) {
        var npc = $(this);

        if ($.npc.talking) {
            return;
        }

        $.npc.talking                   = true;
        npc.data('npc')['wanderPause']  = true;

        Game.activeNPC = npc;

        $.modals.create(
            {
                height  : 80,
                width   : 720
            },
            {
                left    : ($(window).width() - (720 + Game.gridCellSize)) / 2,
                top     : 20
            },
            dialogue,
            npc
        );
    },

    /**
     *
     */
    this.wander = function () {
        var npc = $(this);

        clearInterval(npc.data('npc')['wanderInterval']);

        npc.data('npc')['wanderInterval'] = setInterval(function () {
            var
                direction = Game.directions[Object.keys(Game.directions)[Math.floor(Math.random() * Object.keys(Game.directions).length)]];

            if (Math.random() < 0.5 || npc.data('npc')['wanderPause'] === true) {
                return;
            }

            npc.npc('move', direction);

        }, 1800);
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
