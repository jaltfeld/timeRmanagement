(function ($) {
	module('jQuery.tMgmt - setup');

	var isOb = function(subject){
		return (subject instanceof Object) ? true: false;
	}

	var isFunc = function(subject){
		return ($.isFunction(subject)) ? true: false;
	}

	var isArray = function(subject){
		return ($.isArray(subject)) ? true: false;
	}

	var validOptions = {
		name: 'test',
    	duration: 1000,
    	interval: false,
    	timeout: true,
    	callback: function(){
    		//do something;
    	}
	}

	test('$.tMgmt exists', function(assert){
		assert.notEqual($.tMgmt, undefined, "$.tMgmt should not be undefined if it exists");
		assert.equal(isOb($.tMgmt), true, "$.tMgmt should be an object if it exists");
	});

	test('$.tMgmt default options exist', function(assert){
		var tm = $.tMgmt(undefined)
		assert.notEqual($.tMgmt.options, undefined, "$.tMgmt.options should be defined if exists");
		assert.equal(isOb($.tMgmt.options), true, "$.tMgmt should be an object");
	});

	test('$.tMgmt accepts options', function(assert){
		var tm = $.tMgmt(validOptions);
		assert.equal(tm.options.name, "test", "$.tMgmt.options.name should be set");
	});

	test('$.tMgmt should run checkOptions check function when first instantiated', function(assert){
		var tm = $.tMgmt(validOptions);
		assert.equal(tm.options.name, "test", "$.tMgmt.options.name should be set");
		assert.notEqual(tm.options, {}, "the checkOptions function should pass and not return an empty options litteral");
	});

	test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
		$.tMgmt.options = {};
		var tm1 = $.tMgmt({
        	duration: 1000,
        	interval: false,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm1.options, {}, "$.tMgmt.options is {} - name missing");
		$.tMgmt.options = {};
		var tm2 = $.tMgmt({
			name: 10,
        	duration: 1000,
        	interval: false,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm2.options, {}, "$.tMgmt.options is {} - name not string");
		$.tMgmt.options = {};
		var tm3 = $.tMgmt({
			name: 'test',
        	interval: false,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm3.options, {}, "$.tMgmt.options is {} - duration missing");
		$.tMgmt.options = {};
		var tm4 = $.tMgmt({
			name: 'test',
        	duration: '1000',
        	interval: false,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm4.options, {}, "$.tMgmt.options is {} - duration not number");
		$.tMgmt.options = {};
		var tm5 = $.tMgmt({
			name: 'test',
			duration: 1000,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm5.options, {}, "$.tMgmt.options is {} - interval & timeout missing");
		$.tMgmt.options = {};
		var tm6 = $.tMgmt({
			name: 'test',
        	duration: 1000,
        	interval: true,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm6.options, {}, "$.tMgmt.options is {} - interval & timeout both true");
		$.tMgmt.options = {};
		var tm7 = $.tMgmt({
			name: 'test',
        	duration: 1000,
        	interval: false,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm7.options, {}, "$.tMgmt.options is {} - interval & timeout both false");
		$.tMgmt.options = {};
		var tm8 = $.tMgmt({
			name: 'test',
        	interval: false,
        	timeout: true
		});
		assert.deepEqual(tm8.options, {}, "$.tMgmt.options is {} - callback missing");
		$.tMgmt.options = {};
		var tm9 = $.tMgmt({
			name: 'test',
        	duration: '1000',
        	interval: false,
        	timeout: true,
        	callback: 'new Object'
		});
		assert.deepEqual(tm9.options, {}, "$.tMgmt.options is {} - callback not function");
	});

	test('$.tMgmt.prepStorage method is invoked', function(assert){
		if(window.TMtimerStorage !== undefined){window.TMtimerStorage = undefined}
		if(window.MGMTinc !== undefined){window.MGMTinc = undefined}
		assert.equal(window.TMtimerStorage, undefined, "window.TMtimerStorage should not exist before $.tMgmt is instantiated");
		assert.equal(window.MGMTinc, undefined, "window.MGMTinc should not exist before $.tMgmt is instantiated");
		$.tMgmt(validOptions);
		assert.equal(isArray(window.TMtimerStorage), true, "window.TMtimerStorage should be set after $.tMgmt is instantiated");
		assert.equal(isOb(window.MGMTinc), true, "window.MGMTinc should be set after $.tMgmt is instantiated");
	});

	test('$.tMgmt should register a timer onto the window.TMtimerStorage', function(assert){
		if(window.TMtimerStorage !== undefined){window.TMtimerStorage = undefined}
		var tm = $.tMgmt(validOptions);
		assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt should register a timer to the window.TMtimerStorage array");
	});

	test('if $.tMgmt already has a timer with the same name it should clear it and replace with the new one', function(assert){
		if(window.TMtimerStorage !== undefined){window.TMtimerStorage = undefined}
		var tm1 = $.tMgmt(validOptions);
		assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt has registered 1 timer named 'test'");
		var tm2 = $.tMgmt(validOptions);
		var done = assert.async();
		window.setTimeout(function(){
			assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt has replaced old duplicate with new duplicate");
			done();
		}, 100);
	});

	test('if $.tMgmt has set a timeout $.tMgmt should clear it after the callback has run', function(assert){
		if(window.TMtimerStorage !== undefined){window.TMtimerStorage = undefined}
		var tm = $.tMgmt(validOptions);
		assert.equal(tm.options.timeout, true, "$.tMgmt has been set with a timeout");
		window.setTimeout(function() {
			assert.equal(window.TMtimerStorage.length, 0, "the timeout should be removed from the TMtimerStorage array");
		}, 1100);
	});

	test('$.tMgmt returns back public methods only', function(assert){
		var tm = $.tMgmt(validOptions);
		assert.equal(tm.checkOptions, undefined, "private method 'checkOptions' should not be available");
		assert.equal(tm.prepStorage, undefined, "private method 'prepStorage' should not be available");
		assert.equal(tm.registerTimer, undefined, "private method 'registerTimer' should not be available");
		assert.equal(tm.clearFromWindow, undefined, "private method 'clearFromWindow' should not be available");
		assert.equal(tm.removeTimer, undefined, "private method 'removeTimer' should not be available");
		assert.equal(isFunc(tm.clear), true, "public method 'clear' should be available");
		assert.equal(isFunc(tm.clearAll), true, "public method 'clearAll' should be available");
	});

	module('jQuery.tMgmt - usage');
  
}(jQuery));
