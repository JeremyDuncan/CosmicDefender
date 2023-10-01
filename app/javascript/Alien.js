// ==============================================================================
// Alien class to handle alien spaceships
// ------------------------------------------------------------------------------
class Alien {
  constructor(scene) {
    this.scene = scene;
    this.alienSpaceships = this.scene.physics.add.group();
  }

  spawnAlien() {
    let attempts = 0;
    let x, y;
    let tooClose;
    do {
      x = Phaser.Math.Between(-100, -50);
      y = Phaser.Math.Between(-100, -50);
      tooClose = this.alienSpaceships.getChildren().some(alienSpaceship => {
        return Phaser.Math.Distance.Between(x, y, alienSpaceship.x, alienSpaceship.y) < 100;
      });
      attempts++;
    } while (tooClose && attempts < 10);

    if (!tooClose) {
      const alienSpaceship = this.alienSpaceships.create(x, y, 'alienSpaceship');
      alienSpaceship.setScale(0.05);
    }
  }

  moveAliens(spaceship, spaceshipSpeed) {
    this.alienSpaceships.getChildren().forEach(alienSpaceship => {
      const angleToPlayer = Phaser.Math.Angle.Between(
        alienSpaceship.x, alienSpaceship.y,
        spaceship.x, spaceship.y
      );

      const velocity = 50;
      alienSpaceship.setVelocity(
        velocity * Math.cos(angleToPlayer),
        velocity * Math.sin(angleToPlayer)
      );

      if (this.scene.cursors.up.isDown) {
        const angleInRad = Phaser.Math.DegToRad(spaceship.angle);
        const dx = spaceshipSpeed * Math.cos(angleInRad);
        const dy = spaceshipSpeed * Math.sin(angleInRad);

        alienSpaceship.x -= dy;
        alienSpaceship.y += dx;
      }

      if (alienSpaceship.x < -100 || alienSpaceship.x > this.scene.scale.width + 100 ||
        alienSpaceship.y < -100 || alienSpaceship.y > this.scene.scale.height + 100) {
        alienSpaceship.destroy();
      }
    });
  }
  getAlienSpaceships() {
    return this.alienSpaceships;
  }
}

export default Alien;
