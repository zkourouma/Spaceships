$(function () {
  var canvas = $("<canvas width='" + ($(window).width()-10) +
                 "' height='" + ($(window).height()-20) + "'></canvas>");
  $('body').append(canvas);

  // `canvas.get(0)` unwraps the jQuery'd DOM element;
  var ctx = canvas.get(0).getContext("2d");
  new Game(($(window).width()-10), ($(window).height()-20), ctx).start();
});