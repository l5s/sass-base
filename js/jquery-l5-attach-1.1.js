
/* 

	NAME: JQUERY-L5-ATTACH

	DESCRIPTION: USED TO ATTACH THINGS LIKE TOOLTIPS AND DROPDOWN MENUS TO AN ELEMENT

	DROPDOWN SELECT EXAMPLE:
	
	<a href="#colors-dropdown" class="select-trigger">Select</a>
	<div id="colors-dropdown" class="dropdown hide">
		<ul>
			<li>Red</li>
			<li>Green</li>
			<li>Blue</li>
		</ul>
	</div> <!-- /dropdown -->

	$('.select-trigger').attach ({ 
		event : 'hover',
		relative : true,
		position : 'south',		
		init : function (o) {
					
			o.attached.find('li').bind('click', function () {
				var $target = $(this);
					
				// UPDATE CLASSES
				$target
					.addClass('active')
					.siblings()
					.removeClass('active');
				
				// SET DISPLAY VALUE
				var displayValue = $target.attr('data-display') || $target.html();
				o.element.html(displayValue);
				
				// SET INTERNAL VALUE
				o.element.attr('data-val', $target.attr('data-value'));
				
				// CLOSE TOOLTIP
				o.close();
				
			}).first().click();
		},
		beforeClose : function () {
			process();
		}
	});

	IE PNG FIX EXAMPLE:

	$('.tooltip-trigger').attach ({ 
		show : $.fn.attach.show_IEPNGFix,
		hide : $.fn.attach.hide_IEPNGFix
	});
	
*/

