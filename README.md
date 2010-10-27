session_protector
=================

* http://github.com/groovyruby/session_protector

DESCRIPTION
-----------

Logout user if HTTP_USER_AGENT and IP differs from the one saved in session. This make it harder to successfully use session hijacking tools like [firesheep](http://codebutler.com/firesheep).

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
 
browser_fingerprint.js is not yet JavaScript framework agnostic. It _REQUIRES jQuery_ now.


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