/*
	GLOBAL VARIABLES
*/

var smallScreen = false;

/*
	DOM READY
*/

$(function () {
	
	/*
		ON BROWSER RESIZE
	*/
	
	if ( ! ($.browser.msie && jQuery.browser.version.split('.')[0] < 9) ){
		
		// DETECTS CHANGES TO WINDOW SIZING
		$(window).resize(function() {
	
			var windowWidth = $(window).width();
	
			if (windowWidth <= 768) {
	
				smallScreen = true;
				
				// @@@ DO STUFF HERE
	
			} else {
				
				smallScreen = false;
	
				// @@@ DO STUFF HERE
				
			}
	
		}).resize();
		
	}
	
	/*
		INIT TOGGLE FOR PRIMARY NAVIGATION
	*/
	
	var primaryNav = $('#primary-nav');
	
	$('#toggle-menu').click(function () {
		
		primaryNav.slideToggle();
		
		return false;
	});
	
});

/*
	AVOID CONSOLE ERRORS IN IE - HTML5 BOILERPLATE
*/

(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
