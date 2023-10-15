// CollisionHandler.js
export default class CollisionHandler {
  constructor(scene, laser, redLaser, superLaser, alien, spaceship, explosion, scoreboard, particleManager) {
    this.scene      = scene;
    this.laser      = laser;
    this.redLaser   = redLaser;
    this.superLaser = superLaser;
    this.alien      = alien;
    this.explosion  = explosion;
    this.scoreboard = scoreboard;
    this.spaceship  = spaceship;
    this.gemSound   = this.scene.sound.add('gemSound');
    this.particles  = this.scene.particles;
    this.particleManager = particleManager;
  }

  handleCollisions() {
    // =========================================================
    // Handle collisions between the player's spaceship and gems
    // =========================================================
    this.scene.physics.overlap(this.spaceship, this.alien.gems, (spaceship, gem) => {
      gem.destroy();
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

    // ============================================================
    // Handle collisions between the player's Super laser and Alien
    // ============================================================
    this.scene.physics.overlap(this.superLaser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      alienSpaceship.destroy();
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(20);
      this.alien.dropGem(alienSpaceship.x, alienSpaceship.y);

      laser.hitCount = (laser.hitCount || 0) + 1;
      // Destroy laser if it has hit 2 aliens
      if (laser.hitCount >= 4) {
        laser.destroy();
      }
    });


    // =========================================================
    // Handle collisions between the player's laser and Alien
    // =========================================================
    this.scene.physics.overlap(this.laser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      alienSpaceship.destroy();
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(10);
      this.alien.dropGem(alienSpaceship.x, alienSpaceship.y);

      laser.hitCount = (laser.hitCount || 0) + 1;
      // Destroy laser if it has hit 2 aliens
      if (laser.hitCount >= 2) {
        laser.destroy();
      }
    });


    // ==========================================================
    // Handle collisions between the player's red laser and Alien
    // ==========================================================
    this.scene.physics.overlap(this.redLaser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      laser.destroy();
      alienSpaceship.destroy();
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(10);
      this.alien.dropGem(alienSpaceship.x, alienSpaceship.y);
    });

    // =====================================================================
    // Handle collisions between the player's spaceship and alien spaceships
    // =====================================================================
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

  // ==========================
  // handle particle collisions
  // --------------------------
  handleParticleCollisions() {
    this.scene.physics.overlap(this.particleManager.getParticles(), this.alien.getAlienSpaceships(), (particle, alienSpaceship) => {
      alienSpaceship.destroy();
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      particle.destroy();
      this.scoreboard.updateScore(5);
    });
  }
}
