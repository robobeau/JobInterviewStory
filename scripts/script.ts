var dialogue = {
    'd200': {
        type: 'dialogue',
        text: 'Hello, world!',
        emote: 'talkHappy'
    },
    'd201': {
        type: 'dialogue',
        text: 'Do you want to go to lunch? I\'m hungry...',
        emote: 'question',
        goTo: 'c000'
    },
    'c000': {
        type: 'choice',
        emote: 'think',
        choices: [
            {
                label: 'Yes',
                goTo: 'd202'
            },
            {
                label: 'No',
                goTo: 'd203'
            }
        ]
    },
    'd202': {
        type: 'dialogue',
        text: 'Alright!',
        emote: 'happiness'
    },
    'd203': {
        type: 'dialogue',
        text: 'Awwwww!',
        emote: 'sadness'
    }
}

var flavor = {
    // A000
    'f000': {
        type: 'flavor',
        text: 'My B.A. in Graphic Design, from <a href="http://www.atlanticu.edu" target="_blank">Atlantic University College</a>.<br />I mostly write JavaScript, these days...'
    },
    'f001': {
        type: 'flavor',
        text: 'The browser window\'s displaying <a href="https://github.com/robobeau" target="_blank">my GitHub profile</a>.'
    },
    'f002': {
        type: 'flavor',
        text: 'An Acer Predator G series PC.<br />Lately, I\'ve been using it to play Undertale...'
    },
    'f003': {
        type: 'flavor',
        text: 'My collection of comic—I mean, programming—books.'
    },
    'f004': {
        type: 'flavor',
        text: 'A picturesque landscape.'
    },
    'f005': {
        type: 'flavor',
        text: 'I could finish unpacking... or I could go play video games...<br />Decisions, decisions...'
    },
    'f006': {
        type: 'flavor',
        text: '"Clean Code"... "Eloquent JavaScript"...<br />I really should finish reading these books.'
    },
    'f007': {
        type: 'flavor',
        text: '"Japanese for Busy People".<br />Memorizing all the hiragana and katakana is a pain...'
    },
    'f008': {
        type: 'flavor',
        text: 'No time for love, Dr. Jones!'
    },
    // A001
    'f100': {
        type: 'flavor',
        text: '"Final Fantasy VI"... "Chrono Trigger"... "Secret Of Mana"...<br />The classics are all here!'
    },
    'f101': {
        type: 'flavor',
        text: 'A bald man in a white cape and yellow jumpsuit is running around defeating bad guys with one punch.'
    },
    'f102': {
        type: 'flavor',
        text: 'Various anime figures, all meticulously posed. I swear, I\'m an adult.'
    },
    'f103': {
        type: 'flavor',
        text: 'There\'s nothing in the trash bin.'
    },
    'f104': {
        type: 'flavor',
        text: 'The fridge is stocked with endless bottles of Dr. Pepper.<br />No, YOU have a problem!'
    },
    'f105': {
        type: 'flavor',
        text: 'The sun is a wondrous body, like a magnificent father!<br />If only I could be so grossly incandescent! \\[T]/'
    },
    'f106': {
        type: 'flavor',
        text: 'One missed call from (407) 517-8634. Probably a telemarketer.'
    },
    // A002
    'f200': {
        type: 'flavor',
        text: 'My Amazon package has yet to arrive...'
    },
    'f201': {
        type: 'flavor',
        text: 'This isn\'t my mailbox...'
    }
}

var music = {
    'shadesOfRed': {
        type: 'notification',
        text: '<a href="http://ocremix.org/remix/OCR02216" target="_blank">Shades of Red, by halc</a>'
    },
    'wetDreams': {
        type: 'notification',
        text: '<a href="http://ocremix.org/remix/OCR02727" target="_blank">Wet Dreams, by Phonetic Hero</a>'
    }
}