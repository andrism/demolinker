module LinksHelper

  def shortcut_column(record, param)

    full_link = "#{request.protocol}#{record.shortcut}.#{request.domain}#{ ([80,443].include? request.port) ? '' : ":#{request.port}"}"
    "<a target='_blank' class='show' href='#{full_link}'>#{full_link}</a>".html_safe

  end

end