(function ($) {

  $.widget( 'l5.attach', {
		
    options: { 
		
			autoStart : true,
			event : 'hover',
			position : 'north',
			relative : false,
			center : false,
			
			// CSS SELECTOR FOR THE ELEMENT TO ATTACH
			selector : null,
			
			// DEFAULT METHODS FOR SHOWING AND HIDING
			show : function (el, callback) {
				el.fadeIn('fast', function () {
					callback();
				});
			},
			hide : function (el, callback) {
				el.fadeOut('fast', function () {
					callback();
				});
			},
			
			// Callbacks
			init : function () { },
			beforeOpen : function () { },
			beforeClose : function () { },
			afterOpen : function () { },
			afterClose : function () { }
			
    },
		
    _create: function() {
			var o = this;
			var ref = this.element.attr("data-attach") || this.options.selector || this.element.attr("rel") || this.element.attr("href");
			
			// VALIDATE THE SELECTOR
			if ( ! /^#[\w\-]+$/.test( ref ) ) {
				$.error( 'attach: "' +  ref + '" is an invalid selector' );
			}

			this.attached = $(ref);
			
			// DOES IT EXIST?
			if ( this.attached.length == 0 ) {
				$.error( 'attach: "' +  ref + '" is invalid' );
			}
			
			this.side = this.element.attr("data-position") || this.options.position;
			
			// INITIALIZE TOOLTIP
			this.attached
				.hide()
				.css({ position : 'absolute' })
				.click(function (e) { e.stopPropagation(); });
				
			this.delay = null;
			
			// CALLBACK - INITIALIZE
			this.options.init(this);
			
			// ADD EVENTS
			if (this.options.autoStart)
				this.start();
			
			// REPOSITION ON WINDOW RESIZE
			$(window).resize(function() {
				o.align();
			})
			
		},
		
		isOpen : function () {
			return this.attached.is(':visible');
		},
		
		start : function () {
			var o = this;

			switch (o.options.event) {
				
				case 'hover':
				
					o.element.mouseenter(function (e) {
						
						e.stopPropagation();
						
						o.delay = setTimeout (function() {
								o.open();
							}, 200);
						
						$('body').mouseover(function () {
							clearTimeout(o.delay);
							$('body').off('mouseover');
							o.close();
						});
							
					});
					
					o.attached.mouseover(function (e) {
						e.stopPropagation();
					});
					
					break;
					
				case 'click':
				
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';
				
					o.element.bind(event, function () {
						
							if (! o.isOpen())
								o.open(true);
							else
								o.close();
							
							return false;
					});
					
					break;
					
			}

		},
		
		stop : function () {
			clearInterval(this.delay);
			
			var event = o.options.event;
			
			if (event = 'click') {
				event = (navigator.userAgent.match(/iPad/i)) ? 'touchstart' : 'click';
			}
			
			this.element.unbind(event);
		},
		
		open : function ( bodyClick ) {
			var o = this;

			if ( (! this.isOpen()) && (o.options.beforeOpen() != false) ) {
				o.align();
				
				// CLICKING OFF THE TOOLTIP
				if ( bodyClick ) {
					
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';	
										
					$(document).on(event + '.attach', function (e) {
							e.stopPropagation();
							o.close();
							
							return false;
					});
					
				}

				o.element.addClass('active');

				o.options.show(o.attached, o.options.afterOpen);
					
				o.attached.addClass('active');
			}
		},
		
		align : function () {
			var x, y, offset;
			
			if ( ! this.options.relative )
				offset = this.element.offset();
			else
				offset = this.element.position();
						
			this.attached.addClass('position-'+this.side);

			switch (this.side) {
				case 'north' || 'n':
				
					x = offset.left + (this.element.outerWidth() / 2);
					y = offset.top - this.attached.outerHeight();
					
					if (this.options.center)
						y = y + (this.element.outerHeight() / 2);
						
					break;
				case 'northeast' || 'ne':
				
					x = offset.left + this.element.outerWidth() - this.attached.outerWidth();
					y = offset.top;
					
					if (this.options.center)
						y = y + (this.element.outerHeight() / 2);
						
					break;
				case 'northwest' || 'nw':
				
					x = offset.left;
					y = offset.top;
					
					if (this.options.center)
						y = y + (this.element.outerHeight() / 2);
						
					break;
				case 'east' || 'e':
				
					x = offset.left + this.element.outerWidth();
					y = offset.top + (this.element.outerHeight() / 2);
					
					if (this.options.center)
						x = x - (this.element.outerWidth() / 2);
						
					break;
				case 'south' || 's':
				
					x = offset.left + (this.element.outerWidth() / 2);
					y = offset.top + this.element.outerHeight();
					
					if (this.options.center)
						y = y - (this.element.outerHeight() / 2);
						
					break;
				case 'southwest' || 'sw':
				
					x = offset.left;
					y = offset.top + this.element.outerHeight();
					
					if (this.options.center)
						y = y - (this.element.outerHeight() / 2);
						
					break;
				case 'southeast' || 'se':
				
					x = offset.left + this.element.outerWidth();
					y = offset.top + this.element.outerHeight();
					
					if (this.options.center)
						y = y - (this.element.outerHeight() / 2);
						
					break;
				case 'west' || 'w':
				
					x = offset.left - this.attached.outerWidth();
					y = offset.top + (this.element.outerHeight() / 2);
					
					if (this.options.center)
						x = x + (this.element.outerWidth() / 2);
						
					break;
				default:
				
					x = offset.left;
					y = offset.top;
			}

			this.attached.css({ 'top' : y + 'px', 'left' : x + 'px' });
		},
		
		close : function () {
			var o = this;
			
			if ( this.isOpen() && (this.options.beforeClose() != false) ) {
					
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';	
					
					$(document).off(event + '.attach');

					o.element.removeClass('active');
					
					o.options.hide(o.attached, o.options.afterOpen);
					
					o.attached.removeClass('active');
			}
			
		}
		
  });
	
	$.fn.attach.show_IEPNGFix = function (el, callback) {
		if ( $.browser.msie && jQuery.browser.version.split('.')[0] < 9 ){
			el.show();
			callback();
		} else {
			el.fadeIn('fast', function () {
				callback();
			});
		}			
	};
	
	$.fn.attach.hide_IEPNGFix = function (el, callback) {
		if ( $.browser.msie && jQuery.browser.version.split('.')[0] < 9 ){
			el.hide();
			callback();
		} else {
			el.fadeOut('fast', function () {
				callback();
			});
		}			
	}
	
}) (jQuery);
