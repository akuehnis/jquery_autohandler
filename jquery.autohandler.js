/*!
 * jquery.autohandler.js JavaScript Library v0.0.2
 */
(function($){
    var container_list = [];
    
    function applyHandler(element) {
        var handler = element.dataset.autohandler;
        if (undefined == handler) return;
        if(-1 != handler.indexOf(';')){
            var aHandler = handler.split(';');
        }else{
            var aHandler = [handler];
        }
        for (var i=0; i< aHandler.length; i++){
            var h = aHandler[i];
            if ('' == h) continue;
            var a = h.split(':');
            // if jquery-mobile click to vclick events
            if('click' == a[0] && $.mobile){
                a[0] = 'vclick';
            }
            var namespaces = a[1].split(".");
            var context = window;
            var func = namespaces.pop();
            for(var j = 0; j < namespaces.length; j++) {
                context = context[namespaces[j]];
            }
            if (undefined != context[func]) {
                if ('now' == a[0]) {
                    context[func].call(element);
                    element.dataset.autohandler = element.dataset.autohandler.replace(h, '');
                } 
                else {
                    $(element).off().on(a[0], context[func]);
                }
                /*
                else if(element.addEventListener) {
                    element.addEventListener(a[0], context[func]);
                } 
                else {
                    // IE8 and older
                    element.attachEvent("on" + a[0], context[func])
                }
                */
            }else{
                console.log('autohandler not found: ' + contex[func]);
            }
        }
    }

    function applyHandlerContainer(container) {
        var elements = container.querySelectorAll('[data-autohandler]');
        for (var j=0; j<elements.length; j++) {
            applyHandler(elements[j]);
        }
    }
    function applyHandlerAll(){
        for (var i=0; i<container_list.length; i++) {
            applyHandlerContainer(container_list[i]);
        }
    }

    // Older browsers not knowing MutationObserver, we observe dom every 500 ms
    function oldBrowserDomChanged(container){
        var last = container.getElementsByTagName('*');
        var lastlen = last.length;
        var delay = 500;
        var timer = setTimeout(function check() {

            // get current state of the document
            var current = container.getElementsByTagName('*');
            var len = current.length;

            // if the length is different
            // it's fairly obvious
            if (len != lastlen) {
                // just make sure the loop finishes early
                last = [];
            }

            // go check every element in order
            for (var i = 0; i < len; i++) {
                if (current[i] !== last[i]) {
                    applyHandlerContainer(container);
                    last = current;
                    lastlen = len;
                    break;
                }
            }

            // over, and over, and over again
            setTimeout(check, delay);

        }, delay);
    }
    function observeContainer(container){
        if (MutationObserver) {
            var observer = new MutationObserver(function(mutation_records, observer_instance) {
                for (var i=0; i< mutation_records.length;i++) {
                    // Wir gehen vom Target aus und suchen nach autohandlern im subtree
                    var target = mutation_records[i].target;
                    var elements = target.querySelectorAll('[data-autohandler]');
                    for (var j=0; j<elements.length; j++) {
                        applyHandler(elements[j]);
                    }
                }

            });
            var config = { childList: true, subtree: true, attributes: false, characterData: false }
            observer.observe(container, config);
        } 
        // Older browsers that to not support MutationObserver
        else {
            oldBrowserDomChanged(container);
        }
    }

    function addContainer(container) {
        container_list.push(container);
        observeContainer(container);
        applyHandlerContainer(container);
    }

    // actions: apply|apply-once|stop
    $.fn.autohandler = function(action, options) {
        this.each(function() {
            addContainer(this);
        });
        return this;
    };
    return this;

}(jQuery));
