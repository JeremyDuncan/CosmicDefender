import Phaser        from 'phaser';
import GameScene     from './scenes/game_scene';
import GameOverScene from './scenes/game_over_scene';
import Background    from './helpers/Background';

// ==============================================================================
// TitleScene class
// ------------------------------------------------------------------------------
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const playerName = this.registry.get('playerName');  // Retrieve playerName from the registry
    const centerX    = this.scale.width / 2;
    const centerY    = this.scale.height / 2;
    this.background  = new Background(this);
    const baseFontSize = this.scale.width < 768 ? 16 : 32; // Determine font size based on screen width

    const title = this.add.text(centerX, centerY - 80, 'Cosmic Defender', { fontSize: `${baseFontSize + 5}px`, fill: '#fff', fontWeight: 'bold'});
    title.setOrigin(0.5);

    // Display the player name
    const welcomeText = this.add.text(centerX, centerY - 40, `Welcome ${playerName}`, { fontSize: `${baseFontSize - 10}px`, fill: '#fff' });
    welcomeText.setOrigin(0.5);

    const startButton = this.add.text(centerX, centerY , 'Start Game', { fontSize: `${baseFontSize + 5}px`, fill: '#1a7e04', fontWeight: 'bold' });
    startButton.setOrigin(0.5);
    startButton.setInteractive();
    startButton.on('pointerdown', () => this.scene.start('GameScene'));  // No need to pass playerName here
  }

  update() {
    // Update the starfield
    this.background.updateStars(0.5, 0.5);  // You can adjust these values to control the speed
    this.background.randomizeAlpha();
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
      height: window.innerHeight,
      orientation: Phaser.Scale.Orientation.LANDSCAPE
    },
    scene: [TitleScene, GameScene, HighScoreScene, GameOverScene],  // Add GameOverScene here
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

  // Lock the orientation to landscape
  game.scale.lockOrientation('landscape');

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

