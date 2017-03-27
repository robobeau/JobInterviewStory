/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="game.ts" />
/// <reference path="modals.ts" />
/// <reference path="npcs.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

interface IPlayer {
    allowMove: boolean;
    allowPress: boolean;
    currentHP?: number;
    direction: any;
    maxHP?: number;
    self: any; // The player's jQuery object reference
    sprite: JQuery;
    speedMultiplier: number; // @TODO: Implement this. :P
    talking: boolean;
}

class Players {
    constructor() {

    }

    public create(data) {
        if (data.properties.prevArea === game.prevArea) {
            var player: JQuery = $('<div id="player" style="left: ' + data.x + 'px; top: ' + (data.y - 32) + 'px;">' +
                                    '<div id="player-sprite" class="' + game.currentDirection + '"></div>' +
                                '</div>');
            
            var playerData = $.data(player[0], 'player', new Player(player));

            playerData.sprite = player.find('#player-sprite');

            stage.objectsDiv.append(player);

            game.activePlayer = player;

            if (!stage.playersMap[(data.y / game.gridCellSize) - 1]) {
                stage.playersMap[(data.y / game.gridCellSize) - 1] = {};
            }

            stage.playersMap[(data.y / game.gridCellSize) - 1][(data.x / game.gridCellSize)] = player;
        }
    }
}

class Player implements IPlayer {
    public allowMove: boolean = true;
    public allowPress: boolean = true;
    public direction: any;
    public self: any;
    public sprite: JQuery;
    public speedMultiplier: number = 1;
    public talking: boolean = false;

    constructor(player: JQuery) {
        this.self = player;
    }

    public checkButtons() {
        if (!this.allowPress) {
            return;
        }

        if (game.pressedKeys[16]) { // Shift
            this.speedMultiplier = 2;
        } else {
            this.speedMultiplier = 1;
        }

        if (game.pressedKeys[13] || game.pressedKeys[32]) { // Spacebar, Enter
            this.allowPress = false;

            var collision: ICollisionObject = game.checkCollisions(this.self, this.direction);

            if (collision) {
                switch (collision.type) {
                    case 'npc':
                        this.allowMove = false;

                        collision.object.data('npc').talk();

                        break;
                    case 'flavor':
                        if (this.talking) {
                            return;
                        }

                        this.allowMove = false;
                        this.talking = true;

                        modals.create({
                            dialogue: flavor[collision.object.attr('dialogue')],
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

                        break;
                }
            }
        }

        if (game.pressedKeys[87] || game.pressedKeys[38]) { // W, Up Arrow
            game.currentDirection = this.direction = game.directions.up;

            this.move();
        } else if (game.pressedKeys[83] || game.pressedKeys[40]) { // S, Down Arrow
            game.currentDirection = this.direction = game.directions.down;

            this.move();
        } else if (game.pressedKeys[65] || game.pressedKeys[37]) { // A, Left Arrow
            game.currentDirection = this.direction = game.directions.left;

            this.move();
        } else if (game.pressedKeys[68] || game.pressedKeys[39]) { // D, Right Arrow
            game.currentDirection = this.direction = game.directions.right;

            this.move();
        } else {
            this.sprite.removeClass('walking');
        }
    }

    public destroy() {
        game.activePlayer = undefined;

        this.self.remove();
    }

    public move() {
        if (!this.allowMove) {
            return;
        }

        var collision: ICollisionObject = game.checkCollisions(this.self, this.direction);
        var pcMapPosition: IXYCoordinates = game.getCoordinates(this.self);

        this.sprite.removeClass().addClass('walking ' + this.direction);

        if (collision) {
            switch (collision.type) {
                case 'portal':
                    this.allowMove = false;

                    if (collision.object.is('.doorway')) {
                        this.useDoor(collision.object.attr('direction'), () => {
                            stage.init(collision.object.attr('area'));
                        });
                    } else if (collision.object.is('.stairs')) {
                        this.useStairs(collision.object.attr('direction'), () => {
                            stage.init(collision.object.attr('area'));
                        });
                    }

                    break;
                default:
                    this.sprite.removeClass('walking');

                    sounds.fx.bump.play();

                    break;
            }
        } else {
            this.allowMove = false;

            game.moveObject(this.self, this.direction, () => {
                var newPos = game.getCoordinates(this.self);

                if (!stage.playersMap[newPos.y]) {
                    stage.playersMap[newPos.y] = {};
                }

                stage.playersMap[newPos.y][newPos.x] = this.self;

                delete stage.playersMap[pcMapPosition.y][pcMapPosition.x];

                this.allowMove = true;
            });

            stage.scrollStage(this.direction);
        }
    }

    public useDoor(direction, callback) {
        var pcMapPosition: IXYCoordinates = game.getCoordinates(this.self);

        sounds.fx.door.play();

        game.moveObject(this.self, direction, () => {
            var newPos: IXYCoordinates = game.getCoordinates(this.self);

            if (!stage.playersMap[newPos.y]) {
                stage.playersMap[newPos.y] = {};
            }

            stage.playersMap[newPos.y][newPos.x] = this.self;

            sounds.fx.enter.play();

            delete stage.playersMap[pcMapPosition.y][pcMapPosition.x];

            callback();
        });
    }

    public useStairs(direction, callback) {
        var pcMapPosition: IXYCoordinates = game.getCoordinates(this.self);
        var pcPosition: JQueryCoordinates = this.self.position();
        var offsetLeft = 0;
        var offsetTop = 0;

        switch (direction) {
            case 'dl': // Down & Left
                offsetLeft = -32;
                offsetTop = 0; // Player clips through the stairs if set to 32

                break;
            case 'dr': // Down & Right
                offsetLeft = 32;
                offsetTop = 32;

                break;
            case 'ul': // Up & Left
                offsetLeft = -32;
                offsetTop = -32;

                break;
            case 'ur': // Up & Right
                offsetLeft = 32;
                offsetTop = -32;

                break;
        }

        sounds.fx.enter.play();

        this.self.addClass('walking').stop()
            .animate(
                {
                    left: pcPosition.left + offsetLeft,
                    top: pcPosition.top + offsetTop
                },
                200,
                'linear',
                () => {
                    delete stage.playersMap[pcMapPosition.y][pcMapPosition.x];

                    callback();
                }
            );
    }
}

var players = new Players();