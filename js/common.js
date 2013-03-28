/*
	GLOBAL VARIABLES
*/

var smallScreen = false;

/*
	DOM READY
*/

$(function () {
	
	$('.carousel').carousel({ speed : 7500, infinite : true, autoSize : true });
	
	var totalItems = $('#total-items'),
			nthItem = $('#nth-item');
			
	$('.overlay-trigger').overlay({ visible : function () {
			$('.multi-carousel').carousel({
				speed : 0,
				autoItemWidth : false,
				init : function (carousel) {
					totalItems.html(carousel.pages);
				},
				afterSlide : function (n) { alert(n);
					nthItem.html(n);
				}
			});
		}
	});
	
	/*
		ON BROWSER RESIZE
	*/
			
	// DETECTS CHANGES TO WINDOW SIZING
	$(window).resize(function() {

		var windowWidth = $(window).width();

		if (windowWidth <= 768) {

			smallScreen = true;
							
			// $('#footer').stickyFooter('relinquish');
			
			// @@@ DO STUFF HERE

		} else {
			
			smallScreen = false;
			
			$('#primary-nav').show();
			
			// $('#footer').stickyFooter('apply');
			
			// @@@ DO STUFF HERE
			
		}

	});
			
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
	IMAGES LOADED
*/

$(window).bind("load", function() {
	// $('#footer').stickyFooter();
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
