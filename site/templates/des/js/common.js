String.prototype.toAscii = function()
{
    return this;
};

function popup(datei,name,breite,hoehe,noresize)
{ 
    var posX=(screen.availWidth-breite)/2;
    var posY=(screen.availHeight-hoehe)/2;
    var resizable = (noresize==1) ? 0 : 1;
    window.open(datei,name,"resizable="+resizable+",scrollbars=1,width=" + breite + ",height=" + hoehe + "screenX=" + posX + ",screenY=" + posY + ",left=" + posX + ",top=" + posY + "");
}


function galpop(datei,name,breite,hoehe,noresize)
{ 
    var posX=(screen.availWidth-breite)/2;
    var posY=(screen.availHeight-hoehe)/2;
    var resizable = (noresize==1) ? 0 : 1;
    var scrollbar = (document.all) ? 0 : 1;
    window.open(datei,name,"resizable="+resizable+",scrollbars="+scrollbar+",width=" + breite + ",height=" + hoehe + "screenX=" + posX + ",screenY=" + posY + ",left=" + posX + ",top=" + posY + "");
}


function textCounter(field, countfield, maxlimit)
{ 
    if (field.value.length > maxlimit)
    { 
        field.value = field.value.substring(0, maxlimit);
    } else { 
        countfield.value = maxlimit - field.value.length;
    }
}


function elemX (element) {
    var x = 0;
    while (element) {
        x += element.offsetLeft;
        element = element.offsetParent;
    }
    return x;
}

function elemY (element) {
    var y = 0;
    while (element) {
        y += element.offsetTop;
        element = element.offsetParent;
    }
    return y;
}

function getWidth (element) {
    return element.offsetWidth;
}

function getHeight (element) {
    return element.offsetHeight;
}

function elemObj(elementId) {
    if (document.all)
        return document.all[elementId];
    else if (document.getElementById)
        return document.getElementById(elementId);
    else
        return null;
}


function printContent(div_id)
{
    var d=elemObj(div_id);
    var html = d.innerHTML;
    // html = html.replace(/src="/gi, 'src="../' );
  html = html.replace(/&lt;/gi, '<' );
  html = html.replace(/&gt;/gi, '>' );
  html = html.replace(/&amp;/gi, '&' );  
  var pFenster = window.open( '', null, 'height=400,width=600,toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes' ) ;
  var HTML = '<html><head></head><body style="font-family:verdana,arial;font-size:11px" onload="window.print()">' + html + '</body></html>' ;
  pFenster.document.write(HTML);
  pFenster.document.close();
}

function popupContent(div_id)
{
    var d=elemObj(div_id);
    if(!d) return false;
    var html = d.innerHTML;
    html = html.replace(/&lt;/gi, '<' );
    html = html.replace(/&gt;/gi, '>' );
    html = html.replace(/&amp;/gi, '&' );  
    var pW = window.open( '', null, 'height=400,width=600,toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes' ) ;
    var HTML = '<html><head></head><body style="font-family:verdana,arial;font-size:11px">' + html + '</body></html>' ;
    pW.document.write(HTML);
    pW.document.close();
}

var CommonImages = {
    loading: '<img height="14" src="data:image/png;base64,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" />'
}




