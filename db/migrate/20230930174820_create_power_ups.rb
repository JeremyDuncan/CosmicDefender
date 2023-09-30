class CreatePowerUps < ActiveRecord::Migration[7.0]
  def change
    create_table :power_ups do |t|
      t.integer :player_id
      t.string :name
      t.string :effect

      t.timestamps
    end
  end
end
