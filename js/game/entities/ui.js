define(function (require) {

    var Facade = require('facade');

    var game = require('../game');

    var group = new Facade.Group();

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

    return {
        entities: {
            group: group,
            score: score,
            time: time
        }
    };

});