var CommonBase = Class.create({

    initialize: function()
    {
        this.cookieObject = null;
        this.requireObject = null;
        this.modal = null;
        this.debugEnabled = false;
        this.data = {
            theme: 'cp',
            protect: false
        };
        this.loaded = false;
        this.images = CommonImages;
    },
    init: function ()
    {
    	if(!Object.isUndefined(commonData)) {
    	    this.data = commonData;
    	}
        this.cookieObject = new Cookies();
        this.requireObject = new Require();
        this.initilizeElements();
        this.loaded = true;
        if(this.data["protect"]) {
            this.require('js/tools/protect.js', function () {
                new Protect();
            });
        }
    },
    debug: function (string)
    {
        if(!this.debugEnabled) return;
        console.log(string); 
    },
    themePath: function ()
    {
	return '/templates/' + this.data["theme"] + '/';
    },
    submitForm: function (form,update_to)
    {
        this.clearTitles(form);
        var self= this;
        $(update_to).update(this.images.loading);
        $(form).request({
            onComplete: function(transport){
                $(update_to).update(transport.responseText);
                self.enableTitles(form);
            }
        });
        return false;
    },
    
    clearTitles: function (form)
    {
        $A($(form).getElements()).each(function(el){if(el.title==el.value) el.value='';});
    },
    
    enableTitles: function (form)
    {
        $A($(form).getElements()).each(function(el){if(el.value=='') el.value=el.title;});
    },
    
    invokeUrl: function (url, method, evaling)
    {
            var res=null;
        method=(method===undefined)? 'get': method;
        new Ajax.Request(url, {
            method: method,
            asynchronous: false,
            onSuccess: function(transport)
            {
                res=transport.responseText;
            }
        });
        
        if(evaling!==undefined && evaling)
            {
                eval(res);
            }
        return res;
    },
    ajaxJson: function (url, parameters)
    {
        var res = null;
        new Ajax.Request(url, {
            method: 'get',
            parameters: parameters || '',
            contentType: 'application/json',
            requestHeaders: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            asynchronous: false,
            onSuccess: function(transport) {
                res = transport.responseJSON;
            }
        });
        return res;
    },
    
    initilizeElements: function ()
    {
        var self = this;
            $$('.blur').invoke('observe','click',function(event){
                                el=Event.element(event);
                                if(el.value.substr(0,100)==el.title.substr(0,100))
                                {
                                    el.value='';el.style.color='#000000';                    
                                }
                    });
            $$('.blur').invoke('observe','focus',function(event){
                                el=Event.element(event);
                                if(el.value.substr(0,100)==el.title.substr(0,100))
                                {
                                    el.value='';el.style.color='#000000';
                                }
                    });        
            $$('.blur').invoke('observe','blur',function(event){
                                el=Event.element(event);
                                if(el.value=='')
                                {
                                    el.value=el.title;el.style.color='#898989';
                                }
                    });
            $$('.blur').each(function(el){
            if(el.value==el.title) {
                el.style.color='#898989';
            }
            });
            
            $A($$('a.modal, a.'+this.data["theme"]+'-modal')).each(function(el){
               if($(el).readAttribute('rel') != '') {
                   el.onclick=function(){
                   common.modalContent(el.rel, el);
                   return false;
                   }
               } 
            });
            
            this.csrfTokens();
        	setInterval(this.csrfTokens.bind(this), 5 * 60000 ); // 5 minutes
    },
    csrfTokens: function () {
        var self = this;
        //this.cookieObject.clearByPrefix('CSRF', 1);
        var forms = $A($$('form:not(.no-csrf)'));
        var tokens = this.ajaxJson('/scripts/tokens.php?n=' + forms.length);
        
            forms.each(function(form, index) {
                if($(form).hasClassName('no-csrf')) {
                    return;
                }
                var token = tokens[index];//self.random();
                var el = form['csrf_token'];
                if(typeof el === 'undefined') {
                    el = new Element('input', {
                        'type': 'hidden',
                        'name': 'csrf_token',
                        'value': token
                        });
                    form.appendChild(el);
                } else {
                    el.value = token;
                }
                //self.cookieSet(token, 1, 1/24/10);
            });
    },
    random: function () {
        //return 'CSRF' + Math.random().toString(36).substr(8).toUpperCase();
    },
    addTextToField: function (text,field) 
    { 
      field.focus(); 
    	  if (document.selection && document.selection.createRange)  // Internet Explorer 
          { 
              sel = document.selection.createRange(); 
              if (sel.parentElement() == field)  sel.text = text; 
          } 
          else if (typeof(field) != "undefined")  // Firefox
          { 
              var lenggth = parseInt(field.value.length); 
              var selStart = field.selectionStart; 
              var selEnd = field.selectionEnd; 
              field.value = field.value.substring(0,selStart) + text + field.value.substring(selEnd,lenggth); 
          } 
          else field.value += text; 
          field.focus(); 
    },
    popupContent: function (div_id, width, height)
    {
        if(!width) width=600;
        if(!height) height=400;
        if(!$(div_id)) return false;
        var html = $(div_id).innerHTML;
        html = html.replace(/&lt;/gi, '<' );
        html = html.replace(/&gt;/gi, '>' );
        html = html.replace(/&amp;/gi, '&' );  
        var wc = window.open( '', null, 'height='+height+',width='+width+',toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes' ) ;
        var HTML = '<html><head></head><body style="font-family:arial;">' + html + '</body></html>' ;
        wc.document.write(HTML);
        wc.document.close();
    },
    /**
	 * {show: div_id, cbshow: , cbclose: , tooltip: false, tooltippos: '-10,10,0,0'}
     */
    modalContent: function (div_id, el)
    {
        var options = {
                cbshow: function () {},
                cbclose: function () {},
                tooltip: false,
                tooltippos: '0,0,0,0'
        };
        if (div_id.indexOf('{') > -1) {
            try {
                eval("var params="+div_id+";");
            } catch(e){}
            } else {
            var params = {show: div_id};
        }
        Object.extend(options, params);
        if(!$(options.show)) {
        return;
        }
        if(!this.modal) {
        this.modal=new Element('div');
        this.modal.addClassName('modal-modal');
        this.modalcontent=new Element('div');
        this.modalcontent.addClassName('modal-content');
        this.modalclose=new Element('a', {'href':'javascript:common.modalClose()'});
        this.modalclose.addClassName('modal-close');
        this.modalclose.update('&times;');
        this.modalcontent.appendChild(this.modalclose);
        this.modal.appendChild(this.modalcontent);
        this.modalConteiner().appendChild(this.modal);
        }
        
        if(this.modalcontent._current) {
            this.modalClose();
        }
        
        this.modalcontent.appendChild($(options.show));
        this.modalcontent._current = options;
        $(options.show).show();
        options.cbshow();
        
        if(options.tooltip) {
            this.modalcontent.addClassName('modal-tooltip');
            $(el).up().appendChild(this.modalcontent);
            var m = options.tooltippos.split(',');
            var margins = {
                    marginTop: m[0] + 'px',
                    marginRight: m[1] + 'px',
                    marginBottom: m[2] + 'px',
                    marginLeft: m[3] + 'px'
            }
            this.modalcontent.setStyle(margins);
        } else {
            this.modalConteiner().addClassName('modal-lock');
        }
    },
    modalClose: function ()
    {
        $(this.modalcontent._current.show).hide();
        this.modalcontent._current.cbclose();
        this.modal.appendChild(this.modalcontent);
        this.modalcontent.removeClassName('modal-tooltip');
        var el = this.modalConteiner();
        el.appendChild($(this.modalcontent._current.show));
        el.removeClassName('modal-lock');
        this.modalcontent._current = null;
        this.modalcontent.setStyle({margin: '5% auto 0'})
    },
    modalConteiner: function ()
    {
        if(this.modalEl) {
        return this.modalEl;
        }
        var el = 'body';
        // IE < 8
        if(document.all && !document.querySelector) {
            el = 'html';
        }
        this.modalEl = $A($$(el)).first();
        return this.modalEl;
    },
    cookieSet: function(key, value, days) 
    {
        try {
        this.cookieObject.set(key, value, days);
        }
        catch (e){};
    },
    cookieGet: function(key) 
    {
        try {
        return this.cookieObject.get(key);
        }
        catch (e){};
    },
    cookieClear: function(key) 
    {
        try {
        return this.cookieObject.clear(key);
        }
        catch (e){};
    },
    require: function (url, callback)
    {
        if(!url) return;
        if(!this.loaded) {
            document.observe("dom:loaded", function() {
                common.require(url, callback);
            });
            return;
        }
    	if(!url.startsWith('/')) {
    	    url = this.themePath() + url;
    	}
    	this.requireObject.require(url, callback);
    }
});

