class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load the spaceship and star images
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('star', '/assets/star.png');
  }

  create() {
    // Create tiled star backgrounds
    this.stars = this.add.tileSprite(0, 0, 1600, 1200, 'star');
    this.stars.setOrigin(0, 0);

    // Create the spaceship sprite at the center of the screen
    this.spaceship = this.physics.add.sprite(400, 300, 'spaceship');
    this.spaceship.setScale(0.5);

    // Initialize cursor keys for movement
    this.cursors = this.input.keyboard.createCursorKeys();

    // Initialize spaceship properties
    this.spaceshipSpeed = 5;
  }

  update() {
    // Rotate and move the spaceship based on keyboard input
    if (this.cursors.left.isDown) {
      this.spaceship.angle -= 3;
    }
    if (this.cursors.right.isDown) {
      this.spaceship.angle += 3;
    }
    if (this.cursors.up.isDown) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
      const dx = this.spaceshipSpeed * Math.cos(angleInRad);
      const dy = this.spaceshipSpeed * Math.sin(angleInRad);

      // Move stars in the opposite direction to simulate spaceship movement
      this.stars.tilePositionX += dy;  // Move background opposite to spaceship's up/down
      this.stars.tilePositionY -= dx;  // Move background opposite to spaceship's right/left
    }
  }
}

export default GameScene;
