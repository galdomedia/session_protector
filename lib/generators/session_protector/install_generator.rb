module SessionProtector
  class InstallGenerator < Rails::Generators::Base

    FILES = [
      'browser_fingerprint.js'
    ]

    desc "Copy session_protector files to public/javascript folder."

    source_root File.expand_path('../templates', __FILE__)

    def install_session_protector
      src_prefix = File.join('javascripts')
      dest_prefix = File.join('public', 'javascripts')

      FILES.each do |path|
        src = File.join(src_prefix, path)
        dest = File.join(dest_prefix, path)

        copy_file(src, dest) if path =~ /\./
      end

    end

  end

end