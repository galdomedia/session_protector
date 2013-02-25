require "session_protector/version"

module SessionProtector
  # Check IP. True by default
  mattr_accessor :check_ip
  @@check_ip = true

  def self.setup
    yield self
  end
end

require 'session_protector/rails'
