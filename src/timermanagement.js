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

}(jQuery));
