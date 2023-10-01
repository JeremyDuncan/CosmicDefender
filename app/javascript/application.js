// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// ########################################
// ## GAME CODE ##
// ###############
import './game';
import { initializeGame } from './game';
window.initializeGame = initializeGame;
