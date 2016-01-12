(function ($) {
	module('jQuery.tMgmt');

	test('$.tMgmt exists', function(){
		notEqual($.tMgmt, undefined, "$.tMgmt should be an object if it exists");
	});

	test('$.tMgmt default options exist', function(){
		notEqual($.tMgmt.options, undefined, "$.tMgmt.options should be an object if exists");
	});

	test('$.tMgmt accepts options', function(){
		var tm = $.tMgmt({"option1":"value1", "option2":"value2"});
		console.log(tm);
		equal($.tMgmt.options.length, 0, "$.tMgmt should be accepting options and over-writing defaults");
	});
  
}(jQuery));
