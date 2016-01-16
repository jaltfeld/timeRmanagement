(function ($) {
	module('jQuery.tMgmt');

	var isOb = function(subject){
		return (subject instanceof Object) ? true: false;
	}

	var isFunc = function(subject){
		return ($.isFunction(subject)) ? true: false;
	}

	var validOptions = {
		name: 'test',
    	duration: 1000,
    	interval: true,
    	timeout: false,
    	callback: function(){console.log('callback')}
	}

	test('$.tMgmt exists', function(assert){
		assert.notEqual($.tMgmt, undefined, "$.tMgmt should be an object if it exists");
	});

	test('$.tMgmt default options exist', function(assert){
		assert.notEqual($.tMgmt.options, undefined, "$.tMgmt.options should be an object if exists");
		assert.equal(isOb($.tMgmt.options), true, "$.tMgmt should be an object");
	});

	test('$.tMgmt accepts options', function(assert){
		$.tMgmt(validOptions);
		assert.equal($.tMgmt.options.name, "test", "$.tMgmt.options should be an object if exists");
	});

	test('$.tMgmt should run a "continue processing" check function when first instantiated', function(assert){
		$.tMgmt(validOptions);
		assert.equal(isFunc($.tMgmt.checkOptions), true, "the checkOptions function should exist");
		assert.equal($.tMgmt.optionsChecked, true, "checkOptions() method set $.tMgmt.optionsChecked property to true");
	});

	test('checkOptions() method continues processing when options are set properly', function(assert){
		$.tMgmt(validOptions);
		assert.notEqual($.tMgmt, null, "$.tMgmt is not null");
	});

	test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
		var tm1 = $.tMgmt({
        	duration: 1000,
        	interval: true,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm1.options, {}, "$.tMgmt.options is {} - name missing");
		var tm2 = $.tMgmt({
			name: 10,
        	duration: 1000,
        	interval: true,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm2.options, {}, "$.tMgmt.options is {} - name not string");
		var tm3 = $.tMgmt({
			name: 'test',
        	interval: true,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm3.options, {}, "$.tMgmt.options is {} - duration missing");
		var tm4 = $.tMgmt({
			name: 'test',
        	duration: '1000',
        	interval: true,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm4.options, {}, "$.tMgmt.options is {} - duration not number");
		var tm5 = $.tMgmt({
			name: 'test',
			duration: 1000,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm5.options, {}, "$.tMgmt.options is {} - interval & timeout missing");
		var tm6 = $.tMgmt({
			name: 'test',
        	duration: 1000,
        	interval: true,
        	timeout: true,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm6.options, {}, "$.tMgmt.options is {} - interval & timeout both true");
		var tm7 = $.tMgmt({
			name: 'test',
        	duration: 1000,
        	interval: false,
        	timeout: false,
        	callback: function(){console.log('callback')}
		});
		assert.deepEqual(tm7.options, {}, "$.tMgmt.options is {} - interval & timeout both false");
		var tm8 = $.tMgmt({
			name: 'test',
        	interval: true,
        	timeout: false
		});
		assert.deepEqual(tm8.options, {}, "$.tMgmt.options is {} - callback missing");
		var tm9 = $.tMgmt({
			name: 'test',
        	duration: '1000',
        	interval: true,
        	timeout: false,
        	callback: 'new Object'
		});
		assert.deepEqual(tm9.options, {}, "$.tMgmt.options is {} - callback not function");
	});
  
}(jQuery));
