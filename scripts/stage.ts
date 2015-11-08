/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="npcs.ts" />
/// <reference path="player.ts" />
/// <reference path="sounds.ts" />

interface IStage {
    collisionsDiv: JQuery;
    collisionsMap: any;
    height: number;
    modalsDiv: JQuery;
    npcsMap: any;
    objectsDiv: JQuery;
    playersMap: any;
    portalsMap: any;
    self: JQuery; // The stage's jQuery object reference
    tileMap: ITileMap;
    tilesDiv: JQuery;
    width: number;
}

interface ITileMap {
    height: number;
    width: number;
}

class Stage implements IStage {
    public collisionsDiv: JQuery;
    public collisionsMap: any = [];
    public height: number = 0;
    public modalsDiv: JQuery;
    public npcsMap: any = [];
    public objectsDiv: JQuery;
    public playersMap: any = [];
    public portalsMap: any = [];
    public self: JQuery;
    public tileMap: ITileMap = {
        height: 50,
        width: 50
    };
    public tilesDiv: JQuery;
    public width: number = 0;

    constructor() {

    }

    public center(): void {
        var left: number = 0;
        var playerPos: JQueryCoordinates = game.activePlayer.position();
        var top: number = 0;
        var windowHeight: number = (<JQuery>$(window)).height();
        var windowWidth: number = (<JQuery>$(window)).width();

        left = (windowWidth / 2) - (playerPos.left + (game.activePlayer.width() / 2));
        top = (windowHeight / 2) - (playerPos.top + ((game.activePlayer.height() + 8) / 2));

        if (this.width <= windowWidth && this.height <= windowHeight) {
            left = (windowWidth - this.width) / 2;
            top = (windowHeight - this.height) / 2;
        }

        if (this.width > windowWidth && this.self.offset().left > 0 && playerPos.left < windowWidth
            && this.height > windowHeight && this.self.offset().top > 0 && playerPos.top < windowHeight) {
            left = 0;
            top = 0;
        }

        this.self.css({
            height: this.height,
            left: left + 'px',
            top: top + 'px',
            width: this.width
        });
    }

    public checkButtons(): void {
        if (game.pressedKeys[16]) { // Shift
            // Modify stuff!
        }

        if (game.pressedKeys[13] || game.pressedKeys[32]) { // Spacebar, Enter
            // Uhhhh... do something...?
        }

        if ((game.pressedKeys[87] || game.pressedKeys[38])) { // W, Up Arrow
            // Uhhhh... do something...?
        } else if ((game.pressedKeys[83] || game.pressedKeys[40])) { // S, Down Arrow
            // Uhhhh... do something...?
        } else if ((game.pressedKeys[65] || game.pressedKeys[37])) { // A, Left Arrow
            // Uhhhh... do something...?
        } else if ((game.pressedKeys[68] || game.pressedKeys[39])) { // D, Right Arrow
            // Uhhhh... do something...?
        }
    }

    public cleanup(): void {
        var npcs: JQuery = $('.npc');

        this.collisionsMap = [];
        this.npcsMap = [];
        this.playersMap = [];
        this.portalsMap = [];

        game.activeModal && game.activeModal.data('modal').destroy();

        for (var i: number = 0; i < npcs.length; i++) {
            (<JQuery>$(npcs[i])).data('npc').destroy();
        }

        game.activeNPC = undefined;

        game.activePlayer && game.activePlayer.data('player').destroy();

        this.collisionsDiv.html('');
        this.modalsDiv.html('');
        this.objectsDiv.html('');
        this.tilesDiv.html('');

        (<JQuery>$(document)).trigger('keyup');
    }

    public createObject(object) {
        var objectTemplate = '<div id="' + object.name + '" ' +
                                'class="object ' + object.type + '" ' +
                                'area="' + object.properties.area + '" ';

        if (object.properties.direction) {
            objectTemplate += 'direction="' + object.properties.direction + '" ';
        }

        objectTemplate += 'style="left: ' + object.x + 'px; top: ' + (object.y - game.gridCellSize) + 'px"></div>';

        var objectDiv: JQuery = $(objectTemplate);

        this.objectsDiv.append(objectDiv);

        if (!this.portalsMap[(object.y / game.gridCellSize) - 1]) {
            this.portalsMap[(object.y / game.gridCellSize) - 1] = {};
        }

        this.portalsMap[(object.y / game.gridCellSize) - 1][(object.x / game.gridCellSize)] = objectDiv;
    }

    public drawCollisions(collisions: any): void {
        var counter: number = 0;
        var row: number = 0;
        var width: number = collisions.width;

        for (var i: number = 0; i < collisions.data.length; i++) {
            var data = collisions.data[i];

            if (!this.collisionsMap[row]) {
                this.collisionsMap[row] = {};
            }

            this.collisionsMap[row][counter] = data === 2;

            if (data !== 0) { // 0 is empty, 2 is a collision
                var collision = $('<div class="collision" ' +
                                   'style="left: ' + (counter * game.gridCellSize) + 'px; top: ' + (row * game.gridCellSize) + 'px">' +
                                '</div>');

                this.collisionsDiv.append(collision);
            }

            counter += (i + 1) % width === 0 ? -counter : 1;
            row += (i + 1) % width === 0 ? 1 : 0;
        }
    }

