$(function () {
  var canvas = $("<canvas width='" + 500 +
                 "' height='" + 500 + "'></canvas>");
  $('body').append(canvas);

  // `canvas.get(0)` unwraps the jQuery'd DOM element;
  var ctx = canvas.get(0).getContext("2d");
  new Game(500, 500, ctx).start();
});