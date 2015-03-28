require.config({
    urlArgs: 'bust=' + (new Date()).getTime(),
    paths: {
        facade: '../bower_components/facade.js/facade',
        gamepad: '../bower_components/gamepad.js/gamepad.min',
        plastick: '../bower_components/plastick.js/plastick.min',
        tween: './lib/tweenjs-NEXT.combined.js'
    }
});

define(['app']);
