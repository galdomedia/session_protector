$(document).ready(function(){
  $('body').append('<div id="oPersistDiv" style="display: none;"></div>');
  createCookie('_browser_fingerprint', md5(fetch_client_whorls()),null);
});

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
};


/*
    Taken from https://panopticlick.eff.org/
 */
function identify_plugins(){
  // fetch and serialize plugins
  var plugins = "";
  // in Mozilla and in fact most non-IE browsers, this is easy
  if (navigator.plugins) {
    var np = navigator.plugins;
    var plist = new Array();
    // sorting navigator.plugins is a right royal pain
    // but it seems to be necessary because their order
    // is non-constant in some browsers
    for (var i = 0; i < np.length; i++) {
      plist[i] = np[i].name + "; ";
      plist[i] += np[i].description + "; ";
      plist[i] += np[i].filename + ";";
      for (var n = 0; n < np[i].length; n++) {
        plist[i] += " (" + np[i][n].description +"; "+ np[i][n].type +
                   "; "+ np[i][n].suffixes + ")";
      }
      plist[i] += ". ";
    }
    plist.sort();
    for (i = 0; i < np.length; i++)
      plugins+= "Plugin "+i+": " + plist[i];
  }
  // in IE, things are much harder; we use PluginDetect to get less
  // information (only the plugins listed below & their version numbers)
  if (plugins == "") {
    var pp = new Array();
    pp[0] = "Java"; pp[1] = "QuickTime"; pp[2] = "DevalVR"; pp[3] = "Shockwave";
    pp[4] = "Flash"; pp[5] = "WindowsMediaplayer"; pp[6] = "Silverlight";
    pp[7] = "VLC";
    var version;
    for ( p in pp ) {
      version = PluginDetect.getVersion(pp[p]);
      if (version)
        plugins += pp[p] + " " + version + "; "
    }
    plugins += ieAcrobatVersion();
  }
  return plugins;
}

function ieAcrobatVersion() {
  // estimate the version of Acrobat on IE using horrible horrible hacks
  if (window.ActiveXObject) {
    for (var x = 2; x < 10; x++) {
      try {
        oAcro=eval("new ActiveXObject('PDF.PdfCtrl."+x+"');");
        if (oAcro)
          return "Adobe Acrobat version" + x + ".?";
      } catch(ex) {}
    }
    try {
      oAcro4=new ActiveXObject('PDF.PdfCtrl.1');
      if (oAcro4)
        return "Adobe Acrobat version 4.?";
    } catch(ex) {}
    try {
      oAcro7=new ActiveXObject('AcroPDF.PDF.1');
      if (oAcro7)
        return "Adobe Acrobat version 7.?";
    } catch (ex) {}
    return "";
  }
}

function set_dom_storage(){
  try {
    localStorage.panopticlick = "yea";
    sessionStorage.panopticlick = "yea";
  } catch (ex) { }
}

function test_dom_storage(){
  var supported = "";
  try {
    if (localStorage.panopticlick == "yea") {
       supported += "DOM localStorage: Yes";
    } else {
       supported += "DOM localStorage: No";
    }
  } catch (ex) { supported += "DOM localStorage: No"; }

  try {
    if (sessionStorage.panopticlick == "yea") {
       supported += ", DOM sessionStorage: Yes";
    } else {
       supported += ", DOM sessionStorage: No";
    }
  } catch (ex) { supported += ", DOM sessionStorage: No"; }

  return supported;
}

function test_ie_userdata(){
  try {
    oPersistDiv.setAttribute("remember", "remember this value");
    oPersistDiv.save("oXMLStore");
    oPersistDiv.setAttribute("remember", "overwritten!");
    oPersistDiv.load("oXMLStore");
    if ("remember this value" == (oPersistDiv.getAttribute("remember"))) {
      return ", IE userData: Yes";
    } else {
      return ", IE userData: No";
    }
  } catch (ex) {
      return ", IE userData: No";
  }
}

function fetch_client_whorls(){
  // fetch client-side vars
  var whorls = "";

  try {
    whorls += 'plugins:' + identify_plugins();
  } catch(ex) {
    whorls += 'plugins:' + "permission denied";
  }

  try {
    whorls += 'timezone:' + new String(new Date().getTimezoneOffset());
  } catch(ex) {
    whorls += 'timezone:' + "permission denied";
  }

  try {
    whorls += 'video:' + screen.width+"x"+screen.height+"x"+screen.colorDepth;
  } catch(ex) {
    whorls += 'video:' + "permission denied";
  }

  whorls += 'supercookies:' +  test_dom_storage() + test_ie_userdata();
  return whorls;
};

