class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('laser', '/assets/lasers/17.png');  // Preload the laser image
  }

  create() {
    this.starsGraphics = [];

    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 1600);
      const y = Phaser.Math.Between(0, 1200);
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xFFFFFF);
      star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      this.starsGraphics.push(star);
    }

    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    this.spaceship.setScale(0.5);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceshipSpeed = 5;

    // Create a group to hold the lasers
    this.lasers = this.physics.add.group();

    // Create a keyboard event for the spacebar
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
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

      this.starsGraphics.forEach(star => {
        star.x -= dy;
        star.y += dx;

        if (star.x > 1600) star.x -= 1600;
        if (star.x < 0) star.x += 1600;
        if (star.y > 1200) star.y -= 1200;
        if (star.y < 0) star.y += 1200;
      });
    }

    // Twinkling logic moved here
    this.starsGraphics.forEach(star => {
      if (Phaser.Math.Between(0, 10) > 8) {
        star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      }
    });

    // ==============================================================================
    // Shooting logic: This section of the code handles the shooting mechanism.
    // It creates a laser sprite at a position in front of the spaceship and sets
    // its velocity and angle to match the spaceship's orientation.
    // ------------------------------------------------------------------------------
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle - 90);  // Adjust the angle if needed
      const dx = Math.cos(angleInRad);
      const dy = Math.sin(angleInRad);

      // Calculate the initial position for the laser so it appears in front of the ship
      const laserStartX = this.spaceship.x + 20 * dx;
      const laserStartY = this.spaceship.y + 20 * dy;

      // Create a laser sprite at the calculated position
      const laser = this.lasers.create(laserStartX, laserStartY, 'laser');
      laser.setScale(0.5);

      // Rotate the laser sprite to face up
      laser.setAngle(this.spaceship.angle - 90);  // Rotate by -90 degrees to make it face up

      // Set the velocity of the laser
      laser.setVelocity(500 * dx, 500 * dy);

      // Set the depth of the laser to be behind the spaceship
      laser.setDepth(this.spaceship.depth - 1);
    }

// Make sure to set the spaceship's depth somewhere in your code, for example in the `create` method
    this.spaceship.setDepth(1);


    // Update the position of each laser
    this.lasers.getChildren().forEach(laser => {
      if (laser.x < 0 || laser.x > 1600 || laser.y < 0 || laser.y > 1200) {
        laser.destroy();  // Remove the laser if it goes out of bounds
      }
    });
  }
}

export default GameScene;
