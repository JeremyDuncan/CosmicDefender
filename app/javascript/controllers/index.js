// Import and register all your controllers from the importmap under controllers/*

import { application } from "controllers/application"

// Eager load all controllers defined in the import map under controllers/**/*_controller
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)

// Lazy load controllers as they appear in the DOM (remember not to preload controllers in import map!)
// import { lazyLoadControllersFrom } from "@hotwired/stimulus-loading"
// lazyLoadControllersFrom("controllers", application)

// Import Phaser and initialize the game
// import '../game';

// DOMContentLoaded ensures the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function() {
    const startButton      = document.getElementById("start-button");
    const playerPrompt     = document.getElementById("player-prompt");
    const continueButton   = document.getElementById("continue-button");
    const highScoresPrompt = document.getElementById("high-scores-prompt");

    startButton.addEventListener("click", function() {
        playerPrompt.classList.remove("hidden");
    });

    continueButton.addEventListener("click", function() {
        // Fetch or save player name here
        highScoresPrompt.classList.remove("hidden");
    });
});