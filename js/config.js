require.config({
    urlArgs: 'bust=' + (new Date()).getTime(),
    paths: {

        'box2dweb': '../bower_components/facadejs-Box2D-plugin/vendor/box2dweb/Box2dWeb-2.1.a.3',
        'facade': '../bower_components/facade.js/facade',
        'facadejs-Box2D-plugin': '../bower_components/facadejs-Box2D-plugin/facadejs-Box2D',
        'gamepad': '../bower_components/gamepad.js/gamepad.min',
        'plastick': '../bower_components/plastick.js/plastick.min',
        'TWEEN': '../bower_components/tween.js/build/tween.min'
    },
    shim: {
        'box2dweb': {
            'exports': 'Box2D'
        },
        'TWEEN': {
            'exports': 'TWEEN'
        }
    }
});

define(['app']);
