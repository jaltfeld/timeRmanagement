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
            options = $.extend({}, $.tMgmt.options, options);
            
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
        
    };

    // Default options.
    $.tMgmt.options = {
    };

    console.log($.tMgmt.options);

}(jQuery));
