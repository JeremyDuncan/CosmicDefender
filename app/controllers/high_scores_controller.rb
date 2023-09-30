class HighScoresController < ApplicationController
  # ==============================================================================
  # This method fetches all high scores from the database and renders them as JSON.
  # ------------------------------------------------------------------------------
  def index
    @high_scores = HighScore.all
    render json: @high_scores
  end


end
