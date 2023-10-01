module Api
  module V1
    class PlayersController < ApplicationController
      include ConsoleColors
      def update_score
        result = PlayerScoreUpdater.new(params[:id], params[:score]).call
        debug(params, "PARAMS")
        debug(result, "RESULT")
        if result[:status] == 'SUCCESS'
          render json: result, status: :ok
        else
          render json: result, status: :unprocessable_entity
        end
      end
    end
  end
end
