export default class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.particleGroup = this.scene.physics.add.group();  // Create a physics group for particles

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
      speed: 3100,
      alpha: { start: .2, end: 0 },
      scale: { start: .2, end: .0 },
      quantity: 1,
      blendMode: 'normal',
      lifespan: 200  // 200 milliseconds

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

    // Add emitted particles to the physics group
    const particle = this.scene.physics.add.sprite(x, y, 'mainParticle');
    particle.setDepth(-1);  // Set the depth to be below the player's ship
    this.particleGroup.add(particle);
  }
  stopEmitter(emitterName) {
    this[emitterName].stop();
  }
  // Method to expose the particle group
  getParticles() {
    return this.particleGroup;
  }
}
