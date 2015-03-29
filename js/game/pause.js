define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    var game = require('./game');

    var ui = require('./entities/ui');

    var state = new Plastick.State('pause');

    var controller = require('./controller')(state);

    var background = new Facade.Image(ui.getPausedState(), { opacity: 0.5 });

    state.update(function () {

        var e;

        if (controller.queue.length) {

            while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'release' && e.button === 'button_1') {

                    controller.queue = [];
                    game.popState();

                }

            }

        }

    });

    state.draw(function () {

        game.stage.clear();
        game.stage.addToStage(background);

    });

    return state;

});
