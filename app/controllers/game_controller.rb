# app/controllers/game_controller.rb
class GameController < ApplicationController
  def index
    @players = Player.order(score: :desc).limit(10)
  end
  # app/controllers/game_controller.rb
  def save_player
    @player = Player.create(name: params[:name])
    respond_to do |format|
      format.json { render json: @player, status: :created }
    end
  end

end
