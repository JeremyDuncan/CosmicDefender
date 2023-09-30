class HighScore < ApplicationRecord
  belongs_to :player
  belongs_to :level
end
