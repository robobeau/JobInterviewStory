/// <reference path="../node_modules/definitely-typed-jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

class NPCs {
    public dialogueId: string = 'd000';
    public id: number = 0;
    public npc: any;
    public talking: boolean = false;
    public wanderInterval: any;
    public wanderPause: boolean = false;

    constructor() {

    }

    public create(data: any) {
        var npc;

        (<JQuery>$('#objects')).append(
            '<div id="' + data.name + '" class="npc">' +
                '<div class="npc-sprite"></div>' +
            '</div>'
        );

        npc = (<JQuery>$('#' + data.name));

        npc.data('npc', new NPCs());

        npc.data('npc').dialogueId = data.properties.dialogue;
        npc.data('npc').id = data.name;
        npc.data('npc').npc = npc;

        npc.css({
            left: data.x + 'px',
            top: (data.y - game.gridCellSize) + 'px'
        });

        if (!stage.npcsMap[(data.y / game.gridCellSize) - 1]) {
            stage.npcsMap[(data.y / game.gridCellSize) - 1] = {};
        }

        stage.npcsMap[(data.y / game.gridCellSize) - 1][(data.x / game.gridCellSize)] = npc;

        if (data.properties.wander) {
            npc.data('npc').wander();
        }
    }

    public destroy() {
        clearInterval(this.wanderInterval);

        if (this.npc) {
            this.npc.remove();
        }
    }

    public destroyEmote() {
        this.npc.find('.emote')
            .animate(
                {
                    opacity: 0,
                    top: '-48px'
                },
                100,
                'linear',
                () => {
                    (<JQuery>$(this)).remove();
                }
            );
    }

    public emote(emotion) {
        var emote = this.npc.find('.emote');

        if (emote.length === 0) {
            this.npc.append('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>');

            this.npc.find('.emote')
                .animate(
                    {
                        opacity: 1,
                        top: '-32px'
                    },
                    100,
                    'linear'
                );
        } else {
            this.npc.find('.emote')
                .replaceWith('<div class="emote ' + emotion + '"></div>');
        }
    }

    public move(direction) {
        var collision = game.checkCollisions(this.npc, direction);
        var npcPos = game.getCoordinates(this.npc);
        var npcSprite = this.npc.find('.npc-sprite');

        game.currentDirection = direction;

        npcSprite.removeClass('walking up down left right')
            .addClass('walking ' + direction);

        if (collision) {
            npcSprite.removeClass('walking');
        } else {
            game.moveObject(this.npc, direction, () => {
                var newPos = game.getCoordinates(this.npc);

                if (!stage.npcsMap[newPos.y]) {
                    stage.npcsMap[newPos.y] = {};
                }

                stage.npcsMap[newPos.y][newPos.x] = this.npc;

                delete stage.npcsMap[npcPos.y][npcPos.x];

                npcSprite.removeClass('walking');
            });
        }
    }

    public talk(dialogue) {
        if (this.talking) {
            return;
        }

        this.talking = true;
        this.wanderPause = true;

        game.activeNPC = this.npc;

        // modals.create(
        //     {
        //         height  : 80,
        //         width   : 720
        //     },
        //     {
        //         left    : ((<JQuery>$(window)).width() - (720 + game.gridCellSize)) / 2,
        //         top     : 20
        //     },
        //     dialogue,
        //     this.npc
        // );
    }

    public wander() {
        clearInterval(this.wanderInterval);

        this.wanderInterval = setInterval(() => {
            var direction = game.directions[Object.keys(game.directions)[Math.floor(Math.random() * Object.keys(game.directions).length)]];

            if (Math.random() < 0.5 || this.wanderPause === true) {
                return;
            }

            this.move(direction);

        }, 1800);
    }
}

var npcs = new NPCs();