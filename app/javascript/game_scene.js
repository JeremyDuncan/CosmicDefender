// Importing required classes
import Alien        from './Alien';
import Background   from './Background';
import Laser        from './Laser';
import Explosion    from './Explosion';
import Scoreboard   from './Scoreboard';
import InputHandler from './InputHandler';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.gameOver = false;
  }

  preload() {
    // Load images and sprites
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('laser', '/assets/lasers/17.png');
    this.load.image('alienSpaceship', '/assets/enemy_spaceship.png');
    this.load.spritesheet('explosion', '/assets/explosions/explosion_1.png', { frameWidth: 256, frameHeight: 256 });
  }

  create() {
    // Initialize classes
    this.background = new Background(this);
    this.alien = new Alien(this);
    this.laser = new Laser(this);
    this.explosion = new Explosion(this);
    this.scoreboard = new Scoreboard(this);

    // Initialize arrays and groups
    this.starsGraphics = [];
    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    this.spaceship.setScale(0.4);
    this.spaceshipSpeed = 5;
    this.lasers = this.physics.add.group();
    this.alienSpaceships = this.physics.add.group();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.inputHandler = new InputHandler(this.input, this.cursors, this.spaceship, this.spaceshipSpeed);  // Initialize the InputHandler class


    // Create a text object for the "Game Over" message but set it to be invisible initially
    this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);
  }

  update() {
    // ==============
    // Input Controls
    // --------------
    let dx = 0, dy = 0;  // Declare dx and dy here
    const inputResult = this.inputHandler.handleInput();  // Get dx, dy from InputHandler
    if (inputResult) {
      dx = inputResult.dx;
      dy = inputResult.dy;
    }
    if (dx !== 0 || dy !== 0) {
      this.background.updateStars(dx, dy);     // Update star positions based on spaceship movement
      this.explosion.updateExplosions(dx, dy); // Update positions of explosions
    }

    this.background.randomizeAlpha();
    this.laser.fire(this.inputHandler.getSpacebar(), this.spaceship, this.spaceship.angle);
    this.laser.destroyOffScreen();

    // Handle alien spaceship spawning
    if (Phaser.Math.Between(0, 100) > 95) {
      this.alien.spawnAlien();
    }

    // Handle alien spaceship movement
    this.alien.moveAliens(this.spaceship, this.spaceshipSpeed);

    // Collision handling between lasers and alien spaceships
    this.physics.overlap(this.laser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      laser.destroy();
      alienSpaceship.destroy();

      // Create an explosion at the collision point
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.scoreboard.updateScore(10);
    });

    // Handle collisions between the player's spaceship and alien spaceships
    this.physics.overlap(this.spaceship, this.alien.getAlienSpaceships(), (spaceship, alienSpaceship) => {
      // Create explosions for both the alien and the player
      this.explosion.createExplosion(alienSpaceship.x, alienSpaceship.y);
      this.explosion.createExplosion(spaceship.x, spaceship.y);

      alienSpaceship.destroy();
      spaceship.destroy();

      // Update the player's score in the database and display the "Game Over" text
      this.time.delayedCall(1000, async () => {
        const playerId = this.registry.get('playerId');
        this.gameOverText.setVisible(true);
      });

      // Pause the scene after a delay
      this.time.delayedCall(2000, () => {
        this.scene.pause();
      });
    });
  }
}

// Export the GameScene class for use in other files
export default GameScene;
