// RedLaser.js
import Laser from './Laser';

export default class SuperLaser extends Laser {
  constructor(scene) {
    super(scene);
    this.laserType = 'superLaser';
    this.laserSound = this.scene.sound.add('superLaserSound');
  }

  // ==============================================================================
  // Method to fire a Super laser
  // ------------------------------------------------------------------------------
  fire(spacebar, spaceship, angle) {
    // You can override the fire method here if needed, or call the parent method
    super.fire(spacebar, spaceship, angle, this.laserType, this.laserSound);
  }
}
