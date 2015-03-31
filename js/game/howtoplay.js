define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    var game = require('./game');
    var level = require('./level');

    var ui = require('./entities/ui');

    var state = new Plastick.State('howtoplay');

    var controller = require('./controller')(state);

    var background = new Facade.Image('./blender_images/controls.jpg', { scale: 0.5 });

    var intructions;

    state.init(function (game) {

        controller.resume();
        state.data.pause = window.performance.now();

    });

    state.cleanup(function (game) {

        game.data.pauseTime += window.performance.now() - state.data.pause;
    });

    state.registerListener(document, 'keydown', function (e) {

        if (!e.metaKey) {

            game.changeState(level);

        }

    });

    state.update(function (game) {

        var e;

        if (controller.queue.length) {

            while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'press' && e.button.match(/^button/)) {

                    game.changeState(level);

                }

            }

        }

    });

    state.draw(function (game) {

        game.stage.clear();
        game.stage.addToStage(background);

    });

    return state;

});
