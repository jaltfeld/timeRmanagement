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
                
                // // continue processing...
                
                // // make sure window is ready to store our custom timer handles
                // Manager.prepStorage();
                
                // // create our timer & timer handle & attach the handle to the window
                // Manager.registerTimer();
                
                // // store the object (in element data) to be referenced after the plugin is set and methods are being called (from the object in data)
                // $elem.data('MGMT', Manager);
                
            }else{
                
                // reset $.tMgmt.options to default and send an error message to the console
                console.error('timeRmanagement setup error: Please include with your option object the following properties: name [string], duration [number], timeout OR interval [boolean] and callback [function].');
                $.tMgmt.options = {};
            }
            
        }else{
            
        //     // handle call to method right now...
        //     // check to see that method passed exists
        //     if(this[option]){
                
        //         // run method
        //         this[option](settings);
                
        //     }
            
        //     /*
        //      *  also any other special cases, settings, flags
        //      *  or conditions & etc. can be processed here...
        //      * 
        //      */
            
        }

        // pass back object so it can be set as the value of a variable when used in a project
        return $.tMgmt;   
        
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
        contProc = (options.name && typeof options.name == 'string') ? contProc: false;
        contProc = (options.duration && typeof options.duration == 'number') ? contProc: false;
        contProc = (options.interval == true || options.timeout == true) ? contProc: false;
        contProc = (options.interval == true && options.timeout == true) ? false: contProc;
        contProc = (options.callback != undefined && options.callback instanceof Object) ? contProc: false;
        
        // define flag property indicating this check has run
        $.tMgmt.optionsChecked = true;
        // console.log(contProc);
        return contProc;
        
    }

    // prototype methods generically onto ALL instances
    $.tMgmt.prototype = {
        
        // // check to see if the settings contained anything - exit returning chain if not
        // checkSettings: function(){
            
        //     // set continue processing flag
        //     var contProc = true;
            
        //     // set flag 
        //     contProc = (this.settings.name && typeof this.settings.name == 'string') ? contProc: false;
        //     contProc = (this.settings.duration && typeof this.settings.duration == 'number') ? contProc: false;
        //     contProc = (this.settings.interval == true || this.settings.timeout == true) ? contProc: false;
        //     contProc = (this.settings.interval == true && this.settings.timeout == true) ? false: contProc;
        //     contProc = (this.settings.callback != undefined && this.settings.callback instanceof Object) ? contProc: false;
            
        //     return contProc;
            
        // }
        
        // // prep for timer storage in window
        // prepStorage: function(){
            
        //     // check for timerStorage in data on window object
        //     if(!window.TMtimerStorage){
                
        //         // add the new property to the window object
        //         window.TMtimerStorage = [];
                
        //         // add place for incrementors (if opertion needs) also in window
        //         window.MGMTinc = {};
                
        //     }
            
        // },
        
        // // create the timer functionlity, register it to the window object
        // // & add window object cleanup to callback functionality
        // registerTimer: function(){
            
        //     // store context
        //     var _self = this;
            
        //     // set action flag & handle & empty timer storage litteral
        //     var action = (this.settings.interval == true) ? 'setInterval': 'setTimeout';
        //     var timer = {};
            
        //     // clear any pre-existing timers with this name
        //     this.clearFromWindow(this.settings.name);
            
        //     // set up timer w/handle
        //     timer[this.settings.name] = window[action](function(){
                
        //         // run callback
        //         _self.settings.callback();
                
        //         // if this timer is a timeout clear it & remove it
        //         if(action == 'setTimeout'){
                    
        //             // clear & remove
        //             _self.clearFromWindow(this.settings.name);
                    
        //         }
                
        //     }, this.settings.duration);
            
        //     // declare incremetor for possible use w/this timer
        //     window.MGMTinc[this.settings.name] = this.settings.startingInc;
            
        //     // push onto window
        //     window.TMtimerStorage.push(timer);
            
        // },
        
        // // clear the timer using a parameter to look for it's name
        // clearFromWindow: function(name){
            
        //     // store context
        //     var _self = this;
            
        //     // loop through the window's storage array
        //     for(var i=0; i<window.TMtimerStorage.length; i++){
                
        //         // get the key of the current litteral
        //         for(key in window.TMtimerStorage[i]){
                    
        //             // compare key to name
        //             if(key == name){
                        
        //                 // clear it
        //                 clearTimeout(window.TMtimerStorage[i][key]);
        //                 clearInterval(window.TMtimerStorage[i][key]);
                        
        //                 // remove it from window storage
        //                 _self.removeTimer(i);
                        
        //                 // also destroy the associated incrementor
        //                 window.MGMTinc[this.settings.name] = null;
                        
        //             }
                    
        //         }
                
        //     }
            
        // },
        
        // // remove specific array member holding a timer from window storage
        // removeTimer: function(inc){
            
        //     // slice array member out & destroy
        //     var trash = window.TMtimerStorage.slice(inc, inc+1);
        //     var trash = null;
            
        // },
        
        // // generic "clear" method to be called by the user via the plugin
        // clear: function(name){
            
        //     // pass to this.clearFromWindow
        //     this.clearFromWindow(name);
        //     //console.log('timer "'+name+'" cleared');
        // },
        
        // // remove all timers from window storage (clear everything)
        // clearAll: function(){
            
        //     // store context
        //     var _self = this;
            
        //     // loop through each timer stored in the window
        //     for(var i=0; i<TMtimerStorage.length; i++){
                
        //         // get the key of the litteral
        //         for(key in TMtimerStorage[i]){
                    
        //             // pass to clear method by name
        //             _self.clear(key);
                    
        //         }
                
        //     }
        //     //console.log('all timers cleared');
        // }
        
    }

    return this;

}(jQuery));
