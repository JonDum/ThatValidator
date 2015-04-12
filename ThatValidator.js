
/**====-----==============================================
||                                                       /
|
|   ThatValidator.js
|
|   Site:  http://jondum.github.com/ThatValidator
|   Author: Jonathan Dumaine
|   Version: 1.0.0
|   License: MIT
|
||                                                       \
/**====-----=============================================*/

(function(window, document) {

    "use strict";

    var noop = function() {};

    var defaultConfig = {

        completed: noop,
        onFocus: noop,
        onBlur: noop,
        onKeyPress: noop,

        fields: { }
    };


    ThatValidator.prototype = {

        /**====-----========================
        ||                                 /
        |
        |         Event Handlers
        |
        ||                                 \
        /**====-----========================*/

        onFieldFocus:function(e)
        {
            var self = this, target = e.target, config = self.config;

            self.runLocalHandlers('validations', target)
            .then(function(errors) {

                if(!errors || errors.length == 0)
                    self.setFieldValid(target);

            });

            self.runLocalHandlers('onFocus', target, e);
        },

        onFieldBlur: function(e)
        {
            var self = this, target = e.target, config = self.config;

            self.runLocalHandlers('validations', target)
            .then(function(errors) {

                if(!errors || errors.length == 0)
                    self.setFieldValid(target);
                else
                    if(errors.length > 0)
                        self.setFieldInvalid(target, errors);

            });

            self.runLocalHandlers('onBlur', target, e);
        },

        onFieldKeyUp: function(e)
        {
            var self = this, target = e.target;

            // Dont validate on TAB
            if((e.which || e.keyCode) == 9)
                return;

            // we don't want to run validations on every sigle key click,
            // so we delay it until they've stopped typing for a moment
            self.runValidationsDebounced(target);

            self.runLocalHandlers('onKeyUp', target, e);
        },

        onFieldKeyPress: function(e)
        {
            var self = this, target = e.target;

            // we don't want to run validations on every sigle key click,
            // so we delay it until they've stopped typing for a moment
            self.runValidationsDebounced(target);

            self.runLocalHandlers('onKeyPress', target, e);
        },

        runValidationsDebounced: debounce(function(target)
        {
            var self = this;

            self.runLocalHandlers('validations', target)
            .then(function(errors) {

                if(errors && errors.length > 0)
                    self.setFieldInvalid(target, errors);
                else
                    self.setFieldValid(target);

            });

        }, 1000),


        /**====-----========================
        ||                                 /
        |
        |        Private* Methods
        |
        ||                                 \
        /**====-----========================*/

        // These fields traverse through the config
        // to find the correct error/valid handler

        setFieldInvalid: function(field, errors, debounced)
        {
            var self = this, config = self.config;

            // add the errors to the cache
            self.errors[field.name||field.id] = errors;

            //remove the field from validFields
            var index = self.validFields.indexOf(field);
            if(index > -1)
                self.validFields.splice(index, 1);

            self.runLocalHandlers('onError', field, errors);

            // for preventing multiple config.complete() calls
            self._refilled = true;

        },

        setFieldValid: function(field)
        {
            var self = this, config = self.config;

            self.runLocalHandlers('onValid', field);

            // remove cached errors
            delete self.errors[field.name||field.id];

            //add to validFields
            var index = self.validFields.indexOf(field);
            if(index == -1)
                self.validFields.push(field);

            //if entire form is valid & filled
            if(self.isValid() && self._refilled)
            {
                config.completed(field);
                self._refilled = false;
            }

        },

        /**
        * Return the local configuration for a given field or selector
        * @param field
        */
        getLocalHandlers: function(field)
        {
            var self = this;

            return self.handlers[self.fields.indexOf(field)];
        },

        /**
         * Runs local handlers for a given type and field
         * @param type String
         * @param field HTMLElement
         * @param eventOrErrors Object If the handler is based off an event, the event should be forwarded, else if it as an onError handler, the errors should be forwarded
        */
        runLocalHandlers: function(type, field, eventOrErrors)
        {
            var self = this;

            var promise = new Promise();

            var localHandlers = self.getLocalHandlers(field);

            if(type == 'validations')
                var errors = [];

            var asyncValidationPending;

            // loop through all the local handers
            for(var i = 0; i < localHandlers.length; i++)
            {
                var handler = localHandlers[i];

                if(type == 'validations')
                {
                    var result = null;

                    var callback = function(asyncErrors) {
                        //TODO warn if Array not passed in
                        errors = errors.concat(asyncErrors);
                        promise.resolve(errors);
                    };

                    if(isFunction(handler))
                        result = handler(field, callback);
                    else
                    if(handler[type])
                        result = handler[type](field, callback);

                    if(typeof result === 'undefined')
                        asyncValidationPending = true;
                    else
                    if(result && isArray(result))
                        errors = errors.concat(result);

                    if(!asyncValidationPending && i == (localHandlers.length - 1))
                        promise.resolve(errors)

                }
                else
                if(handler[type])
                {
                    handler[type](field, eventOrErrors);
                }
            }

            return promise;
        },


        /**====-----========================
        ||                                 /
        |
        |          Public Methods
        |
        ||                                 \
        /**====-----========================*/



        /**
        * If no field is passed in, returns the Boolean validity of the entire form.
        * If a field is passed in, returns the validity of that single field
        *
        * This does NOT go through all the fields and validate them again.
        *
        * Use .validate() for that.
        *
        * @param field
        */
        isValid: function(field)
        {
            var self = this;

            if(field)
                return !self.errors.hasOwnProperty(field.id||field.name)

            if(self.validFields.length !== self.fields.length)
                return false;

            for(var key in self.errors)
                if(self.errors.hasOwnProperty(key))
                    return false;

            return true;
        },

        /**
        * Go through all the fields and runs validations over them.
        * Or, validate a single field.
        *
        * @param callback {Function} Called when validations are finished
        * @param runHandlers {Boolean} If true, also runs local handlers for each validation set
        */
        validate: function(callback, runHandlers, field)
        {
            var self = this;

            if(!isFunction(callback))
                callback = K;

            var processedFields = [];

            if(field && isElement(field) && self.fields.indexOf(field) > 1)
            {
                self.runLocalHandlers('validations', field).then(runHandlersExec);
            }
            else
            {
                for(var i = 0; i < self.fields.length; i++)
                {
                    var field = self.fields[i];

                    var runHandlersExec = (function(field) {

                        return function(errors) {

                            if(runHandlers === true)
                            {
                                if(!errors || errors.length == 0)
                                    self.setFieldValid(field);
                                else
                                if(errors.length > 0)
                                    self.setFieldInvalid(field, errors);
                            }

                            if(processedFields.indexOf(field) == -1)
                                processedFields.push(field);

                            if(processedFields.length == self.fields.length)
                                callback(self.isValid());

                        }

                    })(field);

                    self.runLocalHandlers('validations', field).then(runHandlersExec);
                }
            }

        },

        /**====-----========================
        ||                                 /
        |
        |              Init
        |
        ||                                 \
        /**====-----========================*/

        init: function()
        {
            var self = this;

            // fields maps to handlers index to index. The 4th index of fields is the key for the 4th value of handlers, etc etc
            self.fields   = []; // [input, input, input];
            self.handlers = []; // [[handler], [handler, handler], [handler]];

            // 1. loop through config.fields and find all fields we will be validating on
            // 2. Save found fields in a flat array
            // 3. Add any handlers for that field to the corresponding location in self.handlers
            for(var key in self.config.fields)
            {
                var elements = querySelectorAllArray(key, self.form);

                var handlers = self.config.fields[key];

                for(var i = 0; i < elements.length; i++)
                {
                    var field = elements[i];

                    //if the element has not already been found
                    if(self.fields.indexOf(field) == -1)
                    {
                        self.fields.push(field);
                        self.handlers.push([handlers]);

                        field.addEventListener('focus', function(e) { self.onFieldFocus.call(self, e) });
                        field.addEventListener('blur',  function(e) { self.onFieldBlur.call(self, e) });
                        field.addEventListener('keypress', function(e) { self.onFieldKeyPress.call(self, e) });
                        field.addEventListener('keyup', function(e) { self.onFieldKeyUp.call(self, e) });

                    }
                    else
                    {
                        // the element has already been parsed, add additional handlers to it
                        self.handlers[self.fields.indexOf(elements[i])].push(handlers);
                    }
                }

            }

        }

    }


    /**====-----========================
    ||                                 /
    |
    |           Constructor
    |
    ||                                 \
    /**====-----========================*/

    function ThatValidator(form, config)
    {
        var self = this;

        if(isElement(form))
            self.form = form;
        else
        if(typeof form == 'string')
            self.form = document.querySelector(form);
        else
            logError('Please pass a valid element or selector');

        if(!config)
            config = defaultConfig;

        // merge default config
        if(typeof config === 'object')
        {
            for(var key in defaultConfig)
            {
                if(typeof config[key] === 'undefined')
                    config[key] = defaultConfig[key];
            }
        }

        self.config = config;

        self.errors = {}; //placeholder for any errors the form currently has

        self.validFields = [ ];

        self.init();

    };

    // Export this shiz
    if(typeof define == 'function' && define.amd)
    {
        // AMD support
        define(function() {
            return ThatValidator;
        });
    }
    else
    if(typeof module !== 'undefined' && module.exports)
    {
        // commonjs export
        module.exports = ThatValidator;
    }
    else
    {
        // browser export
        window.ThatValidator = ThatValidator;
    }

    /**====-----========================
    ||                                 /
    |
    |    Space Age Utility Functions
    |
    ||                                 \
    /**====-----========================*/


    

    function querySelectorAllArray(selector, element)
    {
        return Array.prototype.slice.call((element || document).querySelectorAll(selector));
    }

    function isArray(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]')
    }

    function isElement(o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
      );
    }

    function isFunction(o) {
        return (typeof o === 'function')
    }

    // If you use lodash and really care about every KB, replace this with `var debounce = require('lodash/function/deounce');`
    function debounce(func, wait) {
        var timeout, args, context, timestamp;

        return function() {

            context = this;
            args = [].slice.call(arguments, 0);
            timestamp = new Date();

            var later = function() {

                var last = (new Date()) - timestamp;

                if (last < wait) {
                    timeout = setTimeout(later, wait - last);

                } else {
                    timeout = null;
                    func.apply(context, args);
                }
            };

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        }
    }


    //tiny Promise impl for internal use
    function Promise() {
        this._thens = [];
    }

    Promise.prototype = {

        then: function(onResolve, onReject) {
            this._thens.push({ resolve: onResolve, reject: onReject });
        },

        resolve: function(val) {
            this._complete('resolve', val);
        },

        reject: function(ex) {
            this._complete('reject', ex);
        },

        _complete: function (which, arg) {

            this.then = (which === 'resolve') ?
                function (func) { func && func(arg); } :
                function () { throw new Error("This promise has already been rejected")};

            var aThen, i = 0;
            while (aThen = this._thens[i++]) { aThen[which] && aThen[which](arg); }
            delete this._thens;
        }

    };


})(window, document);
