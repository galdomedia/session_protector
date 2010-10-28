session_protector
=================

* http://github.com/groovyruby/session_protector

DESCRIPTION
-----------

Logout user if HTTP_USER_AGENT and IP differs from the one saved in session. This make it harder to successfully use session hijacking tools like [firesheep](http://codebutler.com/firesheep).

Also, usage of `browser_fingerprint.js` allows usage of pseudo-unique fingerprint of users browser details. Both combined makes much harder (a least for script kiddies using firesheep for evil purposes) to hijack session (yeah, right).

REQUIREMENTS
------------

**Devise** or other authentication system based on **Warden**

INSTALL
-------

`rails plugin install git://github.com/groovyruby/session_protector.git`

You MAY also want to install browser_fingerprint script. To do this simply run:

`rails generate session_protector:install`

And reference to browser_fingerprint.js script in HEAD section or your layout. Ie:

`<%= javascript_include_tag 'browser_fingerprint', :cache => true %>`
 
`browser_fingerprint.js` is _not yet_ JavaScript framework agnostic. It _REQUIRES jQuery_ now.

CONFIGURATION
-------------

You may want to _disable_ IP checking. To do this simply paste following code in `config/initializers/session_protector.rb`

    SessionProtector.setup do |config|
      # don't check IP address
      config.check_ip = false
    end


HOW IT WORKS
------------

* middleware checks, if USER_AGENT didn't change. This should scare of most part of script kiddies using firesheep
* javascript part checks for browsers USER_AGENT, installed plugins, screen resolution, timezone, browser capabilities and makes md5 hash from string containing all those informations. hash is stored in cookie, then, if not empty, it's assigned to session. If on next page load (script have to be executed at least once, somehow) hash strings on server side (session) and client are different, session is destroyed.

It's not the best nor ultimate solution, but as long as you can not send cookies via SSL, nothing can assure you, that session will not be hijacked - bas guys can still gather users cookies, sniff for user_agent, use browser spoofing tools, etc. 


AUTHORS
-------

*  Piotr Boniecki (piotr [at] galdomedia [dot] pl)
*  Maciej Litwiniuk (maciej [at] galdomedia [dot] pl )


CREDITS
-------

*  [Electronic Frontier Foundation](https://panopticlick.eff.org/) - Panopticlick - Browser uniqueness (fingerprint) detection
*  [Eric Gerds](http://www.pinlady.net/PluginDetect/) - PluginDetect
*  [Kevin van Zonneveld](http://phpjs.org/functions/md5:469) - JavaScript MD5


Copyright (c) 2010 Piotr Boniecki (piotr [at] galdomedia [dot] pl), released under the MIT license