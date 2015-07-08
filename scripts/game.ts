/// <reference path="../node_modules/definitely-typed-jquery/jquery.d.ts" />
/// <reference path="npcs.ts" />
/// <reference path="player.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

interface XYCoordinates { // There's already a Coordinates interface? Wut?
    x: number;
    y: number;
}

interface Directions {
    up: string;
    down: string;
    left: string;
    right: string;
}

class Game {
    public activeNPC: JQuery;
    public currentArea: string = 'a000';
    public currentDirection: string = 'down';
    public currentFocus: any;
    public directions: Directions = {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right'
    };
    public domain: string = location.protocol + '//' + location.host;
    public fps: number = 60;
    public gridCellSize: number = 32;
    public loading: boolean = false;
    public loadingMessage: string = '<div id="loading">Loading...</div>';
    public preloading: boolean = false;
    public pressedKeys: any = {}; // @TODO: Figure out how to type something with dynamic property names...?
    public prevArea: string = 'a000';

    constructor() {

    }

    public calculateZindex(object: JQuery): void {
        object.css({
            zIndex: object.position().top
        });
    }

    public checkCollisions(object: any, direction: string): any {
        var objectCoordinates: XYCoordinates = this.getCoordinates(object);
        var offsetLeft: number = 0;
        var offsetTop: number = 0;

        switch (direction) {
            // Up
            case this.directions.up:
                offsetTop = -1;

                break;
            // Down
            case this.directions.down:
                offsetTop = 1;

                break;
            // Left
            case this.directions.left:
                offsetLeft = -1;

                break;
            // Right
            case this.directions.right:
                offsetLeft = 1;

                break;
        }

        if (stage.collisionsMap[objectCoordinates.y + offsetTop]) {
            if (stage.collisionsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
                return stage.collisionsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft];
            }
        }

        if (stage.portalsMap[objectCoordinates.y + offsetTop]) {
            if (stage.portalsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
                return stage.portalsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft];
            }
        }

        if (stage.npcsMap[objectCoordinates.y + offsetTop]) {
            if (stage.npcsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
                return stage.npcsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft];
            }
        }

        if (stage.playersMap[objectCoordinates.y + offsetTop]) {
            if (stage.playersMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
                return stage.playersMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft];
            }
        }

        return false;
    }

    public getCoordinates(object: JQuery): XYCoordinates {
        var objectPos: JQueryCoordinates = object.position();

        return {
            x: objectPos.left / this.gridCellSize,
            y: objectPos.top / this.gridCellSize
        }
    }

    public moveObject(object: JQuery, direction: string, callback?: any): void {
        var animateOptions: any = {};
        var objectPos: JQueryCoordinates = object.position();
        var left: number = objectPos.left;
        var top: number = objectPos.top;

        switch (direction) {
            // Up
            case this.directions.up:
                animateOptions = {
                    top: top - this.gridCellSize
                };

                break;
            // Down
            case this.directions.down:
                animateOptions = {
                    top: top + this.gridCellSize
                };

                break;
            // Left
            case this.directions.left:
                animateOptions = {
                    left: left - this.gridCellSize
                };

                break;
            // Right
            case this.directions.right:
                animateOptions = {
                    left: left + this.gridCellSize
                };

                break;
        }

        object.stop()
            .animate(
                animateOptions,
                180,
                'linear',
                () => {
                    this.calculateZindex(object);

                    if (callback) {
                        callback();
                    }
                }
            );
    }

    public preload(): void {
        var items: Array<string> = [
            // Tile Map
            '../img/tile-map.gif',

            // Player
            '../img/rene-down.gif',
            '../img/rene-down-walking.gif',
            '../img/rene-left.gif',
            '../img/rene-left-walking.gif',
            '../img/rene-up.gif',
            '../img/rene-up-walking.gif',

            // NPC
            '../img/dude.gif',

            // Modals
            '../img/modal-border.gif',

            // Emotes
            '../img/emote-happiness.gif',
            '../img/emote-love.gif',
            '../img/emote-question.gif',
            '../img/emote-sadness.gif',
            '../img/emote-talk-angry.gif',
            '../img/emote-talk-happy.gif',
            '../img/emote-think.gif',

            // Icons
            '../img/icon-continue.gif'
        ];
        var outstanding: number = items.length;

        this.preloading = true;

        if ((<JQuery>$('#loading')).length === 0) {
            (<JQuery>$('body')).append('<div id="loading">Loading...</div>');
        }

        for (var i: number = 0; i < items.length; i++) {
            this.loading = true;

            $.ajax({
                type: 'GET',
                url: items[i]
            }).done(() => {
                // Do nothing
            }).fail(() => {
                // Do nothing
            }).always(() => {
                outstanding--;

                if (outstanding === 0) {
                    this.loading = false;

                    this.start();
                }
            });
        }
    }

    public start(): void {
        setInterval(() => {
            this.update();
        }, 1000 / this.fps);

        stage.init('a000');
    }

    public update(): void {
        if (this.loading) {
            if ((<JQuery>$('#loading')).length === 0) {
                (<JQuery>$('body')).append(this.loadingMessage);
            }
        } else {
            (<JQuery>$('#loading')).remove();
        }

        if ((<JQuery>$('.modal')).length > 0) {
            // modal.checkButtons();
        }

        if (player.pc) {
            player.checkButtons();
        }

        stage.checkButtons();
    }
}

var game = new Game();

/** BINDINGS **/

(<JQuery>$(document)).on('keydown', (event) => {
    event.preventDefault();

    game.pressedKeys[event.which] = true;
});

(<JQuery>$(document)).on('keyup', (event) => {
    event.preventDefault();

    game.pressedKeys[event.which] = false;
    // modal.allowPress = true;
    player.allowPress = true;
});

/** GAME START! **/

(<JQuery>$(document)).on('ready', () => {
    game.preload();
});