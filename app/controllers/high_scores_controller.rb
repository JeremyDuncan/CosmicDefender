class HighScoresController < ApplicationController
  # ==============================================================================
  # This method fetches all high scores from the database and renders them as JSON.
  # ------------------------------------------------------------------------------
  def index
    @high_scores = HighScore.where("score IS NOT NULL AND score > 0 AND score != ''")
                            .order(score: :desc)
                            .limit(10)

    render json: @high_scores
  end


end
