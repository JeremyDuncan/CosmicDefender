//####################################################################################################################
//#######  IMPORT CLASSES  ###########################################################################################
//####################################################################################################################
import Alien            from './Alien';
import Background       from './Background';
import Laser            from './Laser';
import RedLaser         from './RedLaser';
import SuperLaser       from './SuperLaser';
import Explosion        from './Explosion';
import Scoreboard       from './Scoreboard';
import InputHandler     from './InputHandler';
import CollisionHandler from './CollisionHandler';
import ParticleManager  from './ParticleManager';
import VirtualGamepad   from './VirtualGamepad';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.inputEnabled = true;
    this.speedScalingFactor = 1; // Initialize to 1, will be updated in create()
  }

  //####################################################################################################################
  //#######  PRELOAD  (Assets) #########################################################################################
  //####################################################################################################################
  preload() {
    // == Laser Images ====================================================
    this.load.image('laser', '/assets/lasers/17.png');
    this.load.image('redLaser', '/assets/lasers/02.png');
    this.load.image('superLaser', '/assets/lasers/65.png');
    // == Laser Sounds ====================================================
    this.load.audio('laserSound', '/assets/laser5.wav');
    this.load.audio('redLaserSound', '/assets/laser4.wav');
    this.load.audio('superLaserSound', '/assets/laser6.wav');

    // == Ships ===========================================================
    this.load.image('spaceship', '/assets/player_spaceship.png');
    this.load.image('alienSpaceship', '/assets/enemy_spaceship.png');

    // == Misc Sounds ======================================================
    this.load.audio('explosionSound', '/assets/explosion.flac');
    this.load.audio('gemSound', '/assets/power_up1.wav');

    // == Particles ========================================================
    this.load.image('particleOne', '/assets/particle1.png');
    this.load.image('mainParticle', '/assets/particleStar.png');

    // == Animations =======================================================
    this.load.spritesheet('explosion', '/assets/explosions/explosion_1.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('gemSprite', '/assets/powerup1.png', { frameWidth: 32, frameHeight: 32 });
  }


  //####################################################################################################################
  //#######  CREATE  ###################################################################################################
  //####################################################################################################################
  create() {
    this.inputEnabled = true;  // Reset the input flag
    // ==================
    // initialize classes
    // ==================
    this.background      = new Background(this);
    this.alien           = new Alien(this);
    this.laser           = new Laser(this);
    this.redLaser        = new RedLaser(this);
    this.superLaser      = new SuperLaser(this);
    this.explosion       = new Explosion(this);
    this.scoreboard      = new Scoreboard(this);
    this.particleManager = new ParticleManager(this);

    // ============================
    // Initialize arrays and groups
    // ============================
    this.starsGraphics    = [];

    // Set the initial scale of the spaceship based on the screen size
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const isMobile = gameWidth < 800; // Adjust this value based on what you consider "mobile"
    const initialScale = isMobile ? Math.min(0.4 * (gameWidth / 800), 0.4 * (gameHeight / 600)) : 0.4;
    this.spaceship = this.physics.add.sprite(gameWidth / 2, gameHeight / 2, 'spaceship').setScale(initialScale);
    // Update speed scaling factor
    this.speedScalingFactor = isMobile ? 0.5 : 1;

    this.spaceshipSpeed = 5 * this.speedScalingFactor; // Update spaceship speed
    this.lasers           = this.physics.add.group();
    this.alienSpaceships  = this.physics.add.group();
    this.cursors          = this.input.keyboard.createCursorKeys();
    this.inputHandler     = new InputHandler(this.input, this.cursors, this.spaceship, this.spaceshipSpeed);
    this.collisionHandler = new CollisionHandler(this, this.laser, this.redLaser, this.superLaser, this.alien,
                                                 this.spaceship, this.explosion, this.scoreboard, this.particleManager);
    // Listen for the resize event
    this.scale.on('resize', this.handleResize, this);
  }

  //####################################################################################################################
  //#######  UPDATE  ###################################################################################################
  //####################################################################################################################
  update() {
    if (!this.inputEnabled) {return} // Skip the rest of the update if input is disabled
    this.virtualGamepad.update();
    this.inputHandler.handleInputAndUpdatePositions(this.alien, this.background, this.explosion); //makes sure everything moves relative to each other
    this.background.randomizeAlpha();                                        // Makes blinky stars
    this.handleLasersAndDifficulty();                                        // updates lasers based on score
    this.laser.destroyOffScreen();                                           // removes lasers once they leave the screen
    const moveForward = this.inputHandler.moveForward;                       // Get Touch signal to move forward
    this.alien.moveAliens(this.spaceship, this.spaceshipSpeed, moveForward); // Handle alien spaceship movement
    this.collisionHandler.handleCollisions();                                // Ship and laser Collision handling
    this.collisionHandler.handleParticleCollisions();                        // Particle Collision handling
  }

  //####################################################################################################################
  //####### HELPER METHODS  ############################################################################################
  //####################################################################################################################
  handleLasersAndDifficulty() {
    // ==================================================================
    // Determine the number of aliens to spawn based on the current score
    // ==================================================================
    const currentScore        = this.scoreboard.getScore();      // Get score from database
    const shouldFireFromTouch = this.inputHandler.shouldFire;    // Touch Input
    const spacebar            = this.inputHandler.getSpacebar(); // Spacebar Input
    let   numAliensToSpawn;

    if (currentScore < 500) {
      numAliensToSpawn = 1;
      this.redLaser.fire(shouldFireFromTouch, spacebar, this.spaceship, this.spaceship.angle);
    } else if (currentScore < 1500) {
      numAliensToSpawn = 2;
      const shouldFireFromSpaceBar = Phaser.Input.Keyboard.JustDown(this.inputHandler.getSpacebar());
      this.laser.fire(shouldFireFromTouch, shouldFireFromSpaceBar, this.spaceship, this.spaceship.angle);
    } else if (currentScore < 9500) {
      numAliensToSpawn = 6;
      this.superLaser.fire(shouldFireFromTouch, spacebar, this.spaceship, this.spaceship.angle);
    } else {
      numAliensToSpawn = 15;
      this.superLaser.fire(shouldFireFromTouch, spacebar, this.spaceship, this.spaceship.angle);
    }

    // Handle alien spaceship spawning
    if (Phaser.Math.Between(0, 100) > 95) {
      for (let i = 0; i < numAliensToSpawn; i++) {
        this.alien.spawnAlien(this.scale.width, this.scale.height, currentScore);
      }
    }
  }

  // ==============================================================================
  // Method to handle the resize event
  // ------------------------------------------------------------------------------
  handleResize(gameSize, baseSize, displaySize, resolution) {
    const width = gameSize.width;
    const height = gameSize.height;
    const isMobile = width < 800; // Adjust this value based on what you consider "mobile"

    // Update the scale of the spaceship based on the new dimensions
    const newScale = isMobile ? Math.min(0.4 * (width / 800), 0.4 * (height / 600)) : 0.4;
    this.spaceship.setScale(newScale);
  }

}
export default GameScene;
