module SessionProtector
  VERSION = '0.0.1'
  
  # Check IP. True by default
  mattr_accessor :check_ip
  @@check_ip = true

  def self.setup
    yield self
  end
end
