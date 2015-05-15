class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.references :user, index: true, foreign_key: true
      t.integer :clicks
      t.string :shortcut
      t.text :url
      t.text :notes

      t.timestamps null: false
    end
  end
end
