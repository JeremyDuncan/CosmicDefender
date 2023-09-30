class PowerUpsController < ApplicationController
  # ==============================================================================
  # This method fetches all power-ups from the database and renders them as JSON.
  # ------------------------------------------------------------------------------
  def index
    @power_ups = PowerUp.all
    render json: @power_ups
  end

  # ==============================================================================
  # This method fetches the player associated with a particular power-up.
  # ------------------------------------------------------------------------------
  def player
    @power_up = PowerUp.find(params[:id])
    render json: @power_up.player
  end
end
