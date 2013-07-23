$(function () {
  var canvas = $("<canvas width='" + 1000 +
                 "' height='" + 900 + "'></canvas>");
  $('body').append(canvas);

  // `canvas.get(0)` unwraps the jQuery'd DOM element;
  var ctx = canvas.get(0).getContext("2d");
  new Game(1000, 900, ctx).start();
});