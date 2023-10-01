class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;  // Initialize the score variable
    this.gameOver = false;  // Initialize the game over flag

  }

  // ==============================================================================
  // Function to update player score in the database
  // ------------------------------------------------------------------------------
  async updatePlayerScoreInDB(playerId) {
    console.log("Player ID:", playerId);  // Log the playerId

    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const url = `http://localhost:3000/api/v1/players/${playerId}/update_score`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken  // Include CSRF token
        },
        body: JSON.stringify({ score: this.score })
      });
    } catch (error) {
      console.error('There was a problem updating the score:', error);
    }
  }

  preload() {
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('laser', '/assets/lasers/17.png');
    this.load.image('alienSpaceship', '/assets/enemy_spaceship.png');
    this.load.spritesheet('explosion', '/assets/explosions/explosion_1.png', { frameWidth: 256, frameHeight: 256 });

  }

  create() {
    this.starsGraphics = [];
    this.explosions = this.add.group();

    // Create a text object for the scoreboard at the top right corner
    this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#fff'
    });

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

    this.spaceship = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'spaceship');
    this.spaceship.setScale(0.4);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceshipSpeed = 5;

    this.lasers = this.physics.add.group();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.alienSpaceships = this.physics.add.group();


    // Create a text object for the "Game Over" message but set it to be invisible initially
    this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);


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

        if (star.x < 0) star.x += 1600;
        if (star.x > 1600) star.x -= 1600;
        if (star.y < 0) star.y += 1200;
        if (star.y > 1200) star.y -= 1200;
      });

      // New code for updating explosion positions
      this.explosions.getChildren().forEach(explosion => {
        explosion.x -= dy;
        explosion.y += dx;

        if (explosion.x < 0) explosion.x += 1600;
        if (explosion.x > 1600) explosion.x -= 1600;
        if (explosion.y < 0) explosion.y += 1200;
        if (explosion.y > 1200) explosion.y -= 1200;
      });

    }

    this.starsGraphics.forEach(star => {
      if (Phaser.Math.Between(0, 10) > 8) {
        star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle - 90);
      const dx = Math.cos(angleInRad);
      const dy = Math.sin(angleInRad);

      const laserStartX = this.spaceship.x + 20 * dx;
      const laserStartY = this.spaceship.y + 20 * dy;

      const laser = this.lasers.create(laserStartX, laserStartY, 'laser');
      laser.setScale(0.5);
      laser.setAngle(this.spaceship.angle - 90);
      laser.setVelocity(500 * dx, 500 * dy);
      laser.setDepth(this.spaceship.depth - 1);
    }

    this.spaceship.setDepth(1);

    this.lasers.getChildren().forEach(laser => {
      if (laser.x < 0 || laser.x > 1600 || laser.y < 0 || laser.y > 1200) {
        laser.destroy();
      }
    });

    if (Phaser.Math.Between(0, 100) > 95) {
      let attempts = 0;
      let x, y;
      let tooClose;
      do {
        x = Phaser.Math.Between(-100, -50);
        y = Phaser.Math.Between(-100, -50);
        tooClose = this.alienSpaceships.getChildren().some(alienSpaceship => {
          return Phaser.Math.Distance.Between(x, y, alienSpaceship.x, alienSpaceship.y) < 100;
        });
        attempts++;
      } while (tooClose && attempts < 10);

      if (!tooClose) {
        const alienSpaceship = this.alienSpaceships.create(x, y, 'alienSpaceship');
        alienSpaceship.setScale(0.05);
      }
    }

    this.alienSpaceships.getChildren().forEach(alienSpaceship => {
      if (alienSpaceship.x >= 0 && alienSpaceship.x <= this.scale.width &&
        alienSpaceship.y >= 0 && alienSpaceship.y <= this.scale.height) {

        const angleToPlayer = Phaser.Math.Angle.Between(
          alienSpaceship.x, alienSpaceship.y,
          this.spaceship.x, this.spaceship.y
        );

        const velocity = 50;
        alienSpaceship.setVelocity(
          velocity * Math.cos(angleToPlayer),
          velocity * Math.sin(angleToPlayer)
        );
      }

      if (this.cursors.up.isDown) {
        const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
        const dx = this.spaceshipSpeed * Math.cos(angleInRad);
        const dy = this.spaceshipSpeed * Math.sin(angleInRad);

        alienSpaceship.x -= dy;
        alienSpaceship.y += dx;
      }

      if (alienSpaceship.x < -100 || alienSpaceship.x > this.scale.width + 100 ||
        alienSpaceship.y < -100 || alienSpaceship.y > this.scale.height + 100) {
        alienSpaceship.destroy();
      }
    });

    // Check for collisions between lasers and alien spaceships
    this.physics.overlap(this.lasers, this.alienSpaceships,  (laser, alienSpaceship) => {
      laser.destroy();

      const explosion = this.add.sprite(alienSpaceship.x, alienSpaceship.y, 'explosion');
      explosion.play('explode');
      this.explosions.add(explosion);  // Add explosion to the group

      alienSpaceship.destroy();

      this.score += 10;  // Increase the score by 10
      this.scoreText.setText(`Score: ${this.score}`);  // Update the scoreboard
    });

    // Check for collisions between player's spaceship and alien spaceships
    this.physics.overlap(this.spaceship, this.alienSpaceships, (spaceship, alienSpaceship) => {
      // Trigger an explosion at the collision point for the alien spaceship
      const alienExplosion = this.add.sprite(alienSpaceship.x, alienSpaceship.y, 'explosion');
      alienExplosion.play('explode');
      this.explosions.add(alienExplosion);

      // Destroy the alien spaceship
      alienSpaceship.destroy();

      // Trigger an explosion at the collision point for the player's spaceship
      const playerExplosion = this.add.sprite(spaceship.x, spaceship.y, 'explosion');
      playerExplosion.play('explode');
      this.explosions.add(playerExplosion);

      // Destroy the player's spaceship
      spaceship.destroy();
      this.time.delayedCall(1000, async () => {
        const playerId = this.registry.get('playerId');  // Retrieve playerName from the registry
        await this.updatePlayerScoreInDB(playerId);
        this.gameOverText.setVisible(true);
      });
      // Delay the "Game Over" text and pause the scene
      this.time.delayedCall(2000, () => {
        this.scene.pause();
      });
    });
  }

}

export default GameScene;
