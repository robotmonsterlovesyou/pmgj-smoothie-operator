define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    var game = require('./game');

    var ui = require('./entities/ui');

    var state = new Plastick.State('endgame');

    var controller = require('./controller')(state);

    var background = new Facade.Image(ui.getPausedState());

    var greyout = new Facade.Rect({ width: game.stage.width(), height: game.stage.height(), fillStyle: '#fff', opacity: 50 });

    var peptalk,
        intructions;

    if (window.devicePixelRatio) {

        background.setOptions({ scale: 0.5 });

    }

    state.init(function () {

        controller.resume();

        peptalk = new Facade.Text('You need to work on your\nsmoothie making skills.\nSo many unhappy customer!', {
            y: 150,
            width: game.stage.width(),
            fontFamily: 'Passion One',
            fontSize: 50,
            fillStyle: '#333',
            textAlignment: 'center'
        });

        intructions = new Facade.Text('Press Space or A (Xbox Controller) to try your luck again.', {
            y: 350,
            width: game.stage.width(),
            fontFamily: 'Passion One',
            fontSize: 30,
            fillStyle: '#333',
            textAlignment: 'center'
        });

    });

    state.update(function () {

        var e;

        if (controller.queue.length) {

            while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'press' && e.button === 'button_1') {

                    window.location.reload();

                }

            }

        }

    });

    state.draw(function () {

        game.stage.clear();
        game.stage.addToStage(background);
        game.stage.addToStage(greyout);
        game.stage.addToStage(peptalk);
        game.stage.addToStage(intructions);

    });

    return state;

});
