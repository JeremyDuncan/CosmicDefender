// ==============================================================================
// Alien class to handle alien spaceships
// ------------------------------------------------------------------------------
class Alien {
  constructor(scene) {
    this.scene = scene;
    this.alienSpaceships = this.scene.physics.add.group();
  }

// ==============================================================================
// Method to spawn an alien spaceship
// The method ensures that the alien does not spawn too close to existing aliens
// It also makes sure that aliens can spawn from all directions
// ------------------------------------------------------------------------------
  spawnAlien(gameWidth, gameHeight) {
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
      alienSpaceship.randomVelocity = Phaser.Math.Between(30, 190);

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
