define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    var game = require('./game');
    var howtoplay = require('./howtoplay');

    var state = new Plastick.State('intro');

    var controller = require('./controller')(state);

    var title = new Facade.Text('Smoothie Operator', {
        x: 600,
        y: 150,
        fontFamily: 'Passion One',
        fontSize: 50,
        fillStyle: '#333'
    });

    var intructions = new Facade.Text('Press anything to become a Smoothie Operator!', {
        x: 600,
        y: 210,
        width: 400,
        fontFamily: 'Passion One',
        fontSize: 30,
        fillStyle: '#333'
    });

    var splashScreen = new Facade.Image('./blender_images/hero.png', { y: 80 });

    state.init(function (game) {

        controller.resume();
        state.data.pause = window.performance.now();
    });

    state.cleanup(function (game) {

        game.data.pauseTime += window.performance.now() - state.data.pause;
    });

    state.registerListener(document, 'keydown', function (e) {

        if (!e.metaKey) {

            e.preventDefault();

            game.changeState(howtoplay);

        }

    });

    state.update(function (game) {

        var e;

        if (controller.queue.length) {

            while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'release' && e.button.match(/^button/)) {

                    game.changeState(howtoplay);

                }

            }

        }

    });

    state.draw(function (game) {

        game.stage.clear();
        game.stage.addToStage(splashScreen);
        game.stage.addToStage(title);
        game.stage.addToStage(intructions);

    });

    return state;

});
