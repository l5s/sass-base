/*
	GLOBALS
*/

var smallScreen = false;
var smallScreenToggles;

function browserResize () {
	
	var windowWidth = $(window).width();

	if (windowWidth < 768) {

		smallScreen = true;

		if ( ! smallScreenToggles.data("l5-collapsibleMenu") ) {
			smallScreenToggles.collapsibleMenu({ toggle: '.toggle-small-screen', collapsible : '.body' });
		}
						
		// @@@ DO STUFF HERE

	} else {
		
		smallScreen = false;
		
		$('#primary-nav').show();
		
		if ( smallScreenToggles.data("l5-collapsibleMenu") ) {
			smallScreenToggles.collapsibleMenu('destroy');
		}
		
		// @@@ DO STUFF HERE
		
	}
}

/*
	FORM VALIDATION DEFAULTS
*/


// VALIDATION MESSAGES
$.extend( $.validator.messages, {
	required: "Required",
	email: "Email Address Invalid"
});

$.validator.setDefaults({
	errorElement : "strong",
	onfocusout : function (element) { 
		$(element).valid();
	},
	onclick : function (element) {
		var $element = $(element);
		
		if ( $element.context.nodeName.toLowerCase() != 'select' ) {
			$(element).valid();
		}
	},
	showErrors : function (errorMap, errorList) {

		this.defaultShowErrors();
		
	},
	unhighlight : function (element, errorClass, validClass) {
		var $element = $(element);
		
		$element.removeClass(errorClass).addClass(validClass);
	}
});

/*
	DOM READY
*/

$(function () {
	
	/*
		RESPONSIVE FUNCTIONALITY
	*/
	
	var resizeDelay;
	
	// INITIALIZE GLOBALS
	smallScreenToggles = $('#body-area');
		
	// INITIALIZE
	browserResize();
	
	$(window).resize(function() {
		
		clearTimeout(resizeDelay);
		resizeDelay = setTimeout(function () {
			
			browserResize();
			
		}, 200);
		
		
	});
	
	
	/*
		CAROUSELS
	*/
	
	$('.carousel').carousel({ speed : 7500, infinite : true, autoSize : true });
	
	var totalItems = $('#total-items'),
			nthItem = $('#nth-item');
			
	$('.overlay-trigger').overlay({ visible : function () {
			$('.multi-carousel').carousel({
				speed : 0,
				autoItemWidth : false,
				init : function ( carousel ) {
					
					var total = carousel.items.filter(':not(.cloned, .empty)').length;
					
					totalItems.html( total );
					nthItem.html( (carousel.currentPage * carousel.visible - carousel.visible + 1) + '-' + ((carousel.currentPage * carousel.visible) > total ? total : carousel.currentPage * carousel.visible) );
					
				},
				afterSlide : function (carousel) {
					
					var total = carousel.items.filter(':not(.cloned, .empty)').length;
					
					nthItem.html( (carousel.currentPage * carousel.visible - carousel.visible + 1) + '-' + ((carousel.currentPage * carousel.visible) > total ? total : carousel.currentPage * carousel.visible) );
					
				}
			});
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