    public drawObjects(objects: any): void {
        for (var i: number = 0; i < objects.objects.length; i++) {
            var object: any = objects.objects[i];

            switch (object.type) {
                case 'player':
                    players.create(object);

                    break;
                case 'npc':
                    npcs.create(object);

                    break;
                case 'doorway':
                case 'stairs':
                    this.createObject(object);

                    break;
            }
        }
    }

    public drawTiles(tiles: any): void {
        var counter: number = 0;
        var row: number = 0;
        var width: number = tiles.width;

        for (var i: number = 0; i < tiles.data.length; i++) {
            var tile: any = tiles.data[i];
            var y: number = Math.ceil(tile / this.tileMap.width);
            var x: number = (tile - ((y - 1) * this.tileMap.width));

            if (tile !== 0) { // 0 is empty, therefore don't draw it
                var tileDiv: JQuery = $('<div class="tile t' + tile + ' ' + tiles.name + '" ' +
                                           'style="background-position: -' + ((x * game.gridCellSize) - game.gridCellSize) + 'px -' + ((y * game.gridCellSize) - game.gridCellSize) + 'px; left: ' + (counter * game.gridCellSize) + 'px; top: ' + (row * game.gridCellSize) + 'px">' +
                                        '</div>');

                this.tilesDiv.append(tileDiv);
            }

            counter += (i + 1) % width === 0 ? -counter : 1;
            row += (i + 1) % width === 0 ? 1 : 0;
        }
    }

    public init(stageID: string): void {
        var transition: JQuery = $('#transition');

        transition.animate(
            {
                opacity: 1
            },
            200,
            'linear',
            () => {
                this.cleanup();

                game.loading = true;

                $.ajax({
                    // cache: false, // For development purposes
                    dataType: 'json',
                    type: 'GET',
                    url: '../json/' + stageID + '.json',
                }).done((data: any, textStatus: any, jqXHR: any) => {
                    game.prevArea = game.currentArea;
                    game.currentArea = stageID;

                    this.height = data.height * game.gridCellSize;
                    this.width = data.width * game.gridCellSize;

                    for (var i: number = 0; i < data.layers.length; i++) {
                        var layer = data.layers[i];

                        switch (true) {
                            case (layer.name === 'collisions'): // Collisions
                                this.drawCollisions(layer);

                                break;
                            case (layer.type === 'objectgroup'): // Objects
                                this.drawObjects(layer);

                                break;
                            default: // Tile Layer
                                this.drawTiles(layer);

                                break;
                        }
                    }

                    var objects: JQuery = $('#player, .npc, .object, .tiles3');

                    for (var j: number = 0; j < objects.length; j++) {
                        game.calculateZindex(objects.eq(j));
                    }

                    this.center();

                    game.loading = false;

                    if (data.properties.music
                        && (!sounds.currentMusic || sounds.currentMusic.src != sounds.music[data.properties.music])) {
                        sounds.currentMusicId = data.properties.music;

                        sounds.changeMusic(sounds.music[data.properties.music]);
                    }

                    sounds.fade(sounds.currentMusic, data.properties.musicVol);

                    transition.animate({
                        opacity: 0
                    }, 200);
                }).fail((jqXHR: any, textStatus: any, errorThrown: any) => {
                    // @TODO: Handle this!
                }).always((data: any, textStatus: any, jqXHR: any) => {
                    // @TODO: Handle this!
                });
            }
        );
    }

    public scrollStage(direction: string): void {
        var playerOff = game.activePlayer.offset();
        var offset = 0;
        var stagePos = this.self.position();
        var stageL = stagePos.left;
        var stageT = stagePos.top;
        var windowH = $(window).height();
        var windowW = $(window).width();

        if ((this.width > windowW || this.height > windowH)) {
            switch (direction) {
                case game.directions.up:
                    if ((playerOff.top + (game.gridCellSize / 2)) < (windowH / 2) && stageT < 0) {
                        this.self.stop().animate({
                            top: stageT + game.gridCellSize + offset
                        }, 200, 'linear');
                    }

                    break;
                case game.directions.down:
                    if ((playerOff.top + (game.gridCellSize / 2)) > (windowH / 2)
                        && Math.abs(stageT - windowH) < this.height) {
                        this.self.stop().animate({
                            top: stageT - game.gridCellSize + offset
                        }, 200, 'linear');
                    }

                    break;
                case game.directions.left:
                    if ((playerOff.left + (game.gridCellSize / 2)) < (windowW / 2) && stageL < 0) {
                        this.self.stop().animate({
                            left: stageL + game.gridCellSize + offset
                        }, 200, 'linear');
                    }

                    break;
                case game.directions.right:
                    if ((playerOff.left + (game.gridCellSize / 2)) > (windowW / 2)
                        && Math.abs(stageL - windowW) < this.width) {
                        this.self.stop().animate({
                            left: stageL - game.gridCellSize + offset
                        }, 200, 'linear');
                    }

                    break;
            }
        }
    }
}

var stage = new Stage();