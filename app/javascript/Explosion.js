// Explosion.js
class Explosion {
  constructor(scene) {
    this.scene = scene;
    this.explosions = this.scene.add.group();

    // Define the explosion animation
    this.scene.anims.create({
      key: 'explode',
      frames: this.scene.anims.generateFrameNumbers('explosion', { start: 3, end: 63 }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true
    });
  }

  createExplosion(x, y) {
    const explosion = this.scene.add.sprite(x, y, 'explosion');
    explosion.play('explode');
    this.explosions.add(explosion);
  }

  updateExplosions(dx, dy) {
    this.explosions.getChildren().forEach(explosion => {
      explosion.x -= dy;
      explosion.y += dx;
      // Wrap explosions around the screen
      if (explosion.x < 0)    explosion.x += 1600;
      if (explosion.x > 1600) explosion.x -= 1600;
      if (explosion.y < 0)    explosion.y += 1200;
      if (explosion.y > 1200) explosion.y -= 1200;
    });
  }
}

export default Explosion;
