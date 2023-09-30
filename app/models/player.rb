class Player < ApplicationRecord
  has_many :high_scores
  has_many :power_ups
  has_many :levels, through: :high_scores
end
