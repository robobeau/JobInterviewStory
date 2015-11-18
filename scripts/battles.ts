/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="game.ts" />
/// <reference path="stage.ts" />

interface IBattle {
    self: JQuery; // The battle's jQuery object reference
}

class Battles {
    constructor() {

    }

    public create(data) {
        var battle = $('<div class="battle">' +
                        '<div class="enemy-' + data.enemyId + '"></div>' +
                        '<div class="stage-' + data.stageId + '"></div>' +
                    '</div>');

        battle.data('battle', new Battle(battle));

        stage.battleDiv.append(battle);

        game.activeBattle = battle;
    }
}

class Battle implements IBattle {
    public self: JQuery;

    constructor(battle: JQuery) {
        this.self = battle;
    }

    public start() {
        // Change music
    }
}

var battles = new Battles();