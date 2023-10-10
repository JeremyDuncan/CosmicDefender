// Importing Phaser's Scene class to extend it
import Alien      from './Alien';       // Import the Alien class
import Background from './Background';  // Import the Background class
import Laser      from './Laser';       // Import the Laser class
import Scoreboard from './Scoreboard';  // Import the Scoreboard class

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });  // Call the constructor of the parent class (Phaser.Scene)
    this.score = 0;               // Initialize the score variable to 0
    this.gameOver = false;        // Initialize the game over flag to false
  }

  // Preload function to load assets
  preload() {
    // Load images and sprites
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('laser', '/assets/lasers/17.png');
    this.load.image('alienSpaceship', '/assets/enemy_spaceship.png');
    this.load.spritesheet('explosion', '/assets/explosions/explosion_1.png', { frameWidth: 256, frameHeight: 256 });
  }

  // Create function to set up the game scene
  create() {
    // Initialize classes
    this.background = new Background(this);  // Create an instance of the Background class
    this.alien      = new Alien(this);       // Create an instance of the Alien class
    this.laser      = new Laser(this);       // Create an instance of the Laser class
    this.scoreboard = new Scoreboard(this);  // Initialize the Scoreboard class

    // Initialize arrays and groups
    this.starsGraphics = [];
    this.explosions = this.add.group();

    // Define the explosion animation
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 3, end: 63 }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true
    });

    // Create and set up the player's spaceship
    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    this.spaceship.setScale(0.4);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceshipSpeed = 5;
    this.lasers   = this.physics.add.group(); // Create a group for lasers
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);  // Create a key object for the spacebar
    this.alienSpaceships = this.physics.add.group();  // Create a group for alien spaceships

    // Create a text object for the "Game Over" message but set it to be invisible initially
    this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);
  }

  update() {
    // =========================
    // Handle spaceship rotation
    // -------------------------
    if (this.cursors.left.isDown) {
      this.spaceship.angle -= 3;
    }
    if (this.cursors.right.isDown) {
      this.spaceship.angle += 3;
    }
    // =========================
    // Handle spaceship movement
    // -------------------------
    if (this.cursors.up.isDown) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
      const dx = this.spaceshipSpeed * Math.cos(angleInRad);
      const dy = this.spaceshipSpeed * Math.sin(angleInRad);
      // =================================================
      // Update star positions based on spaceship movement
      // -------------------------------------------------
      this.background.updateStars(dx, dy);
      // ==============================
      // Update positions of explosions
      // ==============================
      this.explosions.getChildren().forEach(explosion => {
        explosion.x -= dy;
        explosion.y += dx;
        // =================================
        // Wrap explosions around the screen
        // ---------------------------------
        if (explosion.x < 0) explosion.x    += 1600;
        if (explosion.x > 1600) explosion.x -= 1600;
        if (explosion.y < 0) explosion.y    += 1200;
        if (explosion.y > 1200) explosion.y -= 1200;
      });
    }

    this.background.randomizeAlpha(); // Randomly change the alpha value of stars
    this.laser.fire(this.spacebar, this.spaceship, this.spaceship.angle); // Handle laser firing using Laser class
    this.laser.destroyOffScreen(); // Destroy lasers that go off-screen using Laser class

    // Handle alien spaceship spawning
    if (Phaser.Math.Between(0, 100) > 95) {
      this.alien.spawnAlien();
    }

    // Handle alien spaceship movement
    this.alien.moveAliens(this.spaceship, this.spaceshipSpeed);

    // Collision handling between lasers and alien spaceships
    this.physics.overlap(this.laser.getLasers(), this.alien.getAlienSpaceships(), (laser, alienSpaceship) => {
      console.log("Collision detected");  // Debugging line

      laser.destroy();
      alienSpaceship.destroy();

      // Create an explosion at the collision point
      const explosion = this.add.sprite(alienSpaceship.x, alienSpaceship.y, 'explosion');
      explosion.play('explode');
      this.explosions.add(explosion);  // Add the explosion to the group
      this.scoreboard.updateScore(10); // Update the score using Scoreboard class
    });

    // Handle collisions between the player's spaceship and alien spaceships
    this.physics.overlap(this.spaceship, this.alien.getAlienSpaceships(), (spaceship, alienSpaceship) => {
      const alienExplosion = this.add.sprite(alienSpaceship.x, alienSpaceship.y, 'explosion');
      alienExplosion.play('explode');
      this.explosions.add(alienExplosion);
      alienSpaceship.destroy();

      const playerExplosion = this.add.sprite(spaceship.x, spaceship.y, 'explosion');
      playerExplosion.play('explode');
      this.explosions.add(playerExplosion);
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



