class InputHandler {
  constructor(input, cursors, spaceship, spaceshipSpeed) {
    this.input          = input;
    this.cursors        = cursors;
    this.spaceship      = spaceship;
    this.spaceshipSpeed = spaceshipSpeed;
    this.spacebar       = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.isDpadActive   = false;

    // =====================
    // Touch event listeners
    // ---------------------
    this.input.on('pointerdown', this.onTouchStart.bind(this)); // Handles touch start
    this.input.on('pointerup', this.onTouchEnd.bind(this));     // Handles touch stop
    this.input.on('pointermove', this.onTouchMove.bind(this));  // Handles touch tracking
    this.moveForward = false; // Flag to indicate whether the spaceship should move forward
    this.shouldFire  = false; // Flag to indicate whether to fire
  }

  onTouchStart(pointer) {
    if (this.isDpadActive) return;
    const angleInRad = Phaser.Math.Angle.Between(
      this.spaceship.x, this.spaceship.y,
      pointer.x, pointer.y
    );
    this.spaceship.angle = Phaser.Math.RadToDeg(angleInRad) + 90;
    this.moveForward = true;
    this.shouldFire  = true;
  }
  onTouchEnd() {
    if (this.isDpadActive) return;
    this.moveForward = false;
    this.shouldFire  = false;
  }

  onTouchMove(pointer) {
    if (this.isDpadActive) return;
    if (this.moveForward) {
      const angleInRad = Phaser.Math.Angle.Between(
        this.spaceship.x, this.spaceship.y,
        pointer.x, pointer.y
      );
      this.spaceship.angle = Phaser.Math.RadToDeg(angleInRad) + 90;
    }
  }

  setDpadActive(isActive) {
    this.isDpadActive = isActive;
    this.moveForward = true;
    this.shouldFire  = true;
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
    if (this.cursors.up.isDown || this.moveForward) {
      const angleInRad = Phaser.Math.DegToRad(this.spaceship.angle);
      dx = this.spaceshipSpeed * Math.cos(angleInRad);
      dy = this.spaceshipSpeed * Math.sin(angleInRad);
    }
    return { dx, dy };
  }

  handleInputAndUpdatePositions(alien, background, explosion, dx = 0, dy = 0) {
    if (dx === 0 && dy === 0) {
      const inputResult = this.handleInput();
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