/* PluginDetect v0.6.3 [ onWindowLoaded getVersion Java(OTF&getInfo) QT DevalVR Shockwave Flash WMP Silverlight VLC ] by Eric Gerds www.pinlady.net/PluginDetect */ if(!PluginDetect){var PluginDetect={getNum:function(b,c){if(!this.num(b)){return null
}var a;
if(typeof c=="undefined"){a=/[\d][\d\.\_,-]*/.exec(b)
}else{a=(new RegExp(c)).exec(b)
}return a?a[0].replace(/[\.\_-]/g,","):null
},hasMimeType:function(c){if(PluginDetect.isIE){return null
}var b,a,d,e=c.constructor==String?[c]:c;
for(d=0;
d<e.length;
d++){b=navigator.mimeTypes[e[d]];
if(b&&b.enabledPlugin){a=b.enabledPlugin;
if(a.name||a.description){return b
}}}return null
},findNavPlugin:function(g,d){var a=g.constructor==String?g:g.join(".*"),e=d===false?"":"\\d",b,c=new RegExp(a+".*"+e+"|"+e+".*"+a,"i"),f=navigator.plugins;
for(b=0;
b<f.length;
b++){if(c.test(f[b].description)||c.test(f[b].name)){return f[b]
}}return null
},AXO:window.ActiveXObject,getAXO:function(b,a){var f=null,d,c=false;
try{f=new this.AXO(b);
c=true
}catch(d){}if(typeof a!="undefined"){delete f;
return c
}return f
},num:function(a){return(typeof a!="string"?false:(/\d/).test(a))
},compareNums:function(g,e){var d=this,c,b,a,f=window.parseInt;
if(!d.num(g)||!d.num(e)){return 0
}if(d.plugin&&d.plugin.compareNums){return d.plugin.compareNums(g,e)
}c=g.split(",");
b=e.split(",");
for(a=0;
a<Math.min(c.length,b.length);
a++){if(f(c[a],10)>f(b[a],10)){return 1
}if(f(c[a],10)<f(b[a],10)){return -1
}}return 0
},formatNum:function(b){if(!this.num(b)){return null
}var a,c=b.replace(/\s/g,"").replace(/[\.\_]/g,",").split(",").concat(["0","0","0","0"]);
for(a=0;
a<4;
a++){if(/^(0+)(.+)$/.test(c[a])){c[a]=RegExp.$2
}}if(!(/\d/).test(c[0])){c[0]="0"
}return c[0]+","+c[1]+","+c[2]+","+c[3]
},initScript:function(){var $=this,userAgent=navigator.userAgent;
$.isIE=
/*@cc_on!@*/
false;
$.IEver=$.isIE&&((/MSIE\s*(\d\.?\d*)/i).exec(userAgent))?parseFloat(RegExp.$1,10):-1;
$.ActiveXEnabled=false;
if($.isIE){var x,progid=["Msxml2.XMLHTTP","Msxml2.DOMDocument","Microsoft.XMLDOM","ShockwaveFlash.ShockwaveFlash","TDCCtl.TDCCtl","Shell.UIHelper","Scripting.Dictionary","wmplayer.ocx"];
for(x=0;
x<progid.length;
x++){if($.getAXO(progid[x],1)){$.ActiveXEnabled=true;
break
}}$.head=typeof document.getElementsByTagName!="undefined"?document.getElementsByTagName("head")[0]:null
}$.isGecko=!$.isIE&&typeof navigator.product=="string"&&(/Gecko/i).test(navigator.product)&&(/Gecko\s*\/\s*\d/i).test(userAgent)?true:false;
$.GeckoRV=$.isGecko?$.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent)?RegExp.$1:"0.9"):null;
$.isSafari=!$.isIE&&(/Safari\s*\/\s*\d/i).test(userAgent)?true:false;
$.isChrome=(/Chrome\s*\/\s*\d/i).test(userAgent)?true:false;
$.onWindowLoaded(0)
},init:function(c,a){if(typeof c!="string"){return -3
}c=c.toLowerCase().replace(/\s/g,"");
var b=this,d;
if(typeof b[c]=="undefined"){return -3
}d=b[c];
b.plugin=d;
if(typeof d.installed=="undefined"||a==true){d.installed=null;
d.version=null;
d.version0=null;
d.getVersionDone=null;
d.$=b
}b.garbage=false;
if(b.isIE&&!b.ActiveXEnabled){if(b.plugin!=b.java){return -2
}}return 1
},isMinVersion:function(g,e,c,b){
return -3
},getVersion:function(e,b,a){
var d=PluginDetect,c=d.init(e),f;
if(c<0){return null
}f=d.plugin;
if(f.getVersionDone!=1){f.getVersion(b,a);
if(f.getVersionDone===null){f.getVersionDone=1
}}d.cleanup();
return(f.version||f.version0);
;
return null
},getInfo:function(f,c,b){var a={};
;
var e=PluginDetect,d=e.init(f),g;
if(d<0){return a
}g=e.plugin;
if(typeof g.getInfo!="undefined"){if(g.getVersionDone===null){e.getVersion(f,c,b)
}a=g.getInfo()
};
return a
},cleanup:function(){
var a=this;
if(a.garbage&&typeof window.CollectGarbage!="undefined"){window.CollectGarbage()
}
},isActiveXObject:function(b){
var d=this,a,g,f="/",c='<object width="1" height="1" style="display:none" '+d.plugin.getCodeBaseVersion(b)+">"+d.plugin.HTML+"<"+f+"object>";
if(d.head.firstChild){d.head.insertBefore(document.createElement("object"),d.head.firstChild)
}else{d.head.appendChild(document.createElement("object"))
}d.head.firstChild.outerHTML=c;
try{d.head.firstChild.classid=d.plugin.classID
}catch(g){}a=false;
try{if(d.head.firstChild.object){a=true
}}catch(g){}try{if(a&&d.head.firstChild.readyState<4){d.garbage=true
}}catch(g){}d.head.removeChild(d.head.firstChild);
return a;

},codebaseSearch:function(c){var e=this;
if(!e.ActiveXEnabled){return null
}if(typeof c!="undefined"){return e.isActiveXObject(c)
};
var j=[0,0,0,0],g,f,b=e.plugin.digits,i=function(k,m){var l=(k==0?m:j[0])+","+(k==1?m:j[1])+","+(k==2?m:j[2])+","+(k==3?m:j[3]);
return e.isActiveXObject(l)
};
var h,d,a=false;
for(g=0;
g<b.length;
g++){h=b[g]*2;
j[g]=0;
for(f=0;
f<20;
f++){if(h==1&&g>0&&a){break
}if(h-j[g]>1){d=Math.round((h+j[g])/2);
if(i(g,d)){j[g]=d;
a=true
}else{h=d
}}else{if(h-j[g]==1){h--;
if(!a&&i(g,h)){a=true
}break
}else{if(!a&&i(g,h)){a=true
}break
}}}if(!a){return null
}}return j.join(",");

},dummy1:0}
}PluginDetect.onDetectionDone=function(g,e,d,a){
return -1
};
PluginDetect.onWindowLoaded=function(c){
var b=PluginDetect,a=window;
if(b.EventWinLoad===true){}else{b.winLoaded=false;
b.EventWinLoad=true;
if(typeof a.addEventListener!="undefined"){a.addEventListener("load",b.runFuncs,false)
}else{if(typeof a.attachEvent!="undefined"){a.attachEvent("onload",b.runFuncs)
}else{if(typeof a.onload=="function"){b.funcs[b.funcs.length]=a.onload
}a.onload=b.runFuncs
}}}if(typeof c=="function"){b.funcs[b.funcs.length]=c
}
};
;
PluginDetect.funcs=[0];
PluginDetect.runFuncs=function(){var b=PluginDetect,a;
b.winLoaded=true;
for(a=0;
a<b.funcs.length;
a++){if(typeof b.funcs[a]=="function"){b.funcs[a](b);
b.funcs[a]=null
}}};
;
PluginDetect.quicktime={mimeType:["video/quicktime","application/x-quicktimeplayer","image/x-macpaint","image/x-quicktime"],progID:"QuickTimeCheckObject.QuickTimeCheck.1",progID0:"QuickTime.QuickTime",classID:"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",minIEver:7,HTML:'<param name="src" value="A14999.mov" /><param name="controller" value="false" />',getCodeBaseVersion:function(a){return'codebase="#version='+a+'"'
},digits:[8,64,16,0],clipTo3digits:function(f){if(f===null||typeof f=="undefined"){return null
}var e,d,h,g=this.$;
e=f.split(",");
if(g.compareNums(f,"7,60,0,0")<0&&g.compareNums(f,"7,50,0,0")>=0){d=e[0]+","+e[1].charAt(0)+","+e[1].charAt(1)+","+e[2]
}else{d=e[0]+","+e[1]+","+e[2]+","+e[3]
}h=d.split(",");
return h[0]+","+h[1]+","+h[2]+",0"
},getVersion:function(){var a=null,d,b=this.$,e=true;
if(!b.isIE){if(navigator.platform&&(/linux/i).test(navigator.platform)){e=false
}if(e){d=b.findNavPlugin(["QuickTime","(Plug-in|Plugin)"]);
if(d&&d.name&&b.hasMimeType(this.mimeType)){a=b.getNum(d.name)
}}this.installed=a?1:-1
}else{var c;
if(b.IEver>=this.minIEver&&b.getAXO(this.progID0,1)){a=b.codebaseSearch()
}else{c=b.getAXO(this.progID);
if(c&&c.QuickTimeVersion){a=c.QuickTimeVersion.toString(16);
a=a.charAt(0)+"."+a.charAt(1)+"."+a.charAt(2)
}}this.installed=a?1:(b.getAXO(this.progID0,1)?0:-1)
}this.version=this.clipTo3digits(b.formatNum(a))
}};
;
PluginDetect.java={mimeType:"application/x-java-applet",classID:"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",DTKclassID:"clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA",DTKmimeType:"application/npruntime-scriptable-plugin;DeploymentToolkit",JavaVersions:[[1,9,2,25],[1,8,2,25],[1,7,2,25],[1,6,2,25],[1,5,2,25],[1,4,2,25],[1,3,1,25]],searchJavaPluginAXO:function(){var h=null,a=this,c=a.$,g=[],j=[1,5,0,14],i=[1,6,0,2],f=[1,3,1,0],e=[1,4,2,0],d=[1,5,0,7],b=false;
if(!c.ActiveXEnabled){return null
};
b=true;
;
if(c.IEver>=a.minIEver){g=a.searchJavaAXO(i,i,b);
if(g.length>0&&b){g=a.searchJavaAXO(j,j,b)
}}else{
if(b){g=a.searchJavaAXO(d,d,true)
};
if(g.length==0){g=a.searchJavaAXO(f,e,false)
}}if(g.length>0){h=g[0]
}a.JavaPlugin_versions=[].concat(g);
return h
},searchJavaAXO:function(l,i,m){var n,f,h=this.$,p,k,a,e,g,j,b,q=[];
if(h.compareNums(l.join(","),i.join(","))>0){i=l
}i=h.formatNum(i.join(","));
var o,d="1,4,2,0",c="JavaPlugin."+l[0]+""+l[1]+""+l[2]+""+(l[3]>0?("_"+(l[3]<10?"0":"")+l[3]):"");
for(n=0;
n<this.JavaVersions.length;
n++){f=this.JavaVersions[n];
p="JavaPlugin."+f[0]+""+f[1];
g=f[0]+"."+f[1]+".";
for(a=f[2];
a>=0;
a--){b="JavaWebStart.isInstalled."+g+a+".0";
if(h.compareNums(f[0]+","+f[1]+","+a+",0",i)>=0&&!h.getAXO(b,1)){continue
}o=h.compareNums(f[0]+","+f[1]+","+a+",0",d)<0?true:false;
for(e=f[3];
e>=0;
e--){k=a+"_"+(e<10?"0"+e:e);
j=p+k;
if(h.getAXO(j,1)&&(o||h.getAXO(b,1))){q[q.length]=g+k;
if(!m){return q
}}if(j==c){return q
}}if(h.getAXO(p+a,1)&&(o||h.getAXO(b,1))){q[q.length]=g+a;
if(!m){return q
}}if(p+a==c){return q
}}}return q
},minIEver:7,getFromMimeType:function(a){var h,f,c=this.$,j=new RegExp(a),d,k,i={},e=0,b,g=[""];
for(h=0;
h<navigator.mimeTypes.length;
h++){k=navigator.mimeTypes[h];
if(j.test(k.type)&&k.enabledPlugin){k=k.type.substring(k.type.indexOf("=")+1,k.type.length);
d="a"+c.formatNum(k);
if(typeof i[d]=="undefined"){i[d]=k;
e++
}}}for(f=0;
f<e;
f++){b="0,0,0,0";
for(h in i){if(i[h]){d=h.substring(1,h.length);
if(c.compareNums(d,b)>0){b=d
}}}g[f]=i["a"+b];
i["a"+b]=null
}if(!(/windows|macintosh/i).test(navigator.userAgent)){g=[g[0]]
}return g
},queryJavaHandler:function(){var b=PluginDetect.java,a=window.java,c;
b.hasRun=true;
try{if(typeof a.lang!="undefined"&&typeof a.lang.System!="undefined"){b.value=[a.lang.System.getProperty("java.version")+" ",a.lang.System.getProperty("java.vendor")+" "]
}}catch(c){}},queryJava:function(){var c=this,d=c.$,b=navigator.userAgent,f;
if(typeof window.java!="undefined"&&navigator.javaEnabled()&&!c.hasRun){if(d.isGecko){if(d.hasMimeType("application/x-java-vm")){try{var g=document.createElement("div"),a=document.createEvent("HTMLEvents");
a.initEvent("focus",false,true);
g.addEventListener("focus",c.queryJavaHandler,false);
g.dispatchEvent(a)
}catch(f){}if(!c.hasRun){c.queryJavaHandler()
}}}else{if((/opera.9\.(0|1)/i).test(b)&&(/mac/i).test(b)){}else{if(!c.hasRun){c.queryJavaHandler()
}}}}return c.value
},forceVerifyTag:[],jar:[],VENDORS:["Sun Microsystems Inc.","Apple Computer, Inc."],init:function(){var a=this,b=a.$;
if(typeof a.app!="undefined"){a.delJavaApplets(b)
}a.hasRun=false;
a.value=[null,null];
a.useTag=[2,2,2];
a.app=[0,0,0,0,0,0];
a.appi=3;
a.queryDTKresult=null;
a.OTF=0;
a.BridgeResult=[[null,null],[null,null],[null,null]];
a.JavaActive=[0,0,0];
a.All_versions=[];
a.DeployTK_versions=[];
a.MimeType_versions=[];
a.JavaPlugin_versions=[];
a.funcs=[];
var c=a.NOTF;
if(c){c.$=b;
if(c.javaInterval){clearInterval(c.javaInterval)
}c.EventJavaReady=null;
c.javaInterval=null;
c.count=0;
c.intervalLength=250;
c.countMax=40
}a.lateDetection=b.winLoaded;
if(!a.lateDetection){b.onWindowLoaded(a.delJavaApplets)
}},getVersion:function(f,l){var h,d=this,g=d.$,j=null,n=null,e=null,c=navigator.javaEnabled();
if(d.getVersionDone===null){d.init()
}var k;
if(typeof l!="undefined"&&l.constructor==Array){for(k=0;
k<d.useTag.length;
k++){if(typeof l[k]=="number"){d.useTag[k]=l[k]
}}}for(k=0;
k<d.forceVerifyTag.length;
k++){d.useTag[k]=d.forceVerifyTag[k]
}if(typeof f!="undefined"){d.jar[d.jar.length]=f
}if(d.getVersionDone==0){if(!d.version||d.useAnyTag()){h=d.queryExternalApplet(f);
if(h[0]){e=h[0];
n=h[1]
}}d.EndGetVersion(e,n);
return
}var i=d.queryDeploymentToolKit();
if(typeof i=="string"&&i.length>0){j=i;
n=d.VENDORS[0]
}if(!g.isIE){var q,m,b,o,a;
a=g.hasMimeType(d.mimeType);
o=(a&&c)?true:false;
if(d.MimeType_versions.length==0&&a){h=d.getFromMimeType("application/x-java-applet.*jpi-version.*=");
if(h[0]!=""){if(!j){j=h[0]
}d.MimeType_versions=h
}}if(!j&&a){h="Java[^\\d]*Plug-in";
b=g.findNavPlugin(h);
if(b){h=new RegExp(h,"i");
q=h.test(b.description)?g.getNum(b.description):null;
m=h.test(b.name)?g.getNum(b.name):null;
if(q&&m){j=(g.compareNums(g.formatNum(q),g.formatNum(m))>=0)?q:m
}else{j=q||m
}}}if(!j&&a&&(/macintosh.*safari/i).test(navigator.userAgent)){b=g.findNavPlugin("Java.*\\d.*Plug-in.*Cocoa",false);
if(b){q=g.getNum(b.description);
if(q){j=q
}}}if(j){d.version0=j;
if(c){e=j
}}if(!e||d.useAnyTag()){b=d.queryExternalApplet(f);
if(b[0]){e=b[0];
n=b[1]
}}if(!e){b=d.queryJava();
if(b[0]){d.version0=b[0];
e=b[0];
n=b[1];
if(d.installed==-0.5){d.installed=0.5
}}}if(d.installed===null&&!e&&o&&!(/macintosh.*ppc/i).test(navigator.userAgent)){h=d.getFromMimeType("application/x-java-applet.*version.*=");
if(h[0]!=""){e=h[0]
}}if(!e&&o){if(/macintosh.*safari/i.test(navigator.userAgent)){if(d.installed===null){d.installed=0
}else{if(d.installed==-0.5){d.installed=0.5
}}}}}else{if(!j&&i!=-1){j=d.searchJavaPluginAXO();
if(j){n=d.VENDORS[0]
}}if(!j){d.JavaFix()
}if(j){d.version0=j;
if(c&&g.ActiveXEnabled){e=j
}}if(!e||d.useAnyTag()){h=d.queryExternalApplet(f);
if(h[0]){e=h[0];
n=h[1]
}}}if(d.installed===null){d.installed=e?1:(j?-0.2:-1)
}d.EndGetVersion(e,n)
},EndGetVersion:function(b,d){var a=this,c=a.$;
if(a.version0){a.version0=c.formatNum(c.getNum(a.version0))
}if(b){a.version=c.formatNum(c.getNum(b));
a.vendor=(typeof d=="string"?d:"")
}if(a.getVersionDone!=1){a.getVersionDone=0
}},queryDeploymentToolKit:function(){var d=this,g=d.$,i,b,h=null,a=null;
if((g.isGecko&&g.compareNums(g.GeckoRV,g.formatNum("1.6"))<=0)||g.isSafari||(g.isIE&&!g.ActiveXEnabled)){d.queryDTKresult=0
}if(d.queryDTKresult!==null){return d.queryDTKresult
}if(g.isIE&&g.IEver>=6){d.app[0]=g.instantiate("object",[],[]);
h=g.getObject(d.app[0])
}else{if(!g.isIE&&g.hasMimeType(d.DTKmimeType)){d.app[0]=g.instantiate("object",["type",d.DTKmimeType],[]);
h=g.getObject(d.app[0])
}}if(h){if(g.isIE&&g.IEver>=6){try{h.classid=d.DTKclassID
}catch(i){}}try{var c,f=h.jvms;
if(f){a=f.getLength();
if(typeof a=="number"){for(b=0;
b<a;
b++){c=f.get(a-1-b);
if(c){c=c.version;
if(g.getNum(c)){d.DeployTK_versions[b]=c
}}}}}}catch(i){}}g.hideObject(h);
d.queryDTKresult=d.DeployTK_versions.length>0?d.DeployTK_versions[0]:(a==0?-1:0);
return d.queryDTKresult
},queryExternalApplet:function(d){var c=this,e=c.$,h=c.BridgeResult,b=c.app,g=c.appi,a="&nbsp;&nbsp;&nbsp;&nbsp;";
if(typeof d!="string"||!(/\.jar\s*$/).test(d)){return[null,null]
}if(c.OTF<1){c.OTF=1
}if(!e.isIE){if((e.isGecko||e.isChrome)&&!e.hasMimeType(c.mimeType)&&!c.queryJava()[0]){return[null,null]
}}if(c.OTF<2){c.OTF=2
}if(!b[g]&&c.canUseObjectTag()&&c.canUseThisTag(0)){b[1]=e.instantiate("object",[],[],a);
b[g]=e.isIE?e.instantiate("object",["archive",d,"code","A.class","type",c.mimeType],["archive",d,"code","A.class","mayscript","true","scriptable","true"],a):e.instantiate("object",["archive",d,"classid","java:A.class","type",c.mimeType],["archive",d,"mayscript","true","scriptable","true"],a);
h[0]=[0,0];
c.query1Applet(g)
}if(!b[g+1]&&c.canUseAppletTag()&&c.canUseThisTag(1)){b[g+1]=e.instantiate("applet",["archive",d,"code","A.class","alt",a,"mayscript","true"],["mayscript","true"],a);
h[1]=[0,0];
c.query1Applet(g+1)
}if(e.isIE&&!b[g+2]&&c.canUseObjectTag()&&c.canUseThisTag(2)){b[g+2]=e.instantiate("object",["classid",c.classID],["archive",d,"code","A.class","mayscript","true","scriptable","true"],a);
h[2]=[0,0];
c.query1Applet(g+2)
};
var j,f=0;
for(j=0;
j<h.length;
j++){if(b[g+j]||c.canUseThisTag(j)){f++
}else{break
}}if(f==h.length){c.getVersionDone=1;
if(c.forceVerifyTag.length>0){c.getVersionDone=0
}}return c.getBR()
},canUseAppletTag:function(){return((!this.$.isIE||navigator.javaEnabled())?true:false)
},canUseObjectTag:function(){return((!this.$.isIE||this.$.ActiveXEnabled)?true:false)
},useAnyTag:function(){var b=this,a;
for(a=0;
a<b.useTag.length;
a++){if(b.canUseThisTag(a)){return true
}}return false
},canUseThisTag:function(c){var a=this,b=a.$;
if(a.useTag[c]==3){return true
}if(!a.version0||!navigator.javaEnabled()||(b.isIE&&!b.ActiveXEnabled)){if(a.useTag[c]==2){return true
}if(a.useTag[c]==1&&!a.getBR()[0]){return true
}}return false
},getBR:function(){var b=this.BridgeResult,a;
for(a=0;
a<b.length;
a++){if(b[a][0]){return[b[a][0],b[a][1]]
}}return[b[0][0],b[0][1]]
},delJavaApplets:function(b){var c=b.java.app,a;
for(a=c.length-1;
a>=0;
a--){b.uninstantiate(c[a])
}},query1Applet:function(g){var f,c=this,d=c.$,a=null,h=null,b=d.getObject(c.app[g],true);
try{if(b){a=b.getVersion()+" ";
h=b.getVendor()+" ";
if(d.num(a)){c.BridgeResult[g-c.appi]=[a,h];
d.hideObject(c.app[g])
}if(d.isIE&&a&&b.readyState!=4){d.garbage=true;
d.uninstantiate(c.app[g])
}}}catch(f){}},NOTF:{isJavaActive:function(){
}},append:function(e,d){for(var c=0;
c<d.length;
c++){e[e.length]=d[c]
}},getInfo:function(){var m={};
;
var a=this,d=a.$,h,l=a.installed;
m={All_versions:[],DeployTK_versions:[],MimeType_versions:[],DeploymentToolkitPlugin:(a.queryDTKresult==0?false:true),vendor:(typeof a.vendor=="string"?a.vendor:""),OTF:(a.OTF<3?0:(a.OTF==3?1:2))};
var g=[null,null,null];
for(h=0;
h<a.BridgeResult.length;
h++){g[h]=a.BridgeResult[h][0]?1:(a.JavaActive[h]==1?0:(a.useTag[h]>=1&&a.OTF>=1&&a.OTF!=3&&!(h==2&&!d.isIE)&&(a.BridgeResult[h][0]!==null||(h==1&&!a.canUseAppletTag())||(h!=1&&!a.canUseObjectTag())||l==-0.2||l==-1)?-1:null))
}m.objectTag=g[0];
m.appletTag=g[1];
m.objectTagActiveX=g[2];
var c=m.All_versions,k=m.DeployTK_versions,f=m.MimeType_versions,b=a.JavaPlugin_versions;
a.append(k,a.DeployTK_versions);
a.append(f,a.MimeType_versions);
a.append(c,(k.length>0?k:(f.length>0?f:(b.length>0?b:(typeof a.version=="string"?[a.version]:[])))));
for(h=0;
h<c.length;
h++){c[h]=d.formatNum(d.getNum(c[h]))
}var i,e=null;
if(!d.isIE){i=f.length>0?d.hasMimeType(a.mimeType+";jpi-version="+f[0]):d.hasMimeType(a.mimeType);
if(i){e=i.enabledPlugin
}}m.name=e?e.name:"";
m.description=e?e.description:"";
var j=null;
if((l==0||l==1)&&m.vendor==""){if(/macintosh/i.test(navigator.userAgent)){j=a.VENDORS[1]
}else{if(!d.isIE&&(/windows/i).test(navigator.userAgent)){j=a.VENDORS[0]
}else{if(/linux/i.test(navigator.userAgent)){j=a.VENDORS[0]
}}}if(j){m.vendor=j
}};
return m
},JavaFix:function(){}};
;
PluginDetect.devalvr={mimeType:"application/x-devalvrx",progID:"DevalVRXCtrl.DevalVRXCtrl.1",classID:"clsid:5D2CF9D0-113A-476B-986F-288B54571614",getVersion:function(){var a=null,g,c=this.$,f;
if(!c.isIE){g=c.findNavPlugin("DevalVR");
if(g&&g.name&&c.hasMimeType(this.mimeType)){a=g.description.split(" ")[3]
}this.installed=a?1:-1
}else{var b,h,d;
h=c.getAXO(this.progID,1);
if(h){b=c.instantiate("object",["classid",this.classID],["src",""]);
d=c.getObject(b);
if(d){try{if(d.pluginversion){a="00000000"+d.pluginversion.toString(16);
a=a.substr(a.length-8,8);
a=parseInt(a.substr(0,2),16)+","+parseInt(a.substr(2,2),16)+","+parseInt(a.substr(4,2),16)+","+parseInt(a.substr(6,2),16)
}}catch(f){}}c.uninstantiate(b)
}this.installed=a?1:(h?0:-1)
}this.version=c.formatNum(a)
}};
;
PluginDetect.flash={mimeType:["application/x-shockwave-flash","application/futuresplash"],progID:"ShockwaveFlash.ShockwaveFlash",classID:"clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",getVersion:function(){var c=function(i){if(!i){return null
}var e=/[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
return e?e[0].replace(/[rRdD\.]/g,",").replace(/\s/g,""):null
};
var j,g=this.$,h,f,b=null,a=null,d=null;
if(!g.isIE){j=g.findNavPlugin("Flash");
if(j&&j.description&&g.hasMimeType(this.mimeType)){b=c(j.description)
}}else{for(f=15;
f>2;
f--){a=g.getAXO(this.progID+"."+f);
if(a){d=f.toString();
break
}}if(d=="6"){try{a.AllowScriptAccess="always"
}catch(h){return"6,0,21,0"
}}try{b=c(a.GetVariable("$version"))
}catch(h){}if(!b&&d){b=d
}}this.installed=b?1:-1;
this.version=g.formatNum(b);
return true
}};
;
PluginDetect.shockwave={mimeType:"application/x-director",progID:"SWCtl.SWCtl",classID:"clsid:166B1BCA-3F9C-11CF-8075-444553540000",getVersion:function(){var a=null,b=null,f,d,c=this.$;
if(!c.isIE){d=c.findNavPlugin("Shockwave for Director");
if(d&&d.description&&c.hasMimeType(this.mimeType)){a=c.getNum(d.description)
}}else{try{b=c.getAXO(this.progID).ShockwaveVersion("")
}catch(f){}if(typeof b=="string"&&b.length>0){a=c.getNum(b)
}else{if(c.getAXO(this.progID+".8",1)){a="8"
}else{if(c.getAXO(this.progID+".7",1)){a="7"
}else{if(c.getAXO(this.progID+".1",1)){a="6"
}}}}}this.installed=a?1:-1;
this.version=c.formatNum(a)
}};
;
PluginDetect.div=null;
PluginDetect.pluginSize=1;
PluginDetect.DOMbody=null;
PluginDetect.uninstantiate=function(a){var c,b=this;
if(!a){return
}try{if(a[0]&&a[0].firstChild){a[0].removeChild(a[0].firstChild)
}if(a[0]&&b.div){b.div.removeChild(a[0])
}if(b.div&&b.div.childNodes.length==0){b.div.parentNode.removeChild(b.div);
b.div=null;
if(b.DOMbody&&b.DOMbody.parentNode){b.DOMbody.parentNode.removeChild(b.DOMbody)
}b.DOMbody=null
}a[0]=null
}catch(c){}};
PluginDetect.getObject=function(b,a){var f,c=this,d=null;
try{if(b&&b[0]&&b[0].firstChild){d=b[0].firstChild
}}catch(f){}try{if(a&&d&&typeof d.focus!="undefined"&&typeof document.hasFocus!="undefined"&&!document.hasFocus()){d.focus()
}}catch(f){}return d
};
PluginDetect.getContainer=function(a){var c,b=null;
if(a&&a[0]){b=a[0]
}return b
};
PluginDetect.hideObject=function(a){var b=this.getObject(a);
if(b&&b.style){b.style.height="0"
}};
PluginDetect.instantiate=function(h,b,c,a){var j=function(d){var e=d.style;
if(!e){return
}e.border="0px";
e.padding="0px";
e.margin="0px";
e.fontSize=(g.pluginSize+3)+"px";
e.height=(g.pluginSize+3)+"px";
e.visibility="visible";
if(d.tagName&&d.tagName.toLowerCase()=="div"){e.width="100%";
e.display="block"
}else{if(d.tagName&&d.tagName.toLowerCase()=="span"){e.width=g.pluginSize+"px";
e.display="inline"
}}};
var k,l=document,g=this,p,i=(l.getElementsByTagName("body")[0]||l.body),o=l.createElement("span"),n,f,m="/";
if(typeof a=="undefined"){a=""
}p="<"+h+' width="'+g.pluginSize+'" height="'+g.pluginSize+'" ';
for(n=0;
n<b.length;
n=n+2){p+=b[n]+'="'+b[n+1]+'" '
}p+=">";
for(n=0;
n<c.length;
n=n+2){p+='<param name="'+c[n]+'" value="'+c[n+1]+'" />'
}p+=a+"<"+m+h+">";
if(!g.div){g.div=l.createElement("div");
f=l.getElementById("plugindetect");
if(f){j(f);
f.appendChild(g.div)
}else{if(i){try{if(i.firstChild&&typeof i.insertBefore!="undefined"){i.insertBefore(g.div,i.firstChild)
}else{i.appendChild(g.div)
}}catch(k){}}else{try{l.write('<div id="pd33993399">o<'+m+"div>");
i=(l.getElementsByTagName("body")[0]||l.body);
i.appendChild(g.div);
i.removeChild(l.getElementById("pd33993399"))
}catch(k){try{g.DOMbody=l.createElement("body");
l.getElementsByTagName("html")[0].appendChild(g.DOMbody);
g.DOMbody.appendChild(g.div)
}catch(k){}}}}j(g.div)
}if(g.div&&g.div.parentNode&&g.div.parentNode.parentNode){g.div.appendChild(o);
try{o.innerHTML=p
}catch(k){}j(o);
return[o]
}return[null]
};
;
PluginDetect.windowsmediaplayer={mimeType:["application/x-mplayer2","application/asx"],progID:"wmplayer.ocx",classID:"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",getVersion:function(){var a=null,e=this.$,b=null;
this.installed=-1;
if(!e.isIE){if(e.hasMimeType(this.mimeType)){if(e.findNavPlugin(["Windows","Media","(Plug-in|Plugin)"],false)||e.findNavPlugin(["Flip4Mac","Windows","Media"],false)){this.installed=0
}var d=e.isGecko&&e.compareNums(e.GeckoRV,e.formatNum("1.8"))<0;
if(!d&&e.findNavPlugin(["Windows","Media","Firefox Plugin"],false)){var c=e.instantiate("object",["type",this.mimeType[0]],[]),f=e.getObject(c);
if(f){a=f.versionInfo
}e.uninstantiate(c)
}}}else{b=e.getAXO(this.progID);
if(b){a=b.versionInfo
}}if(a){this.installed=1
}this.version=e.formatNum(a)
}};
;
PluginDetect.silverlight={mimeType:"application/x-silverlight",progID:"AgControl.AgControl",digits:[9,20,9,12,31],getVersion:function(){var c=this.$,j=document,g=null,b=null,f=false;
if(!c.isIE){var a=[null,null],e=c.findNavPlugin("Silverlight Plug-in",false),h=c.isGecko&&c.compareNums(c.GeckoRV,c.formatNum("1.6"))<=0;
if(e&&c.hasMimeType(this.mimeType)){g=c.formatNum(e.description);
if(g){p=g.split(",");
if(parseInt(p[2],10)>=30226&&parseInt(p[0],10)<2){p[0]="2"
}g=p.join(",")
}if(c.isGecko&&!h){f=true
}if(!f&&!h&&g){a=c.instantiate("object",["type",this.mimeType],[]);
b=c.getObject(a);
if(b){if(typeof b.IsVersionSupported!="undefined"){f=true
}if(!f){b.data="data:"+this.mimeType+",";
if(typeof b.IsVersionSupported!="undefined"){f=true
}}}c.uninstantiate(a)
}}}else{b=c.getAXO(this.progID);
var p=[1,0,1,1,1],l,k,o,i=function(d){return(d<10?"0":"")+d.toString()
},m=function(q,d,s,t,r){return(q+"."+d+"."+s+i(t)+i(r)+".0")
},n=function(d,s){var q,r=m((d==0?s:p[0]),(d==1?s:p[1]),(d==2?s:p[2]),(d==3?s:p[3]),(d==4?s:p[4]));
try{return b.IsVersionSupported(r)
}catch(q){}return false
};
if(b&&typeof b.IsVersionSupported!="undefined"){for(l=0;
l<this.digits.length;
l++){o=p[l];
for(k=o+(l==0?0:1);
k<=this.digits[l];
k++){if(n(l,k)){f=true;
p[l]=k
}else{break
}}if(!f){break
}}if(f){g=m(p[0],p[1],p[2],p[3],p[4])
}}}this.installed=f?1:-1;
this.version=c.formatNum(g)
}};
;
PluginDetect.vlc={mimeType:"application/x-vlc-plugin",progID:"VideoLAN.VLCPlugin",compareNums:function(d,c){var j=d.split(","),h=c.split(","),g,b,a,f,e,i;
for(g=0;
g<Math.min(j.length,h.length);
g++){i=/([\d]+)([a-z]?)/.test(j[g]);
b=parseInt(RegExp.$1,10);
f=(g==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
i=/([\d]+)([a-z]?)/.test(h[g]);
a=parseInt(RegExp.$1,10);
e=(g==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
if(b!=a){return(b>a?1:-1)
}if(g==2&&f!=e){return(f>e?1:-1)
}}return 0
},getVersion:function(){var b=this.$,d,a=null,c;
if(!b.isIE){if(b.hasMimeType(this.mimeType)){d=b.findNavPlugin(["VLC","(Plug-in|Plugin)"],false);
if(d&&d.description){a=b.getNum(d.description,"[\\d][\\d\\.]*[a-z]*")
}}this.installed=a?1:-1
}else{d=b.getAXO(this.progID);
if(d){try{a=b.getNum(d.VersionInfo,"[\\d][\\d\\.]*[a-z]*")
}catch(c){}}this.installed=d?1:-1
}this.version=b.formatNum(a)
}};
;
PluginDetect.initScript();

function md5 (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    };

    var addUnsigned = function (lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x,y,z) { return (x & y) | ((~x) & z); };
    var _G = function (x,y,z) { return (x & z) | (y & (~z)); };
    var _H = function (x,y,z) { return (x ^ y ^ z); };
    var _I = function (x,y,z) { return (y ^ (x | (~z))); };

    var _FF = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=new Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
        }
        return wordToHexValue;
    };

    var x=[],
        k,AA,BB,CC,DD,a,b,c,d,
        S11=7, S12=12, S13=17, S14=22,
        S21=5, S22=9 , S23=14, S24=20,
        S31=4, S32=11, S33=16, S34=23,
        S41=6, S42=10, S43=15, S44=21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    xl = x.length;
    for (k=0;k<xl;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=addUnsigned(a,AA);
        b=addUnsigned(b,BB);
        c=addUnsigned(c,CC);
        d=addUnsigned(d,DD);
    }

    var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);

    return temp.toLowerCase();
}

function utf8_encode ( argString ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}
