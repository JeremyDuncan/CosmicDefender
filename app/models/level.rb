class Level < ApplicationRecord
  has_many :high_scores
  has_many :players, through: :high_scores
end
