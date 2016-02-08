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

        // set a flag to denote when plugin has been passed one of it's return values
        var workingReturn = null;


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
                contProc = (options.callback !== undefined && typeof options.callback === 'function') ? contProc: false;
                
                return contProc;
                
            },

            // process for tMgmt returned objects passed back into tMgmt
            handleObs: function(arg2){

                // chack that arg2 is a single tMgmt produced object
                if(arg2 instanceof Object && arg2.options !== undefined && arg2.options.name !== undefined && typeof arg2.options.callback === 'function'){

                    // check for 3rd argument - it will be the "force callback on clear" argument, if present
                    if(tMgmt.arguments[2]){

                        // call clear method with callback flag
                        clear(arg2.options.name, tMgmt.arguments[2]);    

                    }else{

                        // call clear method w/o callback flag
                        clear(arg2.options.name);    

                    }
                    

                }

            },

            handleClearAllObs: function(TMobs, trigger){

                // test if arg2 is an object or an array
                if($.isArray(TMobs)){

                    // loop through array
                    for(var i=0; i<TMobs.length; i++){

                        // set a reference to the current related timer's name
                        // according to whether the current array member is an object or a string
                        var timerName = (typeof TMobs[i] === "string")? TMobs[i]: TMobs[i].options.name;

                        //  and clear each associated timer/incrementor
                        clear(timerName);

                    }

                }else if(TMobs instanceof Object){

                    // arg2 is an object litteral containing tMgmt return objects which 
                    // some or all may trigger forced callbacks
                    // definately call method to handle litteral - handle THERE!
                }else if(typeof TMobs === 'string'){

                    // generic 'clearAll' call (arg2) has been passed - loop through the TMtimerStorage 
                    // array & get the timer name property from each member and pass it to the 'clear' method

                    // collect names - feeding the names straight to clear changes the array WHILE it's looping, not good...
                    var names = [];
                    for(var i=0; i<window.TMtimerStorage.length; i++){
                        var keys = Object.keys(window.TMtimerStorage[i]);
                        names.push(keys[0]);
                    }

                    // now loop through names array and feed names to clear method
                    for(var i=0; i<names.length; i++){
                        clear(names[i]);
                    }
                }

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
                    options.callback();
                    
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

                // set foundTimer flag
                // var foundTimer = 0;
                
                // loop through the window's storage array
                for(var i=0; i<window.TMtimerStorage.length; i++){
                    
                    // get the key of the current litteral
                    for(key in window.TMtimerStorage[i]){
                        
                        // compare key to name
                        if(key === name){

                            // increment foundTimer
                            // foundTimer++;
                            
                            // clear it
                            clearTimeout(window.TMtimerStorage[i][key]);
                            clearInterval(window.TMtimerStorage[i][key]);
                            
                            // remove it from window storage
                            _self.removeTimer(i);
                            
                            // also destroy the associated incrementor
                            _self.removeIncrementor(i);
                            
                        }
                        
                    }

                    // check if it's the last itteration and no timer was found - or one or more was...
                    // if(i === window.TMtimerStorage.length-1 && foundTimer === 0){

                    //     // send a warning in the console so the operation doesnt fail completely silently
                    //     console.warn('No timer found with the name - '+name);

                    // }
                    
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

                // the callback to run will be determined by whether or not the plugin is "working return"
                var callback = (workingReturn)? tMgmt.arguments[1].options.callback: options.callback;
                callback();
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

            // "clearAll" method call will have either an array for it's 2nd arg or an object litteral
            // - and possibly a 3rd arg of true if the callback force trigger should take place
            if(options === 'clearAll'){

                // check for multiple arguments
                if(tMgmt.arguments.length > 1){

                    // handle tMgmt return object values passed in with "clearAll" call
                    privateMethods.handleClearAllObs(tMgmt.arguments[1], tMgmt.arguments[2]);
                }else if(tMgmt.arguments.length === 1){

                    // 'clearAll' was the sole argument passed
                    privateMethods.handleClearAllObs(tMgmt.arguments[0]);

                }

            }else if(options === 'clear' && tMgmt.arguments.length > 1){
                
                // second argument is a $.tMgmt return value - set the flag
                workingReturn = true;

                // process second parameter
                privateMethods.handleObs(tMgmt.arguments[1]);

            }else{

                // return error

            }
            
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
