// this is where all the data is that no other player needs to know about
class PlayerConfig {
  constructor(settings) {
    // assumt eh mouse haven't moved yet
    this.xVector = 0;
    this.yVector = 0;
    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
  }
}

module.exports = PlayerConfig;
