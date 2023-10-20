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

  startJetEmitter(emitterName, x, y, angle) {
    const offsetDistance = -40;                                       // This is the distance from the spaceship to the emitter
    const angleInRadians = Phaser.Math.DegToRad(angle + 90);          // Convert angle to radians, adjusting by +90 degrees
    const emitterX = x - offsetDistance * Math.cos(angleInRadians);   // Calculate position of the emitter based on angle and offset distance
    const emitterY = y - offsetDistance * Math.sin(angleInRadians);
    this[emitterName].setPosition(emitterX, emitterY);
    this[emitterName].setAngle(angle + -90);                          // Setting the angle of the emitter to be rotated
    this[emitterName].start();
  }

  stopEmitter(emitterName) {
    this[emitterName].stop();
  }
  // Method to expose the particle group
  getParticles() {
    return this.particleGroup;
  }
}
