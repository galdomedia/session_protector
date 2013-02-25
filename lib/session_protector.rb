require "session_protector/version"

module SessionProtector
  # Check IP. True by default
  def self.check_ip
    @@check_ip
  end

  def self.check_ip= attr
    @@check_ip = attr
  end

  @@check_ip = true

  def self.setup
    yield self
  end
end

require 'session_protector/rails'
