# app/services/player_score_updater.rb

class PlayerScoreUpdater
  def initialize(player_id, new_score)
    @player_id = player_id
    @new_score = new_score
  end

  def call
    player = Player.find(@player_id)
    if player.update(score: @new_score)
      { status: 'SUCCESS', message: 'Updated player score', data: player }
    else
      { status: 'ERROR', message: 'Player score not updated', data: player.errors }
    end
  end
end
