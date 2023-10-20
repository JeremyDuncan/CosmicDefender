import Laser from './Laser';
export default class RedLaser extends Laser {
  constructor(scene, spaceship, particleManager) {
    super(scene, spaceship, particleManager);  // Pass spaceship and particleManager to super constructor

    this.laserType = 'redLaser';                                   // Image
    this.laserSound = this.scene.sound.add('redLaserSound');  // Sound
  }

  // ==============================================================================
  // Method to fire a red laser
  // ------------------------------------------------------------------------------
  fire(shouldFireFromTouch, spacebar, spaceship, angle) {
    const shouldFireFromKeyboard = Phaser.Input.Keyboard.JustDown(spacebar);
    if (shouldFireFromTouch || shouldFireFromKeyboard) {
      // You can override the fire method here if needed, or call the parent method
      super.fire(shouldFireFromTouch, spacebar, spaceship, angle, this.laserType, this.laserSound);
    }
  }
}
