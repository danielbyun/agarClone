let { locX, locY, xVector, yVector } = player;

/*
====================================
==============DRAW==================
====================================
*/

const draw = () => {
  // reset the translation back to default because .translate() is cumulative and will keep adding
  context.setTransform(1, 0, 0, 1, 0, 0); // default values

  // clear the screen out so the old orb is gone from the last frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // clamp the camera to the player
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;

  // translate allows us to move the canvas around
  context.translate(camX, camY);

  // draw all the players
  players.forEach((p) => {
    context.beginPath(); // about to start drawing
    context.fillStyle = p.color;
    // arg1,2 = x,y of the center of the arc
    // arg3 = the radius
    // arg4 = where to start in radians, 0 = 3 o'clock
    // arg5 = where to stop in radians, 2pi is all the way
    context.arc(p.locX, p.locY, p.radius, 0, Math.PI * 2); // this makes it a circle
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0, 255, 0)";
    context.stroke(); // that one draws one time
  });

  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw); // safe while loop lol
};

canvas.addEventListener("mousemove", (e) => {
  const mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    // console.log("Mouse is in the lower right quad");
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // console.log("Mouse is in the lower left quad");
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // console.log("Mouse is in the upper left quad");
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // console.log("Mouse is in the upper right quad");
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
