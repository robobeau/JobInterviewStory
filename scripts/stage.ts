/// <reference path="../node_modules/definitely-typed-jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="npcs.ts" />
/// <reference path="player.ts" />
/// <reference path="sounds.ts" />

interface TileMap {
    height: number;
    width: number;
}

class Stage {
    public collisionsMap: any = [];
    public height: number = 0;
    public npcsMap: any = [];
    public playersMap: any = [];
    public portalsMap: any = [];
    public tileMap: TileMap = {
        height: 50,
        width: 50
    };
    public width: number = 0;

    constructor() {

    }

    public center(): void {
        var left: number = 0;
        var playerPos: JQueryCoordinates = player.pc.position();
        var stageObject: JQuery = $('#stage');
        var top: number = 0;
        var windowHeight: number = (<JQuery>$(window)).height();
        var windowWidth: number = (<JQuery>$(window)).width();

        left = (windowWidth / 2) - (playerPos.left + (player.pc.width() / 2));
        top = (windowHeight / 2) - (playerPos.top + ((player.pc.height() + 8) / 2));

        if (this.width <= windowWidth && this.height <= windowHeight) {
            left = (windowWidth - this.width) / 2;
            top = (windowHeight - this.height) / 2;
        }

        if (this.width > windowWidth && stageObject.offset().left > 0 && playerPos.left < windowWidth
            && this.height > windowHeight && stageObject.offset().top > 0 && playerPos.top < windowHeight) {
            left = 0;
            top = 0;
        }

        stageObject.css({
            height: this.height,
            left: left + 'px',
            top: top + 'px',
            width: this.width
        });
    }

    public checkButtons(): void {
        // Shift
        if (game.pressedKeys[16]) {

        }

        // Spacebar, Enter
        if (game.pressedKeys[13] || game.pressedKeys[32]) {

        }

        switch (true) {
            // W, Up Arrow
            case ((game.pressedKeys[87] || game.pressedKeys[38])) :
                break;

            // S, Down Arrow
            case ((game.pressedKeys[83] || game.pressedKeys[40])) :
                break;

            // A, Left Arrow
            case ((game.pressedKeys[65] || game.pressedKeys[37])) :
                break;

            // D, Right Arrow
            case ((game.pressedKeys[68] || game.pressedKeys[39])) :
                break;

            default:
                break;
        }
    }

    public cleanup(): void {
        var npcs: JQuery = $('.npc');

        this.collisionsMap = [];
        this.npcsMap = [];
        this.playersMap = [];
        this.portalsMap = [];

        for (var i: number = 0; i < npcs.length; i++) {
            (<JQuery>$(npcs[i])).data('npc').destroy();
        }

        player.destroy();

        (<JQuery>$('#collisions')).html('');
        // (<JQuery>$('#modals')).html('');
        (<JQuery>$('#objects')).html('');
        (<JQuery>$('#tiles')).html('');

        (<JQuery>$(document)).trigger('keyup');
    }

    public drawCollisions(collisions: any): void {
        var counter: number = 0;
        var height: number = collisions.height;
        var row: number = 0;
        var width: number = collisions.width;

        for (var i: number = 0; i < collisions.data.length; i++) {
            var data = collisions.data[i];

            if (!this.collisionsMap[row]) {
                this.collisionsMap[row] = {};
            }

            this.collisionsMap[row][counter] = data === 2;

            if (data !== 0) { // 0 is empty, 2 is a collision
                (<JQuery>$('#collisions')).append(
                    '<div class="collision" ' +
                        'style="left: ' + (counter * game.gridCellSize) + 'px; top: ' + (row * game.gridCellSize) + 'px">' +
                    '</div>'
                );
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
                    player.create(object);

                    break;

                case 'npc':
                    npcs.create(object);

                    break;

                case 'doorway':
                    (<JQuery>$('#objects')).append(
                        '<div id="' + object.name + '" ' +
                            'class="object doorway" ' +
                            'area="' + object.properties.area + '" ' +
                            'style="left: ' + object.x + 'px; top: ' + (object.y - game.gridCellSize) + 'px">' +
                        '</div>'
                    );

                    if (!this.portalsMap[(object.y / game.gridCellSize) - 1]) {
                        this.portalsMap[(object.y / game.gridCellSize) - 1] = {};
                    }

                    this.portalsMap[(object.y / game.gridCellSize) - 1][(object.x / game.gridCellSize)] = $('#' + object.name);

                    break;

                case 'stairs':
                    (<JQuery>$('#objects')).append(
                        '<div id="' + object.name + '" ' +
                            'class="object stairs" ' +
                            'area="' + object.properties.area + '" ' +
                            'direction="' + object.properties.direction + '" ' +
                            'style="left: ' + object.x + 'px; top: ' + (object.y - game.gridCellSize) + 'px">' +
                        '</div>'
                    );

                    if (!this.portalsMap[(object.y / game.gridCellSize) - 1]) {
                        this.portalsMap[(object.y / game.gridCellSize) - 1] = {};
                    }

                    this.portalsMap[(object.y / game.gridCellSize) - 1][(object.x / game.gridCellSize)] = $('#' + object.name);

                    break;
            }
        }
    }

