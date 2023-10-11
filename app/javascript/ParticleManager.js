export default class ParticleManager {
  constructor(scene) {
    this.scene = scene;

    this.emitter = this.scene.add.particles(100, 300, 'particleOne', {
      angle: { min: -5, max: 3305 },
      speed: 1110,
      alpha: { start: .3, end: .1 },
      scale: { start: .3, end: .2 },
      quantity: 1,
      blendMode: 'ADD'
    }).setPosition(0, 0).stop();

    this.mainEmitter = this.scene.add.particles(100, 300, 'mainParticle', {
      angle: { min: -5, max: 365 },
      speed: 300,
      alpha: { start: .3, end: .1 },
      scale: { start: .2, end: .0 },
      quantity: 5,
      blendMode: 'normal'
    }).setPosition(0, 0).stop();

    this.secondEmitter = this.scene.add.particles(100, 300, 'mainParticle', {
      angle: { min: -5, max: 365 },
      speed: 1500,
      alpha: { start: 1, end: .1 },
      scale: { start: .3, end: .0 },
      quantity: 1,
      blendMode: 'ADD'
    }).setPosition(0, 0).stop();
  }

  startEmitter(emitterName, x, y) {
    this[emitterName].setPosition(x, y);
    this[emitterName].start();
  }

  stopEmitter(emitterName) {
    this[emitterName].stop();
  }
}
