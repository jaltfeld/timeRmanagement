# timeRmanagement

> A jQuery plugin for working with timers.

Everybody knows that if your working with timers you want one of 2 things ...either to wait a little while and then execute some code ...or to execute some code every few moments like clockwork, until you no longer need to.  In the contemporary landscape of single page javascript applications (where the browser rarely, if ever reloads), if you are working with a timer heavy project, an un-cleared timer, or somehow lost, reset or removed handle can cause logistics nightmares – I know because it happened to me ...so I wrote this plugin to deal with them.

The timeRmanagement plugin is a timer factory (for both timouts and intervals) which takes a few parameters and returns a timer object.  The timer object can be used to clear the timer set or if you have  more than one timer the plugin itself can be used to clear any combination of these timers...




## Setting a timer

timeRmanagement takes the a single object literal argument of options, which contains...

```html
  name                  //string: name of your timer ex: 'myTimer'
  duration              //number: duration of the timeout or interval 
  timeout (or interval) //boolean: choose one, true if it's a timeout OR false if it's an interval
  incrementBy           //number: optional & only for intervals set this to cycle "x" amount or omit it to go indefinitely
  callback              //function: will run at the end of a timeout or every interval just like a regular timer
  
  // in action it looks like...
  var validOptions = {
  	name: 'itsATimout',
  	duration: 5000,
  	timeout: true,
  	callback: function() {
  		alert('times up!')
  	}
  }
  
  // or...
  var validOptions = {
    name: 'nowItsAnInterval',
  	duration: 5000,
  	interval: true,
  	incrementBy: 10,     //This will run 10 times & stop - or leave it out to let it run indefinitely (clear it manually later)
  	callback: function() {
  		alert('another five seconds went by!');
  	}
  }
```

Calling timeRmanagement returns a timeRmanagement object.

```html
  var myTimer = $.tMgmt(validOptions);
```



## Clearing a timer

The timeRmanagement return object contains 'options' (the options object it was created with), and a 'clear' method.

Once the timeRmanagement timer has been set and the return object handed back it can be cleared by calling the clear method against it and passing the name of the timer as an argument to the call.

```html
  myTimer.clear('myTimerName');

  // or if you cant remember the name
  myTimer.clear(myTimer.options.name);
  
  // you can also just call the plugin 
  // referencing the clear method in string form as the first argument 
  // and feed the timeRmanagement return object as the second...
  $.tMgmt('clear', myTimer);
```



## Forcing callback on clear

If you would like to force the callback to run when the timer is cleared you can pass 'true' as a second argument and timeRmanagement will trigger the callback when the timer is removed.

```html
  // forcing callback will work with all of these calls as well...

  myTimer.clear('myTimerName', true);
  
  myTimer.clear(myTimer.options.name, true);
  
  // using this method will make your “force trigger” callback flag the 3rd argument...
  $.tMgmt('clear', myTimer, true);
```



## Multiple Timers – Clearing all timers

If you have set multiple timers with timeRmanagement and you would like to clear them all there is a conveinience method on the plugin itself to do this, which can be invoked by passing an argument of 'clearAll' – any callbacks set on timers being cleared with this method can also be force triggered as well...

```html
  $tMgmt('clearAll');

  // add the true again as the second parameter to force trigger 
  // callbacks of any of the timers clearing that have callbacks
  $.tMgmt('clearAll', true);
```



## Multiple Timers – Clearing only specific timers

If you have multiple timers set with timeRmanagement & would like to clear more than one but not all, the convenience method can still be referenced - but in order to zero in on the timers you would like to destroy, and leave the rest, an array of destroyable timers must be passed in as a second argument...

```html
  // set timers
  var timer1 = $.tMgmt(timerOneOptions);    //timerOneOptions.options.name = 'timerOne';
  var timer2 = $.tMgmt(timerTwoOptions);    //timerTwoOptions.options.name = 'timerTwo';
  var timer3 = $.tMgmt(timerThreeOptions);  //timerThreeOptions.options.name = 'timerThree';
  var timer4 = $.tMgmt(timerFourOptions);   //timerFourOptions.options.name = 'timerFour';
  
  // timers can be collected as an array of return objects OR an array of names
  // either of the following will work...
  var timers = [timer1, timer2, timer4];
  
  // OR
  
  var timers = ['timerOne', 'timerTwo', 'timerFour'];
  
  // then called...
  $.tMgmt('clearAll', timers);
  
  // will leave timer3 running
```



## Multiple Timers – Clearing some & force triggering callbacks

timeRmanagement is also able to force trigger callbacks when clearing a specified group of timers using the 'clearAll' convenience method.  In this instance instead of an array of timer objects or their names it will take an array of string litteral datastructures featuring a manditory 'timer' key and an optional 'trigger'...

```html
  // using the same timers set as in the example above...

  // the timer property can be set as the $.tMgmt return object OR the name of the timer
  var timers = [
  		{
  			timer: timer1, //or could be 'timerOne'
  			trigger: true  //if you do not need to force trigger callback simply omit 
  		},
  		{
  			 timer: 'timerTwo' //or could be timer2
  		},
  		{
  			timer: timer4,
  			trigger: true
  		}
  	];
  
  // then called...
  $.tMgmt('clearAll', timers);
  
  // will clear & force trigger callbacks on timer1 & timer4
  // will clear timer2 w/o forcing callback
  // will leave timer3 running
```


## License

MIT © Jonathan Altfeld