    public drawTiles(tiles: any): void {
        var counter: number = 0;
        var height: number = tiles.height;
        var row: number = 0;
        var width: number = tiles.width;

        for (var i: number = 0; i < tiles.data.length; i++) {
            var tile: any = tiles.data[i];
            var y: number = Math.ceil(tile / this.tileMap.width);
            var x: number = (tile - ((y - 1) * this.tileMap.width));

            if (tile !== 0) { // 0 is empty, therefore don't draw it
                (<JQuery>$('#tiles')).append(
                    '<div class="tile t' + tile + ' ' + tiles.name + '" ' +
                        'style="background-position: -' + ((x * game.gridCellSize) - game.gridCellSize) + 'px -' + ((y * game.gridCellSize) - game.gridCellSize) + 'px; left: ' + (counter * game.gridCellSize) + 'px; top: ' + (row * game.gridCellSize) + 'px">' +
                    '</div>'
                );
            }

            counter += (i + 1) % width === 0 ? -counter : 1;
            row += (i + 1) % width === 0 ? 1 : 0;
        }
    }

    public init(stageID: string): void {
        var transition = $('#transition');

        transition.animate(
            {
                opacity: 1
            },
            180,
            'linear',
            () => {
                this.cleanup();

                game.loading = true;

                $.ajax({
                    // cache: false, // For development purposes
                    dataType: 'json',
                    type: 'GET',
                    url: '../json/' + stageID + '.json',
                }).done((data, textStatus, jqXHR) => {
                    game.prevArea = game.currentArea;
                    game.currentArea = stageID;

                    this.height = data.height * game.gridCellSize;
                    this.width = data.width * game.gridCellSize;

                    for (var i: number = 0; i < data.layers.length; i++) {
                        var layer = data.layers[i];

                        switch (true) {
                            // Collisions
                            case (layer.name === 'collisions') :
                                this.drawCollisions(layer);

                                break;

                            // Objects
                            case (layer.type === 'objectgroup') :
                                this.drawObjects(layer);

                                break;

                            // Tile Layer
                            default :
                                this.drawTiles(layer);

                                break;
                        }
                    }

                    for (var j: number = 0; j < $('#player, .npc, .object, .tiles3').length; j++) {
                        game.calculateZindex((<JQuery>$('#player, .npc, .object, .tiles3')).eq(j));
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
                    }, 180);
                }).fail((jqXHR, textStatus, errorThrown) => {
                    // Do nothing
                }).always((data, textStatus, jqXHR) => {
                    // Do nothing
                });
            }
        );
    }

    public scrollStage(direction: string): void {
        var playerOff = player.pc.offset();
        var offset = 0;
        var scrollArea = $('#scroll-area');
        var stageObject = $('#stage');
        var stagePos = stageObject.position();
        var stageL = stagePos.left;
        var stageT = stagePos.top;
        var windowH = $(window).height();
        var windowW = $(window).width();

        if ((this.width > windowW || this.height > windowH)) {
            switch (direction) {
                // Up
                case game.directions.up:
                    if ((playerOff.top + (game.gridCellSize / 2)) < (windowH / 2) && stageT < 0) {
                        stageObject.stop().animate({
                            top: stageT + game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                // Down
                case game.directions.down:
                    if ((playerOff.top + (game.gridCellSize / 2)) > (windowH / 2)
                        && Math.abs(stageT - windowH) < this.height) {
                        stageObject.stop().animate({
                            top: stageT - game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                // Left
                case game.directions.left:
                    if ((playerOff.left + (game.gridCellSize / 2)) < (windowW / 2) && stageL < 0) {
                        stageObject.stop().animate({
                            left: stageL + game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;

                // Right
                case game.directions.right:
                    if ((playerOff.left + (game.gridCellSize / 2)) > (windowW / 2)
                        && Math.abs(stageL - windowW) < this.width) {
                        stageObject.stop().animate({
                            left: stageL - game.gridCellSize + offset
                        }, 180, 'linear');
                    }

                    break;
            }
        }
    }
}

var stage = new Stage();;