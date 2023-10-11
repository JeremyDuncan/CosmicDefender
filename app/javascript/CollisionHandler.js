// CollisionHandler.js
export default class CollisionHandler {
  constructor(scene, laser, redLaser, alien, spaceship, explosion, scoreboard, particleManager) {
    this.scene      = scene;
    this.laser      = laser;
    this.redLaser   = redLaser;
    this.alien      = alien;
    this.explosion  = explosion;
    this.scoreboard = scoreboard;
    this.spaceship  = spaceship;
    this.gemSound   = this.scene.sound.add('gemSound');
    this.particles  = this.scene.particles;
    this.particleManager = particleManager;

  }

  handleCollisions() {
    // Handle collisions between the player's spaceship and gems
    this.scene.physics.overlap(this.spaceship, this.alien.gems, (spaceship, gem) => {
      gem.destroy();

      // Play the gem pickup sound
      this.gemSound.play();


      // Start the particle emitters using ParticleManager
      this.particleManager.startEmitter('emitter', spaceship.x, spaceship.y);
      this.particleManager.startEmitter('mainEmitter', spaceship.x, spaceship.y);
      this.particleManager.startEmitter('secondEmitter', spaceship.x, spaceship.y);

      // Stop the emitter after a short time
      this.scene.time.delayedCall(500, () => {
        this.particleManager.stopEmitter('emitter');
        this.particleManager.stopEmitter('mainEmitter');
        this.particleManager.stopEmitter('secondEmitter');
      });

      this.scoreboard.updateScore(5);
    });


    this.scene.physics.overlap(this.laser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      laser.destroy();
      alienSpaceship.destroy();

      // Create an explosion at the collision point
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(10);

      // Drop a gem
      this.alien.dropGem(alienSpaceship.x, alienSpaceship.y);

    });

    this.scene.physics.overlap(this.redLaser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      laser.destroy();
      alienSpaceship.destroy();

      // Create an explosion at the collision point
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(10);

      // Drop a gem
      this.alien.dropGem(alienSpaceship.x, alienSpaceship.y);
    });

    // Handle collisions between the player's spaceship and alien spaceships
    this.scene.physics.overlap(this.spaceship, this.alien.getAlienSpaceships(), (spaceship, alienSpaceship) => {
      // Create explosions for both the alien and the player
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.explosion.createExplosion(spaceship.x, spaceship.y);

      alienSpaceship.destroy();
      spaceship.destroy();

      this.scene.inputEnabled = false;  // Disable input
      // Pause the scene after a delay
      this.scene.time.delayedCall(2000, () => {
        if (this.scene && this.scene.scene && typeof this.scene.scene.pause === 'function') {
          this.scene.scene.pause();
          console.log("About to launch GameOverScene");
          this.scene.scene.launch('GameOverScene');
        }
      }, [], this);  // Bind `this` to the callback
    });
  }

  // ==============================================================================
// Add this method to your CollisionHandler class to handle particle collisions
// ------------------------------------------------------------------------------
  handleParticleCollisions() {
    this.scene.physics.overlap(this.particleManager.getParticles(), this.alien.getAlienSpaceships(), (particle, alienSpaceship) => {
      alienSpaceship.destroy();
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      particle.destroy();
      this.scoreboard.updateScore(5);
    });
  }
}
