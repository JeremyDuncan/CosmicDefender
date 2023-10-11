// Importing required classes
import Alien            from './Alien';
import Background       from './Background';
import Laser            from './Laser';
import RedLaser         from './RedLaser';
import Explosion        from './Explosion';
import Scoreboard       from './Scoreboard';
import InputHandler     from './InputHandler';
import CollisionHandler from './CollisionHandler';
import ParticleManager  from './ParticleManager';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.inputEnabled = true;  // Add this line
  }

  preload() {
    // Load images and sprites
    this.load.image('spaceship', '/assets/player_spaceship.png');
    // Lasers ================================================
    this.load.image('laser', '/assets/lasers/17.png');
    this.load.audio('laserOneSound', '/assets/laser.wav');
    this.load.image('redLaser', '/assets/lasers/02.png');
    this.load.audio('redLaserSound', '/assets/laser4.wav');
    this.load.image('alienSpaceship', '/assets/enemy_spaceship.png');
    this.load.spritesheet('explosion', '/assets/explosions/explosion_1.png', { frameWidth: 256, frameHeight: 256 });
    this.load.audio('explosionSound', '/assets/explosion.flac');
    this.load.spritesheet('gemSprite', '/assets/powerup1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.audio('gemSound', '/assets/power_up1.wav');
    this.load.image('particleOne', '/assets/particle1.png');
    this.load.image('mainParticle', '/assets/particleStar.png');
  }

  create() {
    this.inputEnabled = true;  // Reset the input flag

    // initialize classes
    this.background      = new Background(this);
    this.alien           = new Alien(this);
    this.laser           = new Laser(this);
    this.redLaser        = new RedLaser(this);
    this.explosion       = new Explosion(this);
    this.scoreboard      = new Scoreboard(this);
    this.particleManager = new ParticleManager(this);  // <-- Initialize here

    // Initialize arrays and groups
    this.starsGraphics = [];
    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    this.spaceship.setScale(0.4);
    this.spaceshipSpeed = 5;
    this.lasers = this.physics.add.group();
    this.alienSpaceships = this.physics.add.group();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.inputHandler = new InputHandler(this.input, this.cursors, this.spaceship, this.spaceshipSpeed);
    this.collisionHandler = new CollisionHandler(this, this.laser, this.redLaser, this.alien, this.spaceship,
                                                  this.explosion, this.scoreboard, this.particleManager);


    // Create a text object for the "Game Over" message but set it to be invisible initially
    this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);

    // ==============================================================================
    // Create a text object for the "Retry" button but set it to be invisible initially
    // ------------------------------------------------------------------------------
    this.retryText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'Retry', {
      fontSize: '32px',
      fill: '#00ff00'
    }).setOrigin(0.5).setVisible(false).setInteractive();

    // Add a click event to the "Retry" text
    this.retryText.on('pointerdown', () => this.retryGame());
  }

  // ==========================
  // Method to restart the game
  // --------------------------
  retryGame() {
    console.log("RESTART")
    this.scene.start('GameScene');  // Start a new instance of the GameScene
  }

  update() {
    if (!this.inputEnabled) {
      return;  // Skip the rest of the update if input is disabled
    }
    // ==============
    // Input Controls
    // --------------
    let dx = 0, dy = 0;  // Declare dx and dy here
    const inputResult = this.inputHandler.handleInput();  // Get dx, dy from InputHandler
    if (inputResult) {
      dx = inputResult.dx;
      dy = inputResult.dy;
    }

    // Update gem positions based on spaceship movement
    if (dx !== 0 || dy !== 0) {
      this.alien.gems.getChildren().forEach(gem => {
        gem.x -= dy;
        gem.y += dx;
      });
    }

    if (dx !== 0 || dy !== 0) {
      this.background.updateStars(dx, dy);     // Update star positions based on spaceship movement
      this.explosion.updateExplosions(dx, dy); // Update positions of explosions
    }

    this.background.randomizeAlpha();
    if (true) {
      this.redLaser.fire(this.inputHandler.getSpacebar(), this.spaceship, this.spaceship.angle);
    } else {
      this.laser.fire(this.inputHandler.getSpacebar(), this.spaceship, this.spaceship.angle);
    }

    this.laser.destroyOffScreen();

    // Handle alien spaceship spawning
    if (Phaser.Math.Between(0, 100) > 95) {
      this.alien.spawnAlien(this.scale.width, this.scale.height);
      this.alien.spawnAlien(this.scale.width, this.scale.height);
      this.alien.spawnAlien(this.scale.width, this.scale.height);
    }
    this.alien.moveAliens(this.spaceship, this.spaceshipSpeed); // Handle alien spaceship movement
    this.collisionHandler.handleCollisions();                   // Collision handling
    this.collisionHandler.handleParticleCollisions();

  }
}
export default GameScene;
