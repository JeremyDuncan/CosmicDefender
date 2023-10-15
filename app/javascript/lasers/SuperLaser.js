import Laser from './Laser';
export default class SuperLaser extends Laser {
  constructor(scene) {
    super(scene);
    this.laserType = 'superLaser';
    this.laserSound = this.scene.sound.add('superLaserSound');
  }

  fire(shouldFireFromTouch, spacebar, spaceship, angle) {
    const shouldFireFromKeyboard = Phaser.Input.Keyboard.JustDown(spacebar);
    if (shouldFireFromTouch || shouldFireFromKeyboard) {
      // Fire the central laser
      super.fire(shouldFireFromTouch,spacebar, spaceship, angle, this.laserType, this.laserSound);
      // Fire the left laser with a -10 degree spread
      super.fire(shouldFireFromTouch,spacebar, spaceship, angle, this.laserType, this.laserSound, 0, 0, -10);
      // Fire the right laser with a +10 degree spread
      super.fire(shouldFireFromTouch,spacebar, spaceship, angle, this.laserType, this.laserSound, 0, 0, 10);
      // Fire the backward laser
      super.fire(shouldFireFromTouch,spacebar, spaceship, angle + 180, this.laserType, this.laserSound);
    }
  }
}
