let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {}; // all things 'this' player

let orbs = [];
let players = [];

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");

canvas.height = wHeight;
canvas.width = wWidth;

$(window).load(() => {
  $("#loginModal").modal("show");
});

$(".name-form").submit((e) => {
  e.preventDefault();
  player.name = document.querySelector("#name-input").value;
  $("#loginModal").modal("hide");
  $("#spawnModal").modal("show");
  document.querySelector(".player-name").innerHTML = player.name;
});

$(".start-game").click(() => {
  $(".modal").modal("hide");
  $(".hiddenOnStart").removeAttr("hidden");

  init();
});
