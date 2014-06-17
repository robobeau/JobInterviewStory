
dialogues = {
    'd0': {
        type        : 'dialogue',
        text        : 'Hello, world!',
        emote       : 'talkHappy',
        end         : true
    },

    'd1': {
        type        : 'dialogue',
        text        : 'Do you want to go to lunch? I\'m hungry...',
        emote       : 'question',
        goTo        : 'c0',
        action      : function () {

        }
    },

    'c0': {
        type    : 'choice',
        emote   : 'think',
        choices : [
            {
                label       : 'Yes',
                goTo        : 'd2',
                action      : function () {

                }
            },

            {
                label       : 'No',
                goTo        : 'd3',
                action      : function () {

                }
            }
        ]
    },

    'd2': {
        type        : 'dialogue',
        text        : 'Alright!',
        emote       : 'happiness',
        end         : true,
        action      : function () {

        }
    },

    'd3': {
        type        : 'dialogue',
        text        : 'Awwwww!',
        emote       : 'sadness',
        end         : true,
        action      : function () {

        }
    }
}