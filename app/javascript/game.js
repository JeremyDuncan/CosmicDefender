import Phaser from 'phaser';
import GameScene from './game_scene';

// TitleScene class
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const title = this.add.text(400, 300, 'Cosmic Defender', { fontSize: '32px', fill: '#fff' });
    title.setOrigin(0.5);
    const startButton = this.add.text(400, 400, 'Start Game', { fontSize: '32px', fill: '#fff' });
    startButton.setOrigin(0.5);
    startButton.setInteractive();
    startButton.on('pointerdown', () => this.scene.start('GameScene'));
  }
}

// HighScoreScene class
class HighScoreScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HighScoreScene' });
  }

  create() {
    // Fetch and display high scores from your Rails API
    this.add.text(20, 20, 'High Scores', { fontSize: '32px', fill: '#fff' });
  }
}

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [TitleScene, GameScene, HighScoreScene],  // GameScene is imported
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },  // No gravity in this game
      debug: false  // Set it to true if you want to see the debug info
    }
  }
};

// Initialize the game with the config
const game = new Phaser.Game(config);
