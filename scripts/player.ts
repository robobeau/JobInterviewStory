/// <reference path="../node_modules/definitely-typed-jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="npcs.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

class Player {
    public allowMove: boolean = true;
    public allowPress: boolean = true;
    public direction: any;
    public speedMultiplier: number = 1;
    public pc: any;

    constructor() {

    }

    public checkButtons() {
        if (this.pc.length === 0 || !this.allowPress) {
            return;
        }

        var pcSprite: JQuery = $('#player-sprite');

        this.speedMultiplier = 1;

        // Shift
        if (game.pressedKeys[16]) {
            this.speedMultiplier = 2;
        }

        // Spacebar, Enter
        if (game.pressedKeys[13] || game.pressedKeys[32]) {
            var collision: any = game.checkCollisions(this.pc, this.direction);

            this.allowPress = false;

            if (collision) {
                switch (true) {
                    case (collision):
                        // Do nothing

                        break;

                    case (collision.is('.npc')):
                        // collision.npc('talk', Dialogue[collision.data('npc')['dialogueId']]);

                        break;
                }
            }
        }

        switch (true) {
            // W, Up Arrow
            case ((game.pressedKeys[87] || game.pressedKeys[38])):
                this.direction = game.directions.up;

                this.pc.data('pc').move(this.direction);

                break;

            // S, Down Arrow
            case ((game.pressedKeys[83] || game.pressedKeys[40])):
                this.direction = game.directions.down;

                this.pc.data('pc').move(this.direction);

                break;

            // A, Left Arrow
            case ((game.pressedKeys[65] || game.pressedKeys[37])):
                this.direction = game.directions.left;

                this.pc.data('pc').move(this.direction);

                break;

            // D, Right Arrow
            case ((game.pressedKeys[68] || game.pressedKeys[39])):
                this.direction = game.directions.right;

                this.pc.data('pc').move(this.direction);

                break;

            default:
                pcSprite.removeClass('walking');

                break;
        }
    }

    public create(data) {
        if (data.properties.prevArea === game.prevArea) {
            var pc: JQuery = $(
                '<div id="player" style="left: ' + data.x + 'px; top: ' + (data.y - 32) + 'px;">' +
                    '<div id="player-sprite" class="' + game.currentDirection + '"></div>' +
                '</div>'
            );

            (<JQuery>$('#objects')).append(pc);

            this.pc = pc;

            pc.data('pc', this);

            if (!stage.playersMap[(data.y / game.gridCellSize) - 1]) {
                stage.playersMap[(data.y / game.gridCellSize) - 1] = {};
            }

            stage.playersMap[(data.y / game.gridCellSize) - 1][(data.x / game.gridCellSize)] = this.pc;
        }
    }

    public destroy() {
        if (this.pc) {
            this.pc.remove();
        }

        this.allowMove = true;
        this.allowPress = true;
        this.pc = null;
        this.speedMultiplier = 1;
    }

    public move(direction) {
        if (this.pc.length === 0 || !this.allowMove) {
            return;
        }

        var collision: any = game.checkCollisions(this.pc, direction);
        var pcPosition: XYCoordinates = game.getCoordinates(this.pc);
        var pcSprite: JQuery = $('#player-sprite');

        game.currentDirection = direction;

        pcSprite.removeClass()
            .addClass('walking ' + direction);

        if (collision) {
            switch (true) {
                // Not Doorway or Stairs
                case (collision):
                    pcSprite.removeClass('walking');

                    sounds.fx.bump.play();

                    break;

                // Doorway
                case (collision.is('.doorway')):
                    this.allowMove = false;

                    sounds.fx.door.play();

                    game.moveObject(this.pc, direction, () => {
                        var newPos = game.getCoordinates(this.pc);

                        if (!stage.playersMap[newPos.y]) {
                            stage.playersMap[newPos.y] = {};
                        }

                        stage.playersMap[newPos.y][newPos.x] = this.pc;

                        sounds.fx.enter.play();

                        delete stage.playersMap[pcPosition.y][pcPosition.x];

                        stage.init(collision.attr('area'));
                    });

                    break;

                // Stairs
                case (collision.is('.stairs')):
                    this.allowMove = false;

                    sounds.fx.enter.play();

                    this.useStairs(collision.attr('direction'), () => {
                        stage.init(collision.attr('area'));
                    });

                    break;
            };
        } else {
            this.allowMove = false;

            game.moveObject(this.pc, direction, () => {
                var newPos = game.getCoordinates(this.pc);

                this.allowMove = true;

                if (!stage.playersMap[newPos.y]) {
                    stage.playersMap[newPos.y] = {};
                }

                stage.playersMap[newPos.y][newPos.x] = this.pc;

                delete stage.playersMap[pcPosition.y][pcPosition.x];
            });

            stage.scrollStage(direction);
        }
    }

    public useStairs(direction, callback) {
        var pcPosition = this.pc.position();
        var offsetLeft = 0;
        var offsetTop = 0;

        switch (direction) {
            // Down & Left
            case 'dl':
                offsetLeft = -32;
                offsetTop = 0; // Player clips through the stairs if set to 32

                break;

            // Down & Right
            case 'dr':
                offsetLeft = 32;
                offsetTop = 32;

                break;

            // Up & Left
            case 'ul':
                offsetLeft = -32;
                offsetTop = -32;

                break;

            // Up & Right
            case 'ur':
                offsetLeft = 32;
                offsetTop = -32;

                break;
        }

        this.pc.addClass('walking')
            .stop()
            .animate(
                {
                    left: pcPosition.left + offsetLeft,
                    top: pcPosition.top + offsetTop
                },
                180,
                'linear',
                () => {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            );
    }
}

var player = new Player();