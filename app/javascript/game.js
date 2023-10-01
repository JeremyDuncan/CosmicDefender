import Phaser from 'phaser';
import GameScene from './game_scene';

// ==============================================================================
// TitleScene class
// ------------------------------------------------------------------------------
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const playerName = this.registry.get('playerName');  // Retrieve playerName from the registry

    const title = this.add.text(400, 300, 'Cosmic Defender', { fontSize: '32px', fill: '#fff' });
    title.setOrigin(0.5);

    // Display the player name
    const welcomeText = this.add.text(400, 350, `Welcome ${playerName}`, { fontSize: '24px', fill: '#fff' });
    welcomeText.setOrigin(0.5);

    const startButton = this.add.text(400, 400, 'Start Game', { fontSize: '32px', fill: '#fff' });
    startButton.setOrigin(0.5);
    startButton.setInteractive();
    startButton.on('pointerdown', () => this.scene.start('GameScene'));  // No need to pass playerName here
  }
}

// ==============================================================================
// HighScoreScene class
// ------------------------------------------------------------------------------
class HighScoreScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HighScoreScene' });
  }

  create() {
    // Fetch and display high scores from your Rails API
    this.add.text(20, 20, 'High Scores', { fontSize: '48px', fill: '#fff' });
  }
}

// ==============================================================================
// Initialize the game and set playerName as a global variable
// ------------------------------------------------------------------------------
function initializeGame(playerName, playerId) {
  // Initial game configuration
  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight
    },
    scene: [TitleScene, GameScene, HighScoreScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };

  // Initialize the game with the config
  const game = new Phaser.Game(config);

  // Set playerName as a global variable
  game.registry.set('playerName', playerName);
  game.registry.set('playerId', playerId);


  // Listen for browser resize events
  window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
}

// Export the function
export { initializeGame };

