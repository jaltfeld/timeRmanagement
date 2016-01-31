(function ($, TM) {

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
    	timeout: true,
    	callback: function(){
    		//do something;
    	}
	}

	module('jQuery.tMgmt - confirmation', function(hook) {

		hook.beforeEach(function(){
			$.tMgmt = TM;
		});

		hook.afterEach(function(){
			delete $.tMgmt;
		});

		test('$.tMgmt exists', function(assert){
			assert.notEqual($.tMgmt, undefined, "$.tMgmt should not be undefined if it exists");
			assert.equal(isOb($.tMgmt), true, "$.tMgmt should be an object if it exists");
		});

		test('$.tMgmt default options exist', function(assert){
			var tm = $.tMgmt(undefined)
			assert.notEqual($.tMgmt.options, undefined, "$.tMgmt.options should be defined if exists");
			assert.equal(isOb($.tMgmt.options), true, "$.tMgmt should be an object");
		});

	});

	module('jQuery.tMgmt - setup', function(hook) {

		hook.beforeEach(function(){
			$.tMgmt = TM;
		});

		hook.afterEach(function(){
			delete $.tMgmt;
			delete $.TMtimerStorage;
			delete $.MGMTinc;
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
			var tm1 = $.tMgmt({
	        	duration: 1000,
	        	timeout: true,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm1.options, {}, "$.tMgmt.options is {} - name missing");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm2 = $.tMgmt({
				name: 10,
	        	duration: 1000,
	        	timeout: true,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm2.options, {}, "$.tMgmt.options is {} - name not string");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm3 = $.tMgmt({
				name: 'test',
	        	timeout: true,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm3.options, {}, "$.tMgmt.options is {} - duration missing");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm4 = $.tMgmt({
				name: 'test',
	        	duration: '1000',
	        	timeout: true,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm4.options, {}, "$.tMgmt.options is {} - duration not number");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm5 = $.tMgmt({
				name: 'test',
				duration: 1000,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm5.options, {}, "$.tMgmt.options is {} - interval & timeout missing");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm6 = $.tMgmt({
				name: 'test',
	        	duration: 1000,
	        	interval: true,
	        	timeout: true,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm6.options, {}, "$.tMgmt.options is {} - interval & timeout both true");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm7 = $.tMgmt({
				name: 'test',
	        	duration: 1000,
	        	interval: false,
	        	timeout: false,
	        	callback: function(){console.log('callback')}
			});
			assert.deepEqual(tm7.options, {}, "$.tMgmt.options is {} - interval & timeout both false");
		});

		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm8 = $.tMgmt({
				name: 'test',
	        	timeout: true
			});
			assert.deepEqual(tm8.options, {}, "$.tMgmt.options is {} - callback missing");
		});
		
		test('checkOptions() method ends processing/sets $.tMgmt.options to {} when options are not properly', function(assert){
			var tm9 = $.tMgmt({
				name: 'test',
	        	duration: '1000',
	        	timeout: true,
	        	callback: 'new Object'
			});
			assert.deepEqual(tm9.options, {}, "$.tMgmt.options is {} - callback not function");
		});

		test('$.tMgmt.prepStorage method is invoked', function(assert){
			$.tMgmt(validOptions);
			assert.equal(isArray(window.TMtimerStorage), true, "window.TMtimerStorage should be set after $.tMgmt is instantiated");
			assert.equal(window.TMtimerStorage.length, 1, "window.TMtimerStorage should only have the timer that was just set");
			assert.equal(isArray(window.MGMTinc), true, "window.MGMTinc should be set after $.tMgmt is instantiated");
			assert.equal(window.MGMTinc.length, 1, "window.MGMTinc should only have the incrementor corresponding to the timer that was just set");
		});

		test('$.tMgmt should register a timer onto the window.TMtimerStorage', function(assert){
			var tm = $.tMgmt(validOptions);
			assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt should register a timer to the window.TMtimerStorage array");
		});

		test('$.tMgmt returns back public methods only', function(assert){
			var tm = $.tMgmt(validOptions);
			assert.equal(tm.checkOptions, undefined, "private method 'checkOptions' should not be available");
			assert.equal(tm.prepStorage, undefined, "private method 'prepStorage' should not be available");
			assert.equal(tm.registerTimer, undefined, "private method 'registerTimer' should not be available");
			assert.equal(tm.clearFromWindow, undefined, "private method 'clearFromWindow' should not be available");
			assert.equal(tm.removeTimer, undefined, "private method 'removeTimer' should not be available");
			assert.equal(tm.removeIncrementor, undefined, "private method 'removeIncrementor' should not be available");
			assert.equal(isFunc(tm.clear), true, "public method 'clear' should be available");
			assert.equal(isFunc(tm.clearAll), true, "public method 'clearAll' should be available");
		});
		
	});


	module('jQuery.tMgmt - usage', function(hook) {

		hook.beforeEach(function(){
			$.tMgmt = TM;
		});

		hook.afterEach(function(){
			delete $.tMgmt;
			delete $.TMtimerStorage;
			delete $.MGMTinc;
			delete window.calltest;
			delete window.activeFlag;
		});

		var validOptionsInc = {
			name: 'test',
	    	duration: 1000,
	    	interval: true,
	    	incrementBy: 3,
	    	callback: function(){
	    		// console.log('hello');
	    	}
		}

		var validOptionsIncCancelEarly = {
			name: 'test',
	    	duration: 1000,
	    	interval: true,
	    	incrementBy: 4,
	    	callback: function(){
	    		window.calltest += 1;
	    		// console.log(window.calltest);
	    	}
		}

		var validOptionsIntervalNoInc = {
			name: 'test',
	    	duration: 500,
	    	interval: true,
	    	callback: function(){
	    		window.calltest += 1;
	    		// console.log(window.calltest);
	    	}
		}

		var validOptionsCallback = {
			name: 'test',
	    	duration: 1000,
	    	timeout: true,
	    	callback: function(){
	    		window.calltest = true;
	    	}
		}

		var validOptionsTimeoutClearEarly = {
			name: 'test',
	    	duration: 3000,
	    	timeout: true,
	    	callback: function(){
	    		window.calltest = true;
	    	}
		}

		test('$.tMgmt has a timer/incrementor, registering a duplicate should clear the old ones and replace with the new ones', function(assert){
			var tm1 = $.tMgmt(validOptions);
			assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt has registered 1 timer named 'test'");
			assert.equal(window.MGMTinc.length, 1, "$.tMgmt has registered 1 incrementor named 'test'");
			var tm2 = $.tMgmt(validOptions);
			var done = assert.async();
			window.setTimeout(function(){
				assert.equal(window.TMtimerStorage.length, 1, "$.tMgmt has replaced old timer with new timer");
				assert.equal(window.MGMTinc.length, 1, "$.tMgmt has replaced old incrementor with new incrementor");
				done();
			}, 100);
		});

		test('setting a timeout with a callback should cause the callback to trigger when it ends', function(assert){
			window.calltest = null;
			var tm = $.tMgmt(validOptionsCallback);
			var done1 = assert.async();
			var done2 = assert.async();
			setTimeout(function(){
				assert.equal(window.calltest, null, 'timeout not done, callback has not fired');
				done1();
			}, 950);
			setTimeout(function(){
				assert.equal(window.calltest, true, 'timeout done, callback has fired');
				done2();
			}, 1050);
		});

		test('if $.tMgmt has set a timeout $.tMgmt should clear it after the callback has run', function(assert){
			var tm = $.tMgmt(validOptions);
			assert.equal(tm.options.timeout, true, "$.tMgmt has been set with a timeout");
			window.setTimeout(function() {
				assert.equal(window.TMtimerStorage.length, 0, "the timeout should be removed from the TMtimerStorage array");
			}, 1100);
		});	

		test('if a timeout is set, it should be possible to manually clear & remove it before it finishes', function(assert){
			window.calltest = null;
			var tm = $.tMgmt(validOptionsTimeoutClearEarly);
			var done1 = assert.async();
			var done2 = assert.async();
			setTimeout(function(){
				tm.clear('test');
				assert.equal(window.calltest, null, 'timeout cleared before callback could be fired');
				done1();
			}, 1000);
			setTimeout(function(){
				assert.equal(window.TMtimerStorage.length, 0, 'timer cleared and removed from storage');
				assert.equal(window.MGMTinc.length, 0, 'incrementor cleared and removed from storage');
				assert.equal(window.calltest, null, 'callback was negated');
				done2();
			}, 1050);
		});

		test('if a timeout is set, and manually cleared before completed - its should be possible to force the callback to fire early', function(assert){
			window.calltest = null;
			var tm = $.tMgmt(validOptionsTimeoutClearEarly);
			var done = assert.async();
			setTimeout(function(){
				tm.clear('test', true);
			}, 1000);
			setTimeout(function(){
				assert.equal(window.TMtimerStorage.length, 0, 'timer cleared and removed from storage');
				assert.equal(window.MGMTinc.length, 0, 'incrementor cleared and removed from storage');
				assert.equal(window.calltest, true, 'callback was forced');
				done();
			}, 1050);
		});

		test('if an interval w/callback (and no incrementor) is set, it should be able to be manually cancelled', function(assert){
			window.calltest = 0;
			// window.activeFlag = true;
			var tm = $.tMgmt(validOptionsIntervalNoInc);
			var done = assert.async();
			setTimeout(function(){
				tm.clear('test');
			}, 1550);
			setTimeout(function(){
				assert.equal(window.TMtimerStorage.length, 0, 'timer cleared and removed from storage');
				assert.equal(window.MGMTinc.length, 0, 'incrementor storage wiped');
				assert.equal(window.calltest, 3, 'callback was not forced an extra time');
				done();
			}, 1600);
		});

		test('if an interval w/callback (and no incrementor) is set, it should be able to be manually cancelled, and callback force triggered with cancellation', function(assert){
			window.calltest = 0;
			// window.activeFlag = true;
			var tm = $.tMgmt(validOptionsIntervalNoInc);
			var done = assert.async();
			setTimeout(function(){
				tm.clear('test', true);
			}, 1550);
			setTimeout(function(){
				assert.equal(window.TMtimerStorage.length, 0, 'timer cleared and removed from storage');
				assert.equal(window.MGMTinc.length, 0, 'incrementor storage wiped');
				assert.equal(window.calltest, 4, 'callback was forced an extra time');
				done();
			}, 1600);
		});

		test('if interval is set to true w/optional incrementBy property, interval should run that many times', function(assert){
			var tm = $.tMgmt(validOptionsInc);
			var done1 = assert.async();
			var done2 = assert.async();
			var inc = 2;
			var intHandle = window.setInterval(function(){
				if(inc == 1){
					assert.equal(window.MGMTinc[0].test, 1, 'the test incrementor should be down to one');
					done1();	
				}
				if(inc == 0){
					assert.equal(window.MGMTinc.length, 0, 'the test incrementor should be removed');
					done2();
					clearInterval(intHandle);
				}
				inc--;
			}, 1000);
		});

		test('if interval is set w/optional incrementBy property, it should be able to be stopped early and cleared - before incrementor runs out', function(assert){
			window.calltest = 0;
			var tm = $.tMgmt(validOptionsIncCancelEarly);
			var done1 = assert.async();
			var done2 = assert.async();
			var inc = 3;
			var intHandle = window.setInterval(function(){
				if(inc == 2){
					assert.equal(window.MGMTinc[0].test, 2, 'the test incrementor should be down to two - preparing to cancel');
					tm.clear('test');
					done1();	
				}
				if(inc == 1){
					assert.equal(window.MGMTinc.length, 0, 'the test incrementor should be removed');
					assert.equal(window.calltest, 2, 'Callback should have fired twice');
					done2();
					clearInterval(intHandle);
				}
				inc--;
			}, 1000);
		});

		test('if interval is set w/optional incrementBy property, it should be able to be stopped early and cleared, before incrementor runs out - AND callback force triggered an extra time', function(assert){
			window.calltest = 0;
			var tm = $.tMgmt(validOptionsIncCancelEarly);
			var done1 = assert.async();
			var done2 = assert.async();
			var inc = 3;
			var intHandle = window.setInterval(function(){
				if(inc == 2){
					assert.equal(window.MGMTinc[0].test, 2, 'the test incrementor should be down to two - preparing to cancel');
					tm.clear('test', true);
					done1();	
				}
				if(inc == 1){
					assert.equal(window.MGMTinc.length, 0, 'the test incrementor should be removed');
					assert.equal(window.calltest, 3, 'Callback should have fired twice & force triggered a 3rd time');
					done2();
					clearInterval(intHandle);
				}
				inc--;
			}, 1000);
		});
	});

	module('jQuery.tMgmt - timer object as argument', function(hook) {

		hook.beforeEach(function(){
			$.tMgmt = TM;
		});

		hook.afterEach(function(){
			delete $.tMgmt;
			delete $.TMtimerStorage;
			delete $.MGMTinc;
		});

		var validOptionsIntervalNoInc = {
			name: 'test',
	    	duration: 500,
	    	interval: true,
	    	callback: function(){
	    		// do something
	    	}
		}

		test('$.tMgmt should be able to clear timer by passing timer ob into $.tMgmt call (1st arg) w/a string rerference to the "clear" method as a 2nd arg', function(assert){
			var tm = $.tMgmt(validOptionsIntervalNoInc);
			$.tMgmt('clear', tm);
			assert.equal(window.TMtimerStorage.length, 0, "$.tMgmt should have cleared the timer");
			assert.equal(window.MGMTinc.length, 0, "$.tMgmt should have cleared the incrementor");
		});

	});
  
}(jQuery, tMgmt));
