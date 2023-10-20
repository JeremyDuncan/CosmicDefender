export default class Laser {
  constructor(scene, spaceship, particleManager) {
    this.spaceship       = spaceship
    this.particleManager = particleManager
    this.scene           = scene;
    this.lasers          = this.scene.physics.add.group();
    this.laserSound      = this.scene.sound.add('laserSound');
    this.lastFired       = 0;
    this.fireDelay       = 200;
  }

  // ==============================================================================
  // Method to fire a laser
  // ------------------------------------------------------------------------------
  fire(shouldFireFromTouch, shouldFireFromSpaceBar, spaceship, angle, laserType = 'laser', laserSound = null, offsetX = 0, offsetY = 0, spreadAngle = 0) {
    const currentTime = this.scene.time.now;  // Get the current time

    // ==========================================================================
    // Check if enough time has passed since the last laser was fired (for touch)
    // --------------------------------------------------------------------------
    if (shouldFireFromTouch && currentTime - this.lastFired < this.fireDelay) {
      return;
    }

    if (shouldFireFromSpaceBar || shouldFireFromTouch) {
      this.lastFired = currentTime;  // Update the lastFired time

      const adjustedAngle = angle + spreadAngle;
      const angleInRad  = Phaser.Math.DegToRad(adjustedAngle - 90);
      const dx          = Math.cos(angleInRad);
      const dy          = Math.sin(angleInRad);
      const laserStartX = spaceship.x + 20 * dx + offsetX;
      const laserStartY = spaceship.y + 20 * dy + offsetY;
      const laser       = this.lasers.create(laserStartX, laserStartY, laserType);
      this.laserEffect()


      laser.setScale(0.5);
      laser.setAngle(angle - 90);
      laser.setVelocity(500 * dx, 500 * dy);
      laser.setDepth(spaceship.depth - 1);
      if (laserSound) {
        laserSound.play({ volume: 0.5 });
      } else {
        // Play the default laser sound if no specific sound is provided
        this.laserSound.play({ volume: 0.5 });
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

  laserEffect() {
    this.particleManager.startLaserEmitter('laserEmitter', this.spaceship.x, this.spaceship.y, this.spaceship.angle);
    // ==========================================================================
    // Schedule the stopping of the laser emitter after a small delay (e.g., 50ms)
    // --------------------------------------------------------------------------
    this.scene.time.delayedCall(50, () => {
      this.particleManager.stopEmitter('laserEmitter');
    });
  }
}
