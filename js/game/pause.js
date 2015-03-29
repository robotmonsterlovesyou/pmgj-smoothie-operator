define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    var game = require('./game');

    var ui = require('./entities/ui');

    var state = new Plastick.State('pause');

    var controller = require('./controller')(state);

    var background = new Facade.Image(ui.getPausedState());

    var greyout = new Facade.Rect({ width: game.stage.width(), height: game.stage.height(), fillStyle: '#fff', opacity: 50 });

    if (window.devicePixelRatio) {

        background.setOptions({ scale: 0.5 });
    }

    state.registerListener(document, 'keydown', function (e) {

        // esc key to unpause
        if (e.keyCode === 27) {
            e.preventDefault();
            this.popState();
        }
    }.bind(game));

    state.init(function (game) {

        state.data.pause = window.performance.now();
    });

    state.cleanup(function (game) {

        game.data.pauseTime += window.performance.now() - state.data.pause ;
    });

    state.update(function (game) {

        /*var e;

        if (controller.queue.length) {

            while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'release' && e.button === 'button_1') {

                    controller.queue = [];
                    game.popState();
                    return;

                }

            }

        }*/

    });

    state.draw(function (game) {

        game.stage.clear();
        game.stage.addToStage(background);
        game.stage.addToStage(greyout);

    });

    return state;

});
