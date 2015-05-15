class LinksController < ApplicationController

  before_action :authenticate_user!, except: "goto"

  active_scaffold :"link" do |conf|
	conf.columns.exclude :user
        conf.columns.exclude :updated_at
        conf.actions.exclude :show
        conf.create.columns.exclude :clicks
        conf.update.columns.exclude :clicks
  end

  def goto
   begin
    requested_shortcut = request.host.scan(/^[^\.]*/)[0]
    link = Link.find_by_shortcut(requested_shortcut)
    link.increment!(:clicks)
    redirect_to link.url
   rescue
    redirect_to action: "index"
   end
  end

  protected

  def conditions_for_collection
    ['user_id = ?',current_user.id]
  end

  def before_create_save(record)
    record.user ||= current_user
    record.clicks ||=0
  end

end
