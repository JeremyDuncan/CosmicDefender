class CreateHighScores < ActiveRecord::Migration[7.0]
  def change
    create_table :high_scores do |t|
      t.integer :player_id
      t.integer :level_id
      t.integer :score

      t.timestamps
    end
  end
end
