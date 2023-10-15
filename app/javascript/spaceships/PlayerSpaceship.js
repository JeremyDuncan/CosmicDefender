export default class PlayerSpaceship {
  constructor(scene) {
    this.scene = scene;
    this.initializeSpaceship();
  }

  // ==============================================================================
  // Initialize the player's spaceship
  // ------------------------------------------------------------------------------
  initializeSpaceship() {
    // ===============================================================
    // Set the initial scale of the spaceship based on the screen size
    // ---------------------------------------------------------------
    const gameWidth         = this.scene.scale.width;
    const gameHeight        = this.scene.scale.height;
    const isMobile          = gameWidth < 800;
    const initialScale      = isMobile ? Math.min(0.4 * (gameWidth / 800), 0.4 * (gameHeight / 600)) : 0.4;
    this.spaceship          = this.scene.physics.add.sprite(gameWidth / 2, gameHeight / 2, 'spaceship').setScale(initialScale);
    this.speedScalingFactor = isMobile ? 0.5 : 1;
    this.spaceshipSpeed     = 5 * this.speedScalingFactor;
  }

  // ==============================================================================
  // Method to handle the resize event for the spaceship
  // ------------------------------------------------------------------------------
  handleResize(gameSize) {
    const width    = gameSize.width;
    const height   = gameSize.height;
    const isMobile = width < 800;
    const newScale = isMobile ? Math.min(0.4 * (width / 800), 0.4 * (height / 600)) : 0.4;
    this.spaceship.setScale(newScale);
  }

  getSpaceship() {
    return this.spaceship;
  }

  getSpeed() {
    return this.spaceshipSpeed;
  }
}
