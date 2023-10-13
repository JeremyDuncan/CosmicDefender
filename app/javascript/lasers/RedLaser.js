// RedLaser.js
import Laser from './Laser';

export default class RedLaser extends Laser {
  constructor(scene) {
    super(scene);
    this.laserType = 'redLaser';  // Different image
    this.laserSound = this.scene.sound.add('redLaserSound');  // Different sound
  }

  // ==============================================================================
  // Method to fire a red laser
  // ------------------------------------------------------------------------------
  fire(spacebar, spaceship, angle) {
    const shouldFire = Phaser.Input.Keyboard.JustDown(spacebar);
    if (shouldFire) {
      // You can override the fire method here if needed, or call the parent method
      super.fire(spacebar, spaceship, angle, this.laserType, this.laserSound);
    }
  }
}
