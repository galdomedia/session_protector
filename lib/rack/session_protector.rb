require 'session_protector/base'

module Rack
  class SessionProtector

    def initialize(app, options={})
      @options = {:check_ip => ::SessionProtector.check_ip}.merge(options)
      @app = app
    end

    def call(env)
      @request = ActionDispatch::Request.new(env)
      protector = ::SessionProtector::Base.new(@request, @options)
      if protector.safe_request?
        @app.call(env)
      else
        @request.reset_session
        [302, {"Location" => "/"}, []]
      end
    end

  end
end