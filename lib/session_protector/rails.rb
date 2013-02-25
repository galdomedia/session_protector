require "rack/session_protector"
require 'rails'

module SessionProtector

  class Engine < Rails::Engine
    config.app_middleware.use Rack::SessionProtector
  end

end