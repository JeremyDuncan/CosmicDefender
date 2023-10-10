export default class Laser {
  constructor(scene) {
    this.scene      = scene;
    this.lasers     = this.scene.physics.add.group();
    this.laserSound = this.scene.sound.add('laserOneSound');
  }

// ==============================================================================
// Method to fire a laser
// ------------------------------------------------------------------------------
  fire(spacebar, spaceship, angle, laserType = 'laser', laserSound = null) {
    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
      const angleInRad  = Phaser.Math.DegToRad(angle - 90);
      const dx          = Math.cos(angleInRad);
      const dy          = Math.sin(angleInRad);
      const laserStartX = spaceship.x + 20 * dx;
      const laserStartY = spaceship.y + 20 * dy;
      const laser       = this.lasers.create(laserStartX, laserStartY, laserType);  // Use laserType here

      laser.setScale(0.5);
      laser.setAngle(angle - 90);
      laser.setVelocity(500 * dx, 500 * dy);
      laser.setDepth(spaceship.depth - 1);
      if (laserSound) {
        laserSound.play({ volume: 0.5 });
      }
    }
  }


  // ==============================================================================
  // Method to destroy lasers that go off-screen
  // ------------------------------------------------------------------------------
  destroyOffScreen() {
    this.lasers.getChildren().forEach(laser => {
      if (laser.x < 0 || laser.x > 1600 || laser.y < 0 || laser.y > 1200) {
        laser.destroy();
      }
    });
  }

  getLasers() {
    return this.lasers;
  }
}
