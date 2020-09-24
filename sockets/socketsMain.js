// where all our socket stuff will go
const io = require("../server").io;
const checkForOrbCollisions = require("./checkCollisions")
  .checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollisions")
  .checkForPlayerCollisions;

// ===== CLASSES =====
const Player = require("./classes/Player");
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const Orb = require("./classes/Orb");

let orbs = [];
let players = [];

// game settings
let settings = {
  defaultOrbs: 50,
  defaultSpeed: 6,
  defaultSize: 6,
  // as a player gets bigger, the zoom needs to go out
  defaultZoom: 1.5, // zoom down as player gets bigger
  worldWidth: 500,
  worldHeight: 500,
};

// run at the beginning of a new game
const initGame = () => {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
};

initGame();

// issue a message to EVERY connected socket 30fps
setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players,
    });
  }
}, 33); // there are 30 33s in 1000ms, or 1/30th of a second, or 1 of 30fps

io.sockets.on("connect", (socket) => {
  let player = {};
  /* ===== a player has connected ===== */
  socket.on("init", (data) => {
    // add the player to the game namespace
    socket.join("game");

    // 1) make a playerConfig object
    let playerConfig = new PlayerConfig(settings);

    // 2) make a playerData object
    let playerData = new PlayerData(data.playerName, settings);

    // 3) make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);

    // issue a message to THIS client with its loc 30/sec
    setInterval(() => {
      socket.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33); // there are 30 33s in 1000ms, or 1/30th of a second, or 1 of 30fps

    console.log(player);

    // 4) when the player is connected and is set, then start generating the orbs
    socket.emit("initReturn", {
      orbs,
    });
    players.push(playerData);
  });

  // the client sent over a tick. That means we know what direction to move the socket
  socket.on("tick", (data) => {
    speed = player.playerConfig.speed;

    // update the player config object with the new directiion in data and at the same time create a local variable for this callback for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    // ORB COLLISION!
    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrb
      .then((data) => {
        // then runs if resolve runs // a collision happened!
        // emit to all sockets the orb to replace
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };
        // console.log(orbData);
        // every socket needs to know the leaderBoard has changed
        io.sockets.emit("updateLeaderBoard", leaderBoard);
        io.sockets.emit("orbSwitch", orbData);
      })
      .catch((err) => {
        // catch runs if there is an error (reject) // no collision
      });

    // PLAYER COLLISION!
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );

    playerDeath
      .then((data) => {
        // every socket needs to know the leaderBoard has changed
        io.sockets.emit("updateLeaderBoard", leaderBoard);
      })
      .catch((err) => {
        // no player collision
        console.error(err);
      });
  });
});

const getLeaderBoard = () => {
  // sort players in desc order
  players.sort((a, b) => {
    return b.score - a.score;
  });
};

module.exports = io;
