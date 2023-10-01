class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('spaceship', '/assets/player_spaceship.png');
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

    this.spaceship = this.physics.add.sprite(400, 300, 'spaceship');
    this.spaceship.setScale(0.5);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceshipSpeed = 5;
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
  }
}

export default GameScene;
