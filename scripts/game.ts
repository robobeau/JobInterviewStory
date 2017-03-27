/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="sounds.ts" />
/// <reference path="stage.ts" />

interface ICollisionObject {
    type: string;
    object: JQuery;
}

interface IDirections {
    up: string;
    down: string;
    left: string;
    right: string;
}

interface IXYCoordinates {
    x: number;
    y: number;
}

class Game {
    public activeBattle: JQuery;
    public activeModal: JQuery;
    public activeNPC: JQuery;
    public activePlayer: JQuery;

    public bodyDiv: JQuery;

    public currentArea: string = 'a000';
    public currentDirection: string = 'down';
    public currentFocus: any;

    public directions: IDirections = {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right'
    };
    public domain: string = location.protocol + '//' + location.host;
    public fps: number = 60;
    public gridCellSize: number = 32;
    public loading: boolean = false;
    public loadingDiv: JQuery;
    public loadingMessage: JQuery = $('<div id="loading">Loading...</div>');
    public preloading: boolean = false;
    public pressedKeys: any = {}; // @TODO: Figure out how to type something with dynamic property names...?
    public prevArea: string = 'a000';

    constructor() {
        this.bodyDiv = $('body');
    }

    public calculateZindex(object: JQuery): void {
        object.css({
            zIndex: object.position().top
        });
    }

    public checkCollisions(object: any, direction: string): ICollisionObject {
        var collisionType: string;
        var objectCoordinates: IXYCoordinates = this.getCoordinates(object);
        var offsetLeft: number = 0;
        var offsetTop: number = 0;

        switch (direction) {
            case this.directions.up:
                offsetTop = -1;

                break;
            case this.directions.down:
                offsetTop = 1;

                break;
            case this.directions.left:
                offsetLeft = -1;

                break;
            case this.directions.right:
                offsetLeft = 1;

                break;
        }

        // Collisions
        if (stage.collisionsMap[objectCoordinates.y + offsetTop]
            && stage.collisionsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
            return {
                type: 'collision',
                object: stage.collisionsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]
            };
        }

        // Flavor
        if (stage.flavorsMap[objectCoordinates.y + offsetTop]
            && stage.flavorsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
            return {
                type: 'flavor',
                object: stage.flavorsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]
            };
        }

        // NPCs
        if (stage.npcsMap[objectCoordinates.y + offsetTop]
            && stage.npcsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
            return {
                type: 'npc',
                object: stage.npcsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]
            };
        }

        // Players
        if (stage.playersMap[objectCoordinates.y + offsetTop]
            && stage.playersMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
            return {
                type: 'player',
                object: stage.playersMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]
            };
        }

        // Portals
        if (stage.portalsMap[objectCoordinates.y + offsetTop]
            && stage.portalsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]) {
            return {
                type: 'portal',
                object: stage.portalsMap[objectCoordinates.y + offsetTop][objectCoordinates.x + offsetLeft]
            };
        }

        return;
    }

    public getCoordinates(object: JQuery): IXYCoordinates {
        var objectPos: JQueryCoordinates = object.position();

        return {
            x: objectPos.left / this.gridCellSize,
            y: objectPos.top / this.gridCellSize
        }
    }

    public init(): void {
        stage.collisionsDiv = $('#collisions');
        stage.modalsDiv = $('#modals');
        stage.objectsDiv = $('#objects');
        stage.tilesDiv = $('#tiles');
        stage.self = $('#stage');

        game.preload();
    }

    public moveObject(object: JQuery, direction: string, callback?: any): void {
        var animateOptions: any = {};
        var objectPos: JQueryCoordinates = object.position();
        var left: number = objectPos.left;
        var top: number = objectPos.top;

        switch (direction) {
            case this.directions.up:
                animateOptions = {
                    top: '-=' + this.gridCellSize
                };

                break;
            case this.directions.down:
                animateOptions = {
                    top: '+=' + this.gridCellSize
                };

                break;
            case this.directions.left:
                animateOptions = {
                    left: '-=' + this.gridCellSize
                };

                break;
            case this.directions.right:
                animateOptions = {
                    left: '+=' + this.gridCellSize
                };

                break;
        }

        object.stop()
            .animate(
                animateOptions,
                200,
                'linear',
                () => {
                    this.calculateZindex(object);

                    if (typeof callback === 'function') {
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

        if (!this.loadingDiv) {
            this.loadingDiv = this.loadingMessage.clone();

            this.bodyDiv.append(this.loadingDiv);
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
                    this.preloading = false;

                    this.start();
                }
            });
        }
    }

    public start(): void {
        // setInterval(() => {
        //     this.update();
        // }, 1000 / this.fps);

        var _update = () => {
            this.update();

            requestAnimationFrame(_update);
        }

        _update();
            
        stage.init('a000');
    }

    public update(): void {
        if (this.loading) {
            if (!this.loadingDiv) {
                this.loadingDiv = this.loadingMessage.clone();

                this.bodyDiv.append(this.loadingDiv);
            }
        } else {
            if (this.loadingDiv) {
                this.loadingDiv.remove();

                this.loadingDiv = undefined;
            }

            if (this.activeModal) {
                this.activeModal.data('modal').checkButtons();
            }

            if (this.activePlayer) {
                this.activePlayer.data('player').checkButtons();
            }
        }
    }
}

var game = new Game();

/** BINDINGS **/

$(document).on('keydown', (event) => {
    event.preventDefault();

    game.pressedKeys[event.which] = true;
});

$(document).on('keyup', (event) => {
    event.preventDefault();

    game.pressedKeys[event.which] = false;

    if (game.activeModal) {
        game.activeModal.data('modal').allowPress = true;
    }

    if (game.activePlayer) {
        game.activePlayer.data('player').allowPress = true;
    }
});

/** GAME START! **/

$(document).ready(() => {
    game.init();
});