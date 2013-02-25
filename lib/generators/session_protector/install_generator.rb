module SessionProtector
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path("../../../../app/assets/javascripts", __FILE__)

    def copy_browser_fingerprint
      copy_file "browser_fingerprint.js", "app/assets/javascripts/browser_fingerprint.js"
    end
  end
end
