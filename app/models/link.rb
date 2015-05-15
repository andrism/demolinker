class Link < ActiveRecord::Base

  belongs_to :user

  validates :user,:url,:shortcut, presence: true 

  validates :shortcut, uniqueness: true, format: { with: /\A[a-z0-9][a-z0-9\-]*[a-z0-9]\z/,
    message: "only allows lowercase latin letters and arabic digits with dashes in between" }

  validates :url, format: { with: /\A[a-zA-Z]*\:\/\/[a-zA-z0-9].*\z/,
    message: "should at least start with protocol" }


  def random_shortcut
    SecureRandom.urlsafe_base64(5).downcase
  end

end
