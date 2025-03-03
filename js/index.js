import Game from "./Game.js";

const canvas = document.getElementById("canvas");
const container = document.getElementById("container");

const game = new Game(canvas, container);
game.start();