var common=new CommonBase();
document.observe("dom:loaded", function() {
    common.init();
});

var Cookies = Class.create({
    initialize: function(path, domain) {
        this.path = path || '/';
        this.domain = domain || null;
    },
    set: function(key, value, days) {
        if (typeof key != 'string') {
            throw "Invalid key";
        }
        if (typeof value != 'string' && typeof value != 'number') {
            throw "Invalid value";
        }
        if (days && typeof days != 'number') {
            throw "Invalid expiration time";
        }
        var setValue = key+'='+escape(new String(value));
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var setExpiration = "; expires="+date.toGMTString();
        } else var setExpiration = "";
        var setPath = '; path='+escape(this.path);
        var setDomain=(this.domain) ? '; domain='+escape(this.domain) : '';
        var cookieString = setValue+setExpiration+setPath+setDomain;
        document.cookie = cookieString;
    },
    get: function(key) {
        var keyEquals = key+"=";
        var value = false;
        document.cookie.split(';').invoke('strip').each(function(s){
            if (s.startsWith(keyEquals)) {
                value = unescape(s.substring(keyEquals.length, s.length));
            }
        });
        return value;
    },
    clearByPrefix: function(prefix, value) {
        value += '';
        var self = this;
        document.cookie.split(';').invoke('strip').each(function(s){
            if (s.startsWith(prefix)) {
                var parts = s.split('=');
                if(value && value == parts[1]) {
                    self.clear(parts[0]);
                }
            }
        });
    },
    clear: function(key) {
        this.set(key,'',-1);
    }
});

var Require = Class.create({
    initialize: function() {
        this._required = [];
    },
    require: function (url, callback)
    {
        var self = this;
        if (Object.isArray(url)) {
            if (url.length > 1) {
                self.require(url.slice(0,url.length-1), function () {
                    self.require(url[url.length-1], callback);
                });
            } else if (url.length == 1) {
                self.require(url[0], callback);
            }
            return;
        }
        if (Object.isUndefined(self._required[url])) {
            self._required[url] = [];
            if(url.endsWith('js')) {
                var script = new Element('script', {
                    src: url,
                    type: 'text/javascript'
                });
            } else if(url.endsWith('css')) {
                var script = new Element('link', {
                    href: url,
                    rel: 'stylesheet',
                    type: 'text/css'
                });
            }
            script.observe('load', function () {
                self._required[url].each(function (cb) {
                    cb.call();
                });
                self._required[url] = true;
            });
            $$('head')[0].insert(script);
        } else if(!Object.isArray(self._required[url])) {
            if (callback) { 
                callback.call(); 
            }
            return;
        }
        if (callback) { 
            self._required[url].push(callback);
        }
    }
});

var ArrayObject = Class.create({
    initialize : function() {
        this.items = [];
    },
    get : function(index) {
        index = index * 1;
        return this.items[index] = this.items[index] || {};
    },
    set : function(index, item) {
        index = index * 1;
        this.items[index] = item;
    },
    remove : function(index) {
        index = index * 1;
        delete this.items[index];
    },
    append : function(item) {
        this.items.push(item);
    }
});

