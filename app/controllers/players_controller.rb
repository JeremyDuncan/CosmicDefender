class PlayersController < ApplicationController
  # ==============================================================================
  # This method fetches a player's high scores and renders them as JSON.
  # ------------------------------------------------------------------------------
  def high_scores
    @player = Player.find(params[:id])
    render json: @player.high_scores
  end

  # ==============================================================================
  # This method fetches a player's levels and renders them as JSON.
  # ------------------------------------------------------------------------------
  def levels
    @player = Player.find(params[:id])
    render json: @player.levels
  end

  # ==============================================================================
  # This method fetches a player's power-ups and renders them as JSON.
  # ------------------------------------------------------------------------------
  def power_ups
    @player = Player.find(params[:id])
    render json: @player.power_ups
  end

end
