/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="battles.ts" />
/// <reference path="dialogue.ts" />
/// <reference path="game.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

interface INPC {
    dialogueId: string;
    id: string;
    self: any; // The NPC's jQuery object reference
    talking: boolean;
    wanderInterval: any;
    wanderPause: boolean;
}

class NPCs {
    constructor() {

    }

    public create(data: any) {
        var npc: JQuery = $('<div id="' + data.name + '" class="npc">' +
                                '<div class="npc-sprite"></div>' +
                            '</div>');

        var npcData = $.data(npc[0], 'npc', new NPC(npc));

        npcData.dialogueId = data.properties.dialogue;
        npcData.id = data.name;

        stage.objectsDiv.append(npc);

        npc.css({
            left: data.x + 'px',
            top: (data.y - game.gridCellSize) + 'px'
        });

        if (!stage.npcsMap[(data.y / game.gridCellSize) - 1]) {
            stage.npcsMap[(data.y / game.gridCellSize) - 1] = {};
        }

        stage.npcsMap[(data.y / game.gridCellSize) - 1][(data.x / game.gridCellSize)] = npc;

        if (data.properties.wander) {
            npcData.wander();
        }
    }
}

class NPC implements INPC {
    public dialogueId: string = 'd000';
    public id: string;
    public self: any;
    public talking: boolean = false;
    public wanderInterval: any;
    public wanderPause: boolean = false;

    constructor(npc: JQuery) {
        this.self = npc;
    }

    public battle() {
        console.log("BATTLE FARTS!!!");
        // battles.create(enemies[this.id]);
    }

    public destroy() {
        clearInterval(this.wanderInterval);

        this.self.remove();
    }

    public destroyEmote() {
        this.self.find('.emote')
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
        var emote = this.self.find('.emote');

        if (emote.length === 0) {
            emote = (<JQuery>$('<div class="emote ' + emotion + '" style="opacity: 0; top: -48px"></div>'));

            this.self.append(emote);

            emote.animate(
                {
                    opacity: 1,
                    top: '-32px'
                },
                100,
                'linear'
            );
        } else {
            emote.replaceWith('<div class="emote ' + emotion + '"></div>');
        }
    }

    public move(direction) {
        var collision: any = game.checkCollisions(this.self, direction);
        var npcPos = game.getCoordinates(this.self);
        var npcSprite = this.self.find('.npc-sprite');

        game.currentDirection = direction;

        npcSprite.removeClass('walking up down left right')
            .addClass('walking ' + Directions[direction]);

        if (collision) {
            npcSprite.removeClass('walking');
        } else {
            game.moveObject(this.self, direction, () => {
                var newPos = game.getCoordinates(this.self);

                if (!stage.npcsMap[newPos.y]) {
                    stage.npcsMap[newPos.y] = {};
                }

                stage.npcsMap[newPos.y][newPos.x] = this.self;

                delete stage.npcsMap[npcPos.y][npcPos.x];

                npcSprite.removeClass('walking');
            });
        }
    }

    public talk() {
        if (this.talking) {
            return;
        }

        this.talking = true;
        this.wanderPause = true;

        game.activeNPC = this.self;

        modals.create({
            dialogue: dialogue[this.dialogueId],
            npc: this.self,
            position: {
                left: ((<JQuery>$(window)).width() - (720 + game.gridCellSize)) / 2,
                top: 20
            },
            size: {
                height: 80,
                width: 720
            },
            type: 'dialogue'
        });
    }

    public wander() {
        clearInterval(this.wanderInterval);

        this.wanderInterval = setInterval(() => {
            if (Math.random() < 0.5 || this.wanderPause === true) {
                return;
            }

            this.move(Directions[Directions[Math.floor(Math.random() * 4)]]);
        }, Math.floor(Math.random() * (1800 - 600) + 600)); // @TODO: Tweak this more
    }
}

var npcs = new NPCs();