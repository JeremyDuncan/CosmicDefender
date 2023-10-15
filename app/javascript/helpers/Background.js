class Background {
  constructor(scene) {
    this.scene = scene;
    this.starsGraphics = this.scene.add.group();  // Create a Phaser group for stars

    // Create stars in the background
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 1600);
      const y = Phaser.Math.Between(0, 1200);
      const size = Phaser.Math.Between(1, 3);
      const star = this.scene.add.circle(x, y, size, 0xFFFFFF);
      star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      this.starsGraphics.add(star);  // Add each star to the group
    }
  }

  // ==============================================================================
  // Update the positions of the stars based on the spaceship's movement
  // ------------------------------------------------------------------------------
  updateStars(dx, dy) {
    this.starsGraphics.getChildren().forEach(star => {
      star.x -= dy;
      star.y += dx;

      // Wrap stars around the screen
      if (star.x < 0) star.x += 1600;
      if (star.x > 1600) star.x -= 1600;
      if (star.y < 0) star.y += 1200;
      if (star.y > 1200) star.y -= 1200;
    });
  }

  // ==============================================================================
  // Randomly change the alpha value of the stars for a twinkling effect
  // ------------------------------------------------------------------------------
  randomizeAlpha() {
    this.starsGraphics.getChildren().forEach(star => {
      if (Phaser.Math.Between(0, 10) > 8) {
        star.alpha = Phaser.Math.FloatBetween(0.5, 1);
      }
    });
  }
}

export default Background;
