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

    this.jetFlameEmitter = this.scene.add.particles(50, 50, 'mainParticle', {
      frame: 'white',
      angle: { min: 160, max: 200 },    // Emit particles backward, as if from the back of the jet
      speed: { min: 400, max: 600 },    // Speed of the particles, indicating the force of the jet
      lifespan: { min: 200, max: 600 }, // Short lifespan to resemble the burn off of a jet flame
      alpha: { start: 1, end: 0 },      // Start opaque and fade out
      scale: { start: 0.25, end: 0.1 }, // Start slightly larger and shrink', resembling the flame thinning out
      tint: [0xffa500, 0xffff00],       // green to yellow tint
      blendMode: 'ADD',
      on: false                         // Don't start emitting immediately
    }).setPosition(0, 0).stop();

    this.laserEmitter = this.scene.add.particles(500, 500, 'mainParticle', {
      frame: 'white',
      angle: { min: -30, max: 30 },    // Emit particles forward in a spread
      speed: { min: 800, max: 1200 },  // Increased speed for a more explosive effect
      lifespan: { min: 50, max: 150 }, // Shorter lifespan for quicker dissipation
      alpha: { start: 1, end: 0 },     // Start opaque and fade out
      scale: { start: 0.2, end: 0.1 }, // Start slightly larger and shrink', resembling a dissipating blast
      tint: [0xff0000, 0xffa500],      // Red to orange tint for a fiery effect
      blendMode: 'ADD',
      on: false                        // Don't start emitting immediately
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

  startLaserEmitter(emitterName, x, y, angle) {
    const offsetDistance = 40;                                       // This is the distance from the spaceship to the emitter
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
