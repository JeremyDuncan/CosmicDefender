// Importing Phaser's Scene class to extend it
class GameScene extends Phaser.Scene {
  // Constructor function
  constructor() {
    // Call the constructor of the parent class (Phaser.Scene)
    super({ key: 'GameScene' });
    // Initialize the score variable to 0
    this.score = 0;
    // Initialize the game over flag to false
    this.gameOver = false;
  }

  // ==============================================================================
  // Function to update player score in the database
  // ------------------------------------------------------------------------------
  async updatePlayerScoreInDB(playerId) {
    // Log the playerId for debugging
    console.log("Player ID:", playerId);
    // Fetch CSRF token from meta tag
    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    // Define the URL for the API endpoint
    const url = `http://localhost:3000/api/v1/players/${playerId}/update_score`;

    try {
      // Make an asynchronous PATCH request to update the score
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken  // Include CSRF token for security
        },
        body: JSON.stringify({ score: this.score })  // Send the score as JSON
      });
    } catch (error) {
      // Log any errors that occur during the fetch
      console.error('There was a problem updating the score:', error);
    }
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
    // Initialize arrays and groups
    this.starsGraphics = [];
    this.explosions = this.add.group();

    // Create a text object for the scoreboard at the top right corner
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff'
    });

    // Create stars in the background
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 1600);
      const y = Phaser.Math.Between(0, 1200);
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xFFFFFF);
      star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      this.starsGraphics.push(star);
    }

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

    // Create a group for lasers
    this.lasers = this.physics.add.group();
    // Create a key object for the spacebar
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create a group for alien spaceships
    this.alienSpaceships = this.physics.add.group();

    // Create a text object for the "Game Over" message but set it to be invisible initially
    this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);
  }

  // Update function to handle game logic
  update() {
    // Handle spaceship rotation
    if (this.cursors.left.isDown) {
      this.spaceship.angle -= 3;
    }
    if (this.cursors.right.isDown) {
      this.spaceship.angle += 3;
    }

    // Handle spaceship movement
    if (this.cursors.up.isDown) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
      const dx = this.spaceshipSpeed * Math.cos(angleInRad);
      const dy = this.spaceshipSpeed * Math.sin(angleInRad);

      // Update positions of stars and explosions based on spaceship movement
      this.starsGraphics.forEach(star => {
        star.x -= dy;
        star.y += dx;

        // Wrap stars around the screen
        if (star.x < 0) star.x += 1600;
        if (star.x > 1600) star.x -= 1600;
        if (star.y < 0) star.y += 1200;
        if (star.y > 1200) star.y -= 1200;
      });

      // Update positions of explosions
      this.explosions.getChildren().forEach(explosion => {
        explosion.x -= dy;
        explosion.y += dx;

        // Wrap explosions around the screen
        if (explosion.x < 0) explosion.x += 1600;
        if (explosion.x > 1600) explosion.x -= 1600;
        if (explosion.y < 0) explosion.y += 1200;
        if (explosion.y > 1200) explosion.y -= 1200;
      });
    }

    // Randomly change the alpha value of stars
    this.starsGraphics.forEach(star => {
      if (Phaser.Math.Between(0, 10) > 8) {
        star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      }
    });

    // Handle laser firing
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      // Calculate the angle and position for the laser
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle - 90);
      const dx = Math.cos(angleInRad);
      const dy = Math.sin(angleInRad);

      // Calculate the starting position for the laser
      const laserStartX = this.spaceship.x + 20 * dx;
      const laserStartY = this.spaceship.y + 20 * dy;

      // Create a laser sprite
      const laser = this.lasers.create(laserStartX, laserStartY, 'laser');
      laser.setScale(0.5);
      laser.setAngle(this.spaceship.angle - 90);
      laser.setVelocity(500 * dx, 500 * dy);
      laser.setDepth(this.spaceship.depth - 1);
    }

    // Set the depth of the spaceship to be above lasers
    this.spaceship.setDepth(1);

    // Destroy lasers that go off-screen
    this.lasers.getChildren().forEach(laser => {
      if (laser.x < 0 || laser.x > 1600 || laser.y < 0 || laser.y > 1200) {
        laser.destroy();
      }
    });

    // Handle alien spaceship spawning
    if (Phaser.Math.Between(0, 100) > 95) {
      // Randomly generate a position for the alien spaceship
      let attempts = 0;
      let x, y;
      let tooClose;
      do {
        x = Phaser.Math.Between(-100, -50);
        y = Phaser.Math.Between(-100, -50);
        // Check if the new alien spaceship is too close to existing ones
        tooClose = this.alienSpaceships.getChildren().some(alienSpaceship => {
          return Phaser.Math.Distance.Between(x, y, alienSpaceship.x, alienSpaceship.y) < 100;
        });
        attempts++;
      } while (tooClose && attempts < 10);

      // Create an alien spaceship if it's not too close to existing ones
      if (!tooClose) {
        const alienSpaceship = this.alienSpaceships.create(x, y, 'alienSpaceship');
        alienSpaceship.setScale(0.05);
      }
    }

    // Handle alien spaceship movement
    this.alienSpaceships.getChildren().forEach(alienSpaceship => {
      // If the alien spaceship is within the screen bounds
      if (alienSpaceship.x >= 0 && alienSpaceship.x <= this.scale.width &&
        alienSpaceship.y >= 0 && alienSpaceship.y <= this.scale.height) {

        // Calculate the angle between the alien spaceship and the player's spaceship
        const angleToPlayer = Phaser.Math.Angle.Between(
          alienSpaceship.x, alienSpaceship.y,
          this.spaceship.x, this.spaceship.y
        );

        // Set the velocity of the alien spaceship to move towards the player
        const velocity = 50;
        alienSpaceship.setVelocity(
          velocity * Math.cos(angleToPlayer),
          velocity * Math.sin(angleToPlayer)
        );
      }

      // Update the position of the alien spaceship based on the player's movement
      if (this.cursors.up.isDown) {
        const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
        const dx = this.spaceshipSpeed * Math.cos(angleInRad);
        const dy = this.spaceshipSpeed * Math.sin(angleInRad);

        alienSpaceship.x -= dy;
        alienSpaceship.y += dx;
      }

      // Destroy alien spaceships that go off-screen
      if (alienSpaceship.x < -100 || alienSpaceship.x > this.scale.width + 100 ||
        alienSpaceship.y < -100 || alienSpaceship.y > this.scale.height + 100) {
        alienSpaceship.destroy();
      }
    });

    // Handle collisions between lasers and alien spaceships
    this.physics.overlap(this.lasers, this.alienSpaceships, (laser, alienSpaceship) => {
      // Destroy the laser and alien spaceship upon collision
      laser.destroy();
      alienSpaceship.destroy();

      // Create an explosion at the collision point
      const explosion = this.add.sprite(alienSpaceship.x, alienSpaceship.y, 'explosion');
      explosion.play('explode');
      this.explosions.add(explosion);  // Add the explosion to the group

      // Update the score and scoreboard
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
    });

    // Handle collisions between the player's spaceship and alien spaceships
    this.physics.overlap(this.spaceship, this.alienSpaceships, (spaceship, alienSpaceship) => {
      // Create explosions at the collision points and destroy both spaceships
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
        const playerId = this.registry.get('playerId');  // Retrieve the playerId from the registry
        await this.updatePlayerScoreInDB(playerId);
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



