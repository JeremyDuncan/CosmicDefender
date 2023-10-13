class InputHandler {
  constructor(input, cursors, spaceship, spaceshipSpeed) {
    this.input          = input;
    this.cursors        = cursors;
    this.spaceship      = spaceship;
    this.spaceshipSpeed = spaceshipSpeed;
    this.spacebar       = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  handleInput() {
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown) {
      this.spaceship.angle -= 3;
    }
    if (this.cursors.right.isDown) {
      this.spaceship.angle += 3;
    }
    if (this.cursors.up.isDown) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
      dx = this.spaceshipSpeed * Math.cos(angleInRad);
      dy = this.spaceshipSpeed * Math.sin(angleInRad);
    }

    return { dx, dy };
  }

  handleInputAndUpdatePositions(alien, background, explosion) {
    let dx = 0, dy = 0;
    const inputResult = this.handleInput();
    if (inputResult) {
      dx = inputResult.dx;
      dy = inputResult.dy;
    }

    if (dx !== 0 || dy !== 0) {
      alien.gems.getChildren().forEach(gem => {
        gem.x -= dy;
        gem.y += dx;
      });
      background.updateStars(dx, dy);
      explosion.updateExplosions(dx, dy);
    }
  }

  getSpacebar() {
    return this.spacebar;
  }
}

export default InputHandler;
