# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'session_protector/version'

Gem::Specification.new do |gem|
  gem.name          = "session_protector"
  gem.version       = SessionProtector::VERSION
  gem.authors         = ["Piotr Boniecki", "GaldoMedia"]
  gem.email         = ["piotr@galdomedia.pl"]
  gem.description   = %q{Small middleware, that helps a little bit to protect user session from session hijacking (by checking browsers user_agent)}
  gem.summary       = %q{Small middleware, that helps a little bit to protect user session from session hijacking (by checking browsers user_agent)}
  gem.homepage      = "https://github.com/galdomedia/session_protector"
  gem.license       = "MIT"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}) { |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]

  gem.add_dependency "rails"

  gem.add_development_dependency "rake"
  gem.add_development_dependency "rspec"
end
