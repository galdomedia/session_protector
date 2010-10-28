Warden::Manager.after_set_user do |record, warden, options|
  protector = SessionProtector::Base.new(warden, options[:scope])  
  protector.protect
end