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

        // debug
        var internalInc = 0;

        // prepare a flag to denote when plugin has been passed one of it's return values
        var workingReturn = null;

        // prepare a flag to let tMgmt know that force callback triggers will look for callbacks in with named timers
        var workingGenericClearAll = null;


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
            handleObs: function(obPassed){

                // chack that arg2 is a single tMgmt produced object
                if(obPassed instanceof Object && obPassed.options !== undefined && obPassed.options.name !== undefined && typeof obPassed.options.callback === 'function'){

                    // check for 3rd argument - it will be the "force callback on clear" argument, if present
                    if(tMgmt.arguments[2]){

                        // call clear method with callback flag
                        clear(obPassed.options.name, tMgmt.arguments[2]);    

                    }else{

                        // call clear method w/o callback flag
                        clear(obPassed.options.name);    

                    }
                    

                }

            },

            handleClearAllObs: function(TMobs, trigger){

                // test if arg2 is an object or an array
                if($.isArray(TMobs)){

                    // check for an array of objects containing a "timer" key
                    if(this.findTimerKey(TMobs)){
                        
                        // loop through the array and it's member objects
                        for(var i=0; i<TMobs.length; i++){

                            // get the name of the timer
                            var Tname = TMobs[i].timer.options.name;

                            // verify the presence of a force trigger flag
                            var Ttrigger = (TMobs[i].trigger !== undefined && TMobs[i].trigger === true)? true: false;

                            // clear timer
                            clear(Tname, Ttrigger);

                        }

                    }else{

                        // loop through array
                        for(var i=0; i<TMobs.length; i++){

                            // set a reference to the current related timer's name
                            // according to whether the current array member is an object or a string
                            var timerName = (typeof TMobs[i] === "string")? TMobs[i]: TMobs[i].options.name;

                            //  and clear each associated timer/incrementor
                            clear(timerName);

                        }

                    }

                }else if(typeof TMobs === 'string'){

                    // generic 'clearAll' call has been passed - loop through the TMtimerStorage 
                    // array & cache the timer names from each member then pass them to the 'clear' method...

                    // collect names - feeding the names straight to "clear" changes the array WHILE it's looping, not good for processing...
                    var names = [];
                    for(var i=0; i<window.TMtimerStorage.length; i++){
                        var keys = Object.keys(window.TMtimerStorage[i]);
                        names.push(keys[0]);
                    }

                    // now loop through names array and feed names to clear method
                    for(var i=0; i<names.length; i++){

                        // check for trigger passed as true 
                        // (each timer destroyed should force trigger it's callback)
                        if(trigger){
                            clear(names[i], trigger);
                        }else{
                            clear(names[i]);
                        }
                        
                    }
                }

            },

            // encapsulate the functionality of finding "timers" 
            // key in array of objects passed into tMgmt w/"clearAll" call
            findTimerKey: function(obArr){

                // set return flag
                var timerPresent = false;

                // get first member of obArr array
                var obOne = obArr[0];

                // check that obArr is in fact an object
                if(obOne instanceof Object){

                    // loop through first ob
                    for(var key in obOne){

                        // examine key - is it "timers"?
                        timerPresent = (key === "timer")? true: timerPresent;

                    }

                }

                // return the value
                return timerPresent;

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
                
                // prep timer storage litteral
                var timer = {};
                timer[tMgmt.options.name] = null;
                
                // clear any pre-existing timers with this name
                if(window.TMtimerStorage) this.clearFromWindow(tMgmt.options.name, true);
                
                // push onto window
                window.TMtimerStorage.push(timer);
                
                // declare incremetor for possible use w/this timer
                var newInc = {};
                newInc[tMgmt.options.name] = tMgmt.options.incrementBy || null;
                window.MGMTinc.push(newInc);

                // kick off the timer
                this.timerCreate();

            },

            // add (and kick off) timer functionality to TMtimerStorage array
            timerCreate: function(){

                // store context
                var _self = this;

                // prep action flag to determine if a timeout or an inrterval is being set
                var action = (tMgmt.options.interval === true) ? 'setInterval': 'setTimeout';

                // store index this timer (and it's incrementor) will sit at in their matching arrays
                var index = window.TMtimerStorage.length - 1;

                // store callback with timer so a reference exists that can be force triggered 
                // if needed, w/o an actual $.tMgmt return object
                window.TMtimerStorage[index].callback = options.callback;

                // set up timer w/handle
                window.TMtimerStorage[index][tMgmt.options.name] = window[action](function(){
                    
                    // run callback
                    options.callback();
                    
                    // if this timer is a timeout clear it & remove it
                    if(action === 'setTimeout'){
                        
                        // clear & remove
                        _self.clearFromWindow(tMgmt.options.name, true);
                        
                    }

                    // if this timer is an interval it should be incremented
                    if(action === 'setInterval' && window.MGMTinc[index][tMgmt.options.name] !== null){

                        // de-increment the incrementor if it is greater than 1
                        if(window.MGMTinc[index][tMgmt.options.name] > 1){

                            // de-increment
                            window.MGMTinc[index][tMgmt.options.name] -= 1;

                        }else{

                            // remove it at one
                            _self.clearFromWindow(tMgmt.options.name, true);   

                        }

                    }
                    
                }, tMgmt.options.duration);

            },

            // zero in on an index of the TMtimerStorage array 
            // that holds an object with a key matching a provided name
            getKeyFromName: function(name){

                // loop through the window's storage array
                for(var i=0; i<window.TMtimerStorage.length; i++){

                    // get the key of the current litteral
                    for(key in window.TMtimerStorage[i]){
                        
                        // compare key to name
                        if(key === name){

                            // send back the index
                            return i;

                        }

                    }

                }

                // if no match for the name is found send back false
                return false;
            },

            // clear the timer using a parameter to look for it's name
            clearFromWindow: function(name){

                // apply default value to local
                local = (typeof local === 'undefined')? false: local;

                // if call is local and there is no TMtimerStorage OR it's empty exit processing
                if(local && typeof window.TMtimerStorage === 'undefined'){
                    return false;
                }

                // store context
                var _self = this;

                // see if there's a matching index in the TMtimerStorage array for the name passed
                var nameIndex = this.getKeyFromName(name);

                if(nameIndex === 0 || nameIndex > 0){

                    // clear it
                    clearTimeout(window.TMtimerStorage[nameIndex][name]);
                    clearInterval(window.TMtimerStorage[nameIndex][name]);

                    // remove it from window storage
                    _self.removeTimerIncrementor(nameIndex, 'TMtimerStorage');

                    // also destroy the associated incrementor
                    _self.removeTimerIncrementor(nameIndex, 'MGMTinc');

                }

                // // check nameIndex AND that it's not a local call
                // if(!nameIndex && !local){

                //     // send a warning in the console so the operation doesnt fail completely silently
                //     console.warn('No timer found with the name - '+name);

                // }
                
            },

            // remove specific array members holding timer & incrementor from window storage
            removeTimerIncrementor: function(inc, type){

                // create a place to capture timer handles to keep
                var captureArr = [];

                // loop through the TMtimerStorage array
                for(var i=0; i<window[type].length; i++){

                    // store all members in the captureArr who's IDs dont match the inc parameter
                    if(i != inc){
                        captureArr.push(window[type][i]);
                    }
                }

                // reset window.TMtimerStorage to the value of captureArr
                window[type] = captureArr;


            }

        };

        // generic "clear" method to be called by the user via the plugin
        var clear = function(name, triggerCallback){

            // check if callback is being triggered - process for retrieval oc callback from API,
            // or from tMgmt object passed back in, or from what was stored with the TMtimerStorage array
            if(triggerCallback){

                // the callback to run will be determined by whether or not the plugin is "working return"
                var callback = (workingReturn)? tMgmt.arguments[1].options.callback: options.callback;

                // if workingGenericClearAll - callback will need changing
                var indexNum = privateMethods.getKeyFromName(name);
                callback = (workingGenericClearAll)? window.TMtimerStorage[indexNum].callback: callback;

                // call it...
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

                // set a flag so tMgmt knows to fish out the stored callback - if callback is included
                workingGenericClearAll = true;

                // check for multiple arguments
                if(tMgmt.arguments.length > 1 && tMgmt.arguments[1] !== true){

                    // handle "clearAll" call passed in with tMgmt return object values
                    privateMethods.handleClearAllObs(tMgmt.arguments[1]);

                }else{

                    // looking for sole "clearAll" argument
                    if(tMgmt.arguments.length === 1){

                        // 'clearAll' was the sole argument passed
                        privateMethods.handleClearAllObs(tMgmt.arguments[0]);

                    }else if(tMgmt.arguments[1] === true){

                        // 'clearAll' passed w/2nd arg of true - indicating trigger callback 
                        // for each timer being desttroyed
                        privateMethods.handleClearAllObs(tMgmt.arguments[0], tMgmt.arguments[1]);

                    }


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
