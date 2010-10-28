module SessionProtector
  class Base
    CHECK_METHODS = %w(cookie env_vars)
    
    attr_accessor :warden, :scope, :session
    
    def initialize(warden, scope)
      @warden = warden
      @scope = scope
      @session = warden.session(scope)
    end
    
    def protect
      CHECK_METHODS.each do |method|
        self.send("set_#{method}")
      end
      
      CHECK_METHODS.inject(false) do |logged_out, method|
        logged_out || self.send("check_#{method}")
      end
    end
    
    def cookie_required_string
      return @cookie_required_string if @cookie_required_string
      cookies = warden.request.cookies
      if cookies and cookies.keys.member?('_browser_fingerprint')
        @cookie_required_string = cookies['_browser_fingerprint']
      end
      @cookie_required_string
    end
    
    def set_cookie
      session['browser_fingerprint'] ||= cookie_required_string if cookie_required_string.present?
    end
    
    def check_cookie
      if cookie_required_string != session['browser_fingerprint']
        warden.logout(scope)
        return true
      end
    end
    
    def env_vars_required_string
      return @env_vars_required_string if @env_vars_required_string
      if !warden.env['HTTP_USER_AGENT'].nil?
        @env_vars_required_string = "#{warden.env['HTTP_USER_AGENT']}-#{SessionProtector.check_ip ? warden.request.remote_ip : ''}"
      end
      @env_vars_required_string
    end
    
    def set_env_vars
      session['user_agent_with_ip'] ||= env_vars_required_string if env_vars_required_string
    end
    
    def check_env_vars
      if env_vars_required_string
        if env_vars_required_string != session['user_agent_with_ip']
          warden.logout(scope)
          return true
        end
      end
    end
  end
end