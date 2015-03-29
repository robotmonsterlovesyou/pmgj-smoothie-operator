define(function (require) {

    var Facade = require('facade');

    var game = require('../game');

    var group = new Facade.Group();

    var pausedBackground = document.createElement('img');

    var score = new Facade.Text('0 points', {
        x: 20,
        y: game.stage.height() - 20,
        fontFamily: 'Passion One',
        fontSize: 40,
        fillStyle: '#333',
        anchor: 'bottom/left',
        textAlignment: 'left'
    });

    group.addToGroup(score);

    var time = new Facade.Text('0 seconds', {
        x: game.stage.width() - 20,
        y: game.stage.height() - 20,
        fontFamily: 'Passion One',
        fontSize: 40,
        fillStyle: '#333',
        anchor: 'bottom/right',
        textAlignment: 'right'
    });

    group.addToGroup(time);

    var livesGroup = new Facade.Group({ x: 10, y: 10 });

    group.addToGroup(livesGroup);

    var blenderLife = new Facade.Image('./blender_images/lives.png', { height: 53, frames: [0, 1, 2, 3] });

    livesGroup.addToGroup(blenderLife);

    return {
        entities: {
            group: group,
            score: score,
            time: time
        },
        setPausedState: function () {

            pausedBackground.setAttribute('src', game.stage.exportBase64('image/png', 100));

        },
        getPausedState: function () {

            return pausedBackground;

        },
        setLivesUsed: function (used) {

            if (used <= 3) {

                blenderLife.currentFrame = used;

            }

        }
    };

});
