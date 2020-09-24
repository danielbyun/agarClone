class Orb {
  constructor(settings) {
    // color
    this.color = this.getRandomColor();
    // where
    this.locX = Math.floor(Math.random() * settings.worldWidth);
    this.locY = Math.floor(Math.random() * settings.worldHeight);
    // size
    this.radius = 5;
  }
  getRandomColor() {
    const r = Math.floor(Math.random() * 200) + 50;
    const g = Math.floor(Math.random() * 200) + 50;
    const b = Math.floor(Math.random() * 200) + 50;
    return `rgb(${r}, ${g}, ${b})`;
  }
}

module.exports = Orb;
