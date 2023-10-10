# app/controllers/game_controller.rb
class GameController < ApplicationController
  def index
    # @high_scores = HighScore.where("score IS NOT NULL AND score > 0 AND score != ''")
    #                         .order(score: :desc)
    #                         .limit(10)

    @players = Player.where("score IS NOT NULL AND score > 0")
                     .order(score: :desc).limit(10)
  end
  # app/controllers/game_controller.rb
  def save_player
    @player = Player.create(name: params[:name])
    respond_to do |format|
      format.json { render json: @player, status: :created }
    end
  end

end
