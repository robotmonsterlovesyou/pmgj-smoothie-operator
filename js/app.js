define(function (require) {

    var game = require('./game/game'),
        title = require('./game/title'),
        level = require('./game/level');

    game.start(level);

});
