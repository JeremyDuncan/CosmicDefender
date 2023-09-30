class LevelsController < ApplicationController
  # ==============================================================================
  # This method fetches all levels from the database and renders them as JSON.
  # ------------------------------------------------------------------------------
  def index
    @levels = Level.all
    render json: @levels
  end

  # ==============================================================================
  # This method fetches the players who have high scores on a particular level.
  # ------------------------------------------------------------------------------
  def players
    @level = Level.find(params[:id])
    render json: @level.players
  end

end
