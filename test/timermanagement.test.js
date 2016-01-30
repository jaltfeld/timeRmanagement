/*
 * 
 * 
 *
 * Copyright (c) 2016 Jonathan Altfeld
 * Licensed under the MIT license.
 */
(function ($) {

   // $.tMgmt = function (options) { //, settings) {
    tMgmt = function (options) { //, settings) {

        // Default options.
        tMgmt.options = {
        };


        // encapulate private methods so they arent readily available
        var privateMethods = {

            // check to see if the settings contained anything - exit returning chain if not
            checkOptions: function(options){
                
                // set continue processing flag
                var contProc = true;
                
                // define flag 
                contProc = (options.name && typeof options.name === 'string') ? contProc: false;
                contProc = (options.duration && typeof options.duration === 'number') ? contProc: false;
                contProc = (options.interval === true || options.timeout === true) ? contProc: false;
                contProc = (options.interval === true && options.timeout === true) ? false: contProc;
                contProc = (options.callback !== undefined && options.callback instanceof Object) ? contProc: false;
                
                return contProc;
                
            },

            // prep for timer storage in window
            prepStorage: function(){
                // check for timerStorage in data on window object
                if(!window.TMtimerStorage){
                    
                    // add the new property to the window object
                    window.TMtimerStorage = [];
                    
                    // add place for incrementors (if opertion needs) also in window
                    window.MGMTinc = [];
                    
                }
                
            },

            // create the timer functionlity, register it to the window object
            // & add window object cleanup to callback functionality
            registerTimer: function(){

                // store context
                var _self = this;
                
                // prep timer storage litteral
                var timer = {};
                timer[tMgmt.options.name] = null;
                
                // clear any pre-existing timers with this name
                this.clearFromWindow(tMgmt.options.name);
                
                // push onto window
                window.TMtimerStorage.push(timer);
                
                // declare incremetor for possible use w/this timer
                var newInc = {};
                newInc[tMgmt.options.name] = tMgmt.options.incrementBy || null;
                window.MGMTinc.push(newInc);

                // kick off the timer
                _self.timerCreate();

            },

            // add (and kick off) timer functionality to TMtimerStorage array
            timerCreate: function(){

                // store context
                var _self = this;

                // prep action flag to determine if a timeout or an inrterval is being set
                var action = (tMgmt.options.interval === true) ? 'setInterval': 'setTimeout';

                // store index this timer (and it's incrementor) will sit at in their matching arrays
                var index = window.TMtimerStorage.length - 1;

                // set up timer w/handle
                window.TMtimerStorage[index][tMgmt.options.name] = window[action](function(){

                    // run callback
                    tMgmt.options.callback();
                    
                    // if this timer is a timeout clear it & remove it
                    if(action === 'setTimeout'){
                        
                        // clear & remove
                        _self.clearFromWindow(tMgmt.options.name);
                        
                    }

                    // if this timer is an interval it should be incremented
                    if(action === 'setInterval' && window.MGMTinc[index][tMgmt.options.name] !== null){

                        // de-increment the incrementor if it is greater than 1
                        if(window.MGMTinc[index][tMgmt.options.name] > 1){

                            // de-increment
                            window.MGMTinc[index][tMgmt.options.name] -= 1;

                        }else{

                            // remove it at one
                            _self.clearFromWindow(tMgmt.options.name);   

                        }

                    }
                    
                }, tMgmt.options.duration);
            },

            // clear the timer using a parameter to look for it's name
            clearFromWindow: function(name){
                
                // store context
                var _self = this;
                
                // loop through the window's storage array
                for(var i=0; i<window.TMtimerStorage.length; i++){
                    
                    // get the key of the current litteral
                    for(key in window.TMtimerStorage[i]){
                        
                        // compare key to name
                        if(key === name){
                            
                            // clear it
                            clearTimeout(window.TMtimerStorage[i][key]);
                            clearInterval(window.TMtimerStorage[i][key]);
                            
                            // remove it from window storage
                            _self.removeTimer(i);
                            
                            // also destroy the associated incrementor
                            _self.removeIncrementor(i);
                            
                        }
                        
                    }
                    
                }
                
            },

            // remove specific array member holding a timer from window storage
            removeTimer: function(inc){

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

            },

            // remove specific array member holding a timer from window storage
            removeIncrementor: function(inc){

                // create a place to capture timer handles to keep
                var captureArr = [];

                // loop through the TMtimerStorage array
                for(var i=0; i<window.MGMTinc.length; i++){

                    // store all members in the captureArr who's IDs dont match the inc parameter
                    if(i != inc){
                        captureArr.push(window.MGMTinc[i]);
                    }
                }

                // reset window.TMtimerStorage to the value of captureArr
                window.MGMTinc = captureArr;
                
            }

        };

        // generic "clear" method to be called by the user via the plugin
        var clear = function(name, triggerCallback){

            // check if callback is being triggered - and if so trigger it...
            if(triggerCallback){
                tMgmt.options.callback();
            }
            
            // pass to this.clearFromWindow
            privateMethods.clearFromWindow(name);

        };
        
        // remove all timers from window storage (clear everything)
        var clearAll = function(){
            
            // loop through each timer stored in the window
            for(var i=0; i<TMtimerStorage.length; i++){
                
                // get the key of the litteral
                for(key in TMtimerStorage[i]){
                    
                    // pass to clear method by name
                    this.clear(key);
                    
                }
                
            }

        };

        // determine if option is an initializing object or a method call (string)
        if(options instanceof Object){
            // first run of plugin (which sets the options) should always enter into this block
            // so the else block will not run the first time and if this plugin is called to run
            // individual methods this first block should never be entered again after first run...
            // So, the processing AFTER the else block is the processing which will run on first
            // run immediately after THIS BLOCK...

            // Override default options with passed-in options.
            tMgmt.options = $.extend({}, tMgmt.options, options);

            // see if there was enough settings data passed in to use the plugin
            if(privateMethods.checkOptions(tMgmt.options)){
                
                // continue processing... make sure window is ready to store our custom timer handles
                privateMethods.prepStorage();

                // create our timer & timer handle & attach the handle to the window
                privateMethods.registerTimer();
                
            }else{
                
                // reset $.tMgmt.options to default and send an error message to the console
                console.error('timeRmanagement setup error: Please include with your option object the following properties: name [string], duration [number], timeout OR interval [boolean] and callback [function].');
                tMgmt.options = {};
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

        return {
            options: tMgmt.options,
            clear: clear,
            clearAll: clearAll
        }
        
    };

}(jQuery));
