class AddColumnsToPlayer < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :powerup, :string
    add_column :players, :laser, :string
    add_column :players, :shield, :boolean
  end
end
