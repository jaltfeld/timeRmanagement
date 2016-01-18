/*
 * 
 * 
 *
 * Copyright (c) 2016 Jonathan Altfeld
 * Licensed under the MIT license.
 */
(function ($) {

    $.tMgmt = function (options) { //, settings) {

        // determine if option is an initializing object or a method call (string)
        if(options instanceof Object){
            // first run of plugin (which sets the options) should always enter into this block
            // so the else block will not run the first time and if this plugin is called to run
            // individual methods this first block should never be entered again after first run...
            // So, the processing AFTER the else block is the processing which will run on first
            // run immediately after THIS BLOCK...

            // Override default options with passed-in options.
            $.tMgmt.options = $.extend({}, $.tMgmt.options, options);

            // see if there was enough settings data passed in to use the plugin
            if($.tMgmt.checkOptions($.tMgmt.options)){
                
                // continue processing... make sure window is ready to store our custom timer handles
                $.tMgmt.prepStorage();

                // create our timer & timer handle & attach the handle to the window
                $.tMgmt.registerTimer();
                
            }else{
                
                // reset $.tMgmt.options to default and send an error message to the console
                console.error('timeRmanagement setup error: Please include with your option object the following properties: name [string], duration [number], timeout OR interval [boolean] and callback [function].');
                $.tMgmt.options = {};
            }
            
        }else{
            
            // handle call to method right now...
            // check to see that method passed exists
            
            /*
             *  also any other special cases, settings, flags
             *  or conditions & etc. can be processed here...
             * 
             */
            
        }

        // pass back object of public methods and properties
        var publicObject = {
            options: $.tMgmt.options
        }
        return publicObject;   
        
    };

    // Default options.
    $.tMgmt.options = {
    };

    // set flag property exposing whether options check, to allow plugin instantiation, has occured
    $.tMgmt.optionsChecked = null;

    // check to see if the settings contained anything - exit returning chain if not
    $.tMgmt.checkOptions = function(options){
        
        // set continue processing flag
        var contProc = true;
        
        // define flag 
        contProc = (options.name && typeof options.name === 'string') ? contProc: false;
        contProc = (options.duration && typeof options.duration === 'number') ? contProc: false;
        contProc = (options.interval === true || options.timeout === true) ? contProc: false;
        contProc = (options.interval === true && options.timeout === true) ? false: contProc;
        contProc = (options.callback !== undefined && options.callback instanceof Object) ? contProc: false;
        
        // define flag property indicating this check has run
        $.tMgmt.optionsChecked = true;
        
        return contProc;
        
    }

    // prep for timer storage in window
    $.tMgmt.prepStorage = function(){
        
        // check for timerStorage in data on window object
        if(!window.TMtimerStorage){
            
            // add the new property to the window object
            window.TMtimerStorage = [];
            
            // add place for incrementors (if opertion needs) also in window
            window.MGMTinc = {};
            
        }
        
    },

    // create the timer functionlity, register it to the window object
    // & add window object cleanup to callback functionality
    $.tMgmt.registerTimer = function(){

        // store context
        var _self = this;
        
        // set action flag & handle & empty timer storage litteral
        var action = (this.options.interval == true) ? 'setInterval': 'setTimeout';
        var timer = {};
        
        // clear any pre-existing timers with this name
        this.clearFromWindow(this.options.name);
        
        // set up timer w/handle
        timer[this.options.name] = window[action](function(){
            
            // run callback
            _self.options.callback();
            
            // if this timer is a timeout clear it & remove it
            if(action == 'setTimeout'){
                
                // clear & remove
                _self.clearFromWindow(_self.options.name);
                
            }
            
        }, _self.options.duration);
        
        // declare incremetor for possible use w/this timer
        window.MGMTinc[_self.options.name] = _self.options.startingInc;
        
        // push onto window
        window.TMtimerStorage.push(timer);
        
    },

    // clear the timer using a parameter to look for it's name
    $.tMgmt.clearFromWindow = function(name){
        
        // store context
        var _self = this;
        
        // loop through the window's storage array
        for(var i=0; i<window.TMtimerStorage.length; i++){
            
            // get the key of the current litteral
            for(key in window.TMtimerStorage[i]){
                
                // compare key to name
                if(key == name){
                    
                    // clear it
                    clearTimeout(window.TMtimerStorage[i][key]);
                    clearInterval(window.TMtimerStorage[i][key]);
                    
                    // remove it from window storage
                    _self.removeTimer(i);
                    
                    // also destroy the associated incrementor
                    window.MGMTinc[_self.options.name] = null;
                    
                }
                
            }
            
        }
        
    },

    // remove specific array member holding a timer from window storage
    $.tMgmt.removeTimer = function(inc){

        // create a place to capture timer handles to keep
        var captureArr = [];

        // loop through the TMtimerStorage array
        for(var i=0; i<window.TMtimerStorage.length; i++){

            // store all members in the captureArr who's IDs dont match the inc parameter
            if(i != inc){
                captureArr.push(window.TMtimerStorage[i]);
            }
        }

        // reset window.TMtimerStorage to the value of captureArr
        window.TMtimerStorage = captureArr;

    }

}(jQuery));
