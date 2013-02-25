module SessionProtector
  class Error < StandardError

  end

  class Base
    CHECK_METHODS = %w(cookie env_vars)

    attr_accessor :cookies, :session, :options, :request

    def initialize(request, options)
      @request = request
      @session = @request.session
      @cookies = @request.cookies
      @options = options
    end

    def safe_request?
      CHECK_METHODS.each do |method|
        self.send("check_#{method}")
      end

      CHECK_METHODS.each do |method|
        self.send("set_#{method}")
      end

      true
    rescue ::SessionProtector::Error => e
      false
    end

    private

    def cookie_required_string
      @cookie_required_string ||= cookies['_browser_fingerprint']
    end

    def set_cookie
      session['browser_fingerprint'] ||= cookie_required_string if cookie_required_string.present?
    end

    def check_cookie
      return if session['browser_fingerprint'].nil?
      raise ::SessionProtector::Error, "Wrong browser_fingerprint: #{cookie_required_string} != #{session['browser_fingerprint']}" if cookie_required_string == session['browser_fingerprint']
    end

    def env_vars_required_string
      @env_vars_required_string ||= "#{request.env['HTTP_USER_AGENT']}-#{options[:check_ip] ? request.remote_ip : ''}"
    end

    def set_env_vars
      session['user_agent_with_ip'] ||= env_vars_required_string if env_vars_required_string
    end

    def check_env_vars
      return if session['user_agent_with_ip'].nil?
      raise ::SessionProtector::Error, "Wrong user_agent_with_ip: #{env_vars_required_string} != #{session['user_agent_with_ip']}" if env_vars_required_string != session['user_agent_with_ip']
    end

  end
end