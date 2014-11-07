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
				
				// IF TOGGLES ARE NOT INITIALIZED
				if ( ! smallScreenToggles.data("l5-collapsibleMenu") ) {
					
					// INITIALIZE COLLAPSIBLE DRAWERS
					smallScreenToggles.collapsibleMenu({ head: '.toggle-small-screen', collapsible : '.body' });
					
				}

				$('#mega-nav').hide();
	
				
			} else if ( smallScreen !== false ) {
				
				smallScreen = false;
								
				if ( smallScreenToggles.data("l5-collapsibleMenu") ) {
					
					// REMOVE COLLAPSIBLE DRAWERS
					smallScreenToggles.collapsibleMenu('destroy');
					
				}

				$('#mega-nav').show();
				
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
		DATEPICKER
	*/
	
	$( '.datepicker' ).datepicker({ showOn: "button", buttonImage: 'images/icn-calendar.png', buttonImageOnly: true });
	
	/*
		GENERAL FORM VALIDATION
	*/
	
	$("form.validate").each(function() {
		$(this).validate({ ignore: ":hidden" });
	});

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
			
	$('.overlay-carousel-trigger').overlay({ visible : function () {
			$('.multi-carousel').carousel({
				speed : 0,
				autoItemWidth : false,
				init : function ( carousel ) {
					
					var total = carousel.items.filter(':not(.cloned, .empty)').length;
					
					totalItems.html( total );
					nthItem.html( Math.ceil(carousel.currentPage * carousel.visible - carousel.visible + 1) + '-' + Math.ceil((carousel.currentPage * carousel.visible) > total ? total : carousel.currentPage * carousel.visible) );
					
				},
				afterSlide : function (carousel) {
					
					var total = carousel.items.filter(':not(.cloned, .empty)').length;
					
					nthItem.html( Math.ceil(carousel.currentPage * carousel.visible - carousel.visible + 1) + '-' + Math.ceil((carousel.currentPage * carousel.visible) > total ? total : carousel.currentPage * carousel.visible) );
					
				}
			});
		}
	});
			
	$('.overlay-trigger').overlay();
			
	/*
		INIT TOGGLE FOR PRIMARY NAVIGATION
	*/
	
	var megaNav = $('#mega-nav');
	
	$('#toggle-menu').click(function () {
		
		megaNav.slideToggle();
		
		return false;
	});
	
	megaNav.find('> nav > ul > li').each(function ( index ) {
		
		var $target = $(this),
			delay;
		
		$target.find('> a').on({
			/*
			'touchend' : function (e) {
				e.preventDefault();			
				e.target.click();			
			},
			*/
			'click' : function ( event ) {
				if ( smallScreen ) {
					event.preventDefault();
					$target.toggleClass('active');
					return false;
				}
			},
		});
		
		$target.on({
			'mouseenter' : function  ( event ) {
				if ( ! smallScreen ) {
					delay = setTimeout(function () {
						$target.addClass('active');
					}, 200);
				}
			}, 
			'mouseleave' : function ( event ) {
				if ( ! smallScreen ) {
					clearTimeout(delay);
					$target.removeClass('active');
				}
			}
		});		
		
	});

	/*
		SEARCH DROPDOWN
	*/
	
	var search = $('#search-input').attach({ 
			selector : '#search-results',
			autoStart : false,
			relative : true,
			position : 'southeast'
		}).on({
			'keypress' : function () {
				search.attach('open', true);
			},
			'focusout' : function () {
				//search.attach('close');
			}
		});
	
	$('#search-results .close-btn').click(function () {
		
		search.attach('close');
		
		return false;
	});
	
});

/*
	IMAGES LOADED
*/

$(window).bind("load", function() {
	
	// ADJUST CAROUSEL SIZING AFTER IMAGES LOAD
	$('.carousel').resize();
	
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
