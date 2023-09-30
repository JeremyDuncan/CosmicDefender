class CreateLevels < ActiveRecord::Migration[7.0]
  def change
    create_table :levels do |t|
      t.integer :number
      t.string :difficulty
      t.integer :player_id

      t.timestamps
    end
  end
end
