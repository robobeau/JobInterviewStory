/// <reference path="game.ts" />
/// <reference path="flags.ts" />

var dialogue = {
    'n200': {
        text: '"Hello, world!" Oh, don\'t mind me, I\'m just testing out a JavaScript app I\'m developing.',
        emote: 'talkHappy',
        transform: function() {
            if (!flags.battlesFought['n000']) {
                this.goTo = 'n200a';
            } else {
                this.goTo = undefined;
                this.text = 'Thanks for all the help!';
            }
        }
    },
    'n200a': {
        text: 'Say... You mind if I use you as a blue duck for a minute?',
        emote: 'question',
        action: function() {
            game.activeNPC.data('npc').battle();

            flags.battlesFought['n000'] = true;
        }
    },
    'n201': {
        text: 'Do you want to go to lunch? I\'m hungry...',
        emote: 'question',
        goTo: 'c000'
    },
    'c000': {
        emote: 'think',
        choices: [
            {
                label: 'Yes',
                goTo: 'n201a'
            },
            {
                label: 'No',
                goTo: 'n201b'
            }
        ]
    },
    'n201a': {
        text: 'Alright!',
        emote: 'happiness'
    },
    'n201b': {
        text: 'Awwwww!',
        emote: 'sadness'
    }
}