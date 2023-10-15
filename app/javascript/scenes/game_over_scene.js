class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const baseFontSize = this.scale.width < 768 ? 16 : 32; // Determine font size based on screen width

    this.gameOverText = this.add.text(centerX, centerY - 80, 'Game Over', {
      fontSize: `${baseFontSize + 15}px`,
      fill: '#ff0000'
    }).setOrigin(0.5).setDepth(1).setVisible(true);

    this.retryText = this.add.text(centerX, centerY - 40, 'Retry', {
      fontSize: `${baseFontSize + 5}px`,
      fill: '#00ff00'
    }).setOrigin(0.5).setDepth(1).setVisible(true).setInteractive();


    this.exitText = this.add.text(centerX, centerY , 'Exit', {
      fontSize: `${baseFontSize + 5}px`,
      fill: '#ffffff'
    }).setOrigin(0.5).setDepth(1).setVisible(true).setInteractive();

    this.retryText.on('pointerdown', () => {
      this.scene.stop('GameOverScene');
      this.scene.start('GameScene');
    });

    // Add a click event to the "Exit" text
    this.exitText.on('pointerdown', () => {
      window.location.href = '/';  // Redirect to root URL
    });
  }
}

export default GameOverScene;
