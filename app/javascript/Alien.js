// ==============================================================================
// Alien class to handle alien spaceships
// ------------------------------------------------------------------------------
class Alien {
  constructor(scene) {
    this.scene = scene;
    this.alienSpaceships = this.scene.physics.add.group();
    this.gems = this.scene.physics.add.group();
    // Create the gem animation
    this.scene.anims.create({
      key: 'gemAnim',
      frames: this.scene.anims.generateFrameNumbers('gemSprite', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }

  // ==============================================================================
  // Method to drop a gem at a given position (x, y)
  // ------------------------------------------------------------------------------
  dropGem(x, y) {
    const gem = this.gems.create(x, y, 'gemSprite');
    gem.setScale(1); // Set the scale as needed
    gem.play('gemAnim'); // Play the animation
  }

// ==============================================================================
// Method to set the speed of an alien spaceship based on the current score
// ------------------------------------------------------------------------------
  setAlienSpeed(alienSpaceship, currentScore) {
    let speed;
    if (currentScore < 100) {
      speed = Phaser.Math.Between(100, 150);
    } else if (currentScore < 200) {
      speed = Phaser.Math.Between(100, 200);
    } else if (currentScore < 300) {
      speed = Phaser.Math.Between(200, 300);
    } else if (currentScore < 500) {
      speed = Phaser.Math.Between(200, 300);
    } else if (currentScore < 700) {
      speed = Phaser.Math.Between(200, 300);
    } else if (currentScore < 900) {
      speed = Phaser.Math.Between(200, 300);
    } else if (currentScore < 1100) {
      speed = Phaser.Math.Between(220, 330);
    } else if (currentScore < 1300) {
      speed = Phaser.Math.Between(240, 300);
    } else if (currentScore < 1500) {
      speed = Phaser.Math.Between(300, 300);
    } else {
      speed = Phaser.Math.Between(300, 400);
    }
    alienSpaceship.randomVelocity = speed;
  }

  // ==============================================================================
  // Method to spawn an alien spaceship
  // The method ensures that the alien does not spawn too close to existing aliens
  // It also makes sure that aliens can spawn from all directions
  // ------------------------------------------------------------------------------
  spawnAlien(gameWidth, gameHeight, currentScore) {
    let attempts = 0;
    let x, y;
    let tooClose;

    do {
      // Randomly choose a side (top, bottom, left, right) to spawn the alien
      const side = Phaser.Math.Between(1, 4);

      switch (side) {
        case 1: // Top
          x = Phaser.Math.Between(0, gameWidth);
          y = Phaser.Math.Between(-100, -50);
          break;
        case 2: // Bottom
          x = Phaser.Math.Between(0, gameWidth);
          y = Phaser.Math.Between(gameHeight + 50, gameHeight + 100);
          break;
        case 3: // Left
          x = Phaser.Math.Between(-100, -50);
          y = Phaser.Math.Between(0, gameHeight);
          break;
        case 4: // Right
          x = Phaser.Math.Between(gameWidth + 50, gameWidth + 100);
          y = Phaser.Math.Between(0, gameHeight);
          break;
      }

      tooClose = this.alienSpaceships.getChildren().some(alienSpaceship => {
        return Phaser.Math.Distance.Between(x, y, alienSpaceship.x, alienSpaceship.y) < 100;
      });

      attempts++;
    } while (tooClose && attempts < 10);

    if (!tooClose) {
      const alienSpaceship = this.alienSpaceships.create(x, y, 'alienSpaceship');
      alienSpaceship.setScale(0.05);
      this.setAlienSpeed(alienSpaceship, currentScore);

      // alienSpaceship.randomVelocity = Phaser.Math.Between(30, 190);

    }
  }


  moveAliens(spaceship, spaceshipSpeed) {
    this.alienSpaceships.getChildren().forEach(alienSpaceship => {
      const angleToPlayer = Phaser.Math.Angle.Between(
        alienSpaceship.x, alienSpaceship.y,
        spaceship.x, spaceship.y
      );

      let velocity = alienSpaceship.randomVelocity || 50;
      alienSpaceship.setVelocity(
        velocity * Math.cos(angleToPlayer),
        velocity * Math.sin(angleToPlayer)
      );

      if (this.scene.cursors.up.isDown) {
        const angleInRad = Phaser.Math.DegToRad(spaceship.angle);
        const dx = spaceshipSpeed * Math.cos(angleInRad);
        const dy = spaceshipSpeed * Math.sin(angleInRad);

        alienSpaceship.x -= dy;
        alienSpaceship.y += dx;
      }

      if (alienSpaceship.x < -100 || alienSpaceship.x > this.scene.scale.width + 100 ||
        alienSpaceship.y < -100 || alienSpaceship.y > this.scene.scale.height + 100) {
        alienSpaceship.destroy();
      }
    });
  }
  getAlienSpaceships() {
    return this.alienSpaceships;
  }
}

export default Alien;
