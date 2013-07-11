/*
	GLOBALS
*/

var smallScreen = false;

/*
	RESPONSIVE FUNCTIONALITY
*/

// TEST MEDIA QUERIES SUPPORT
if ( Modernizr.mq('only all') ) {
	
	$(function () {
		
		var smallScreenToggles = $('#body-area'),
			resizeDelay;
			
		function browserResize () {
		
			if ( Modernizr.mq('only screen and (max-width: 767px)') && ! smallScreen ) {		
		
				smallScreen = true;
		
				if ( ! smallScreenToggles.data("l5-collapsibleMenu") ) {
					
					// INITIALIZE COLLAPSIBLE DRAWERS
					smallScreenToggles.collapsibleMenu({ toggle: '.toggle-small-screen', collapsible : '.body' });
					
				}
	
				
			} else if ( smallScreen !== false ) {
				
				smallScreen = false;
				
				// ENSURE MEGANAV ISN'T HIDDEN
				$('#mega-nav').show();
				
				if ( smallScreenToggles.data("l5-collapsibleMenu") ) {
					
					// REMOVE COLLAPSIBLE DRAWERS
					smallScreenToggles.collapsibleMenu('destroy');
					
				}
				
			}
		}
		
		// INITIALIZE
		browserResize();
		
		$(window).resize(function() {
			
			// CLEAR UNACTUALIZED TIMEOUT
			clearTimeout(resizeDelay);
			
			resizeDelay = setTimeout(function () {
				
				browserResize();
				
			}, 200);
			
		});
			
	});
	
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
		DYNAMICALLY SET LINEHEIGHT TO THE HEIGHT OF THE PARENT
	*/
	
	$('.js-valign-text').each(function () {
		var $target = $(this),
				h = $target.height();
		
		$target.css({ 'line-height' : h + 'px' });
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
	
	var megaNav = $('#mega-nav');
	
	$('#toggle-menu').click(function () {
		
		megaNav.slideToggle();
		
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
