class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.gameOverText = this.add.text(centerX, centerY - 40, 'Game Over', {
      fontSize: '64px',
      fill: '#ff0000'
    }).setOrigin(0.5).setDepth(1).setVisible(true);

    this.retryText = this.add.text(centerX, centerY + 40, 'Retry', {
      fontSize: '32px',
      fill: '#00ff00'
    }).setOrigin(0.5).setDepth(1).setVisible(true).setInteractive();


    this.exitText = this.add.text(centerX, centerY + 100, 'Exit', {
      fontSize: '32px',
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
