class VirtualGamepad {
  constructor(scene) {
    this.scene = scene;
    this.pointer = null;
    this.dx = 0;
    this.dy = 0;

    // ============================================
    // Only show the gamepad on non-desktop devices
    // --------------------------------------------
    if (this.scene.sys.game.device.os.desktop === false) {
      this.gamepadGraphics = this.scene.add.graphics();
      this.gamepadGraphics.fillStyle(0x444444, 0.5);
      this.gamepadGraphics.fillRoundedRect(50, this.scene.scale.height - 150, 100, 100, 15);
      this.directionIndicator = this.scene.add.graphics();
    }
    this.scene.input.on('pointerdown', this.onTouchStart.bind(this));
    this.scene.input.on('pointerup', this.onTouchEnd.bind(this));
    this.scene.input.on('pointermove', this.onTouchMove.bind(this));
  }

  onTouchStart(pointer) {
    const distance = Phaser.Math.Distance.Between(
      100, this.scene.scale.height - 100,
      pointer.x, pointer.y
    );

    if (distance < 50) {
      this.pointer = pointer;
      this.scene.inputHandler.setDpadActive(true);  // Set D-pad active flag
    }
  }

  onTouchEnd() {
    if (this.pointer) {
      this.pointer = null;
      this.directionIndicator.clear();               // Clear the direction indicator
      this.scene.inputHandler.setDpadActive(false);  // Clear D-pad active flag
    }
  }

  onTouchMove(pointer) {
    if (this.pointer) {
      const angleInRad = Phaser.Math.Angle.Between(
        100, this.scene.scale.height - 100,
        pointer.x, pointer.y
      );
      this.dx = Math.cos(angleInRad);
      this.dy = Math.sin(angleInRad);
      this.scene.spaceship.angle = Phaser.Math.RadToDeg(angleInRad) + 90; // Update spaceship angle
      // ========================
      // Draw direction indicator
      // ------------------------
      this.directionIndicator.clear();
      this.directionIndicator.fillStyle(0xff0000, 0.6);
      this.directionIndicator.fillCircle(100 + this.dx * 25, this.scene.scale.height - 100 + this.dy * 25, 20);
    }
  }

  update() {
    if (this.pointer) {
      const angleInRad = Phaser.Math.DegToRad(this.scene.spaceship.angle); // Use the spaceship's angle to calculate dx and dy
      this.dx = this.scene.spaceshipSpeed * Math.cos(angleInRad);
      this.dy = this.scene.spaceshipSpeed * Math.sin(angleInRad);
    }
  }
}

export default VirtualGamepad;
