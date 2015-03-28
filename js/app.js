define(function (require) {

    var game = require('./game/game'),
        intro = require('./game/intro'),
        level = require('./game/level-truck');

    game.start(level);

});
