/*
	JQUERY LEVEL5 CAROUSEL
	
	RESPONSIVE:
	
	<script>
		$(function () {
			$('.carousel').carousel({ autoSize : true });
		});		
	</script>

	<div id="feature">
		<div class="carousel">
			<div class="frame">
				<ul>
					<li><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
					<li><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
					<li><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
				</ul>
			</div> <!-- /.frame -->
		</div> <!-- /carousel -->
	</div> <!-- /feature -->
	
*/

(function( $ ) {
	
	function repeat(str, num) {
		return new Array( num + 1 ).join( str );
	}
	
	$.widget( 'l5.carousel', {
		
		// default options
		options: {
			autoSize : false,	// SIZES TO ITS PARENT CONTAINER
			speed : 7500,
			infinite : true,
			insertNavigation : true,
			onInterval : function () {}
		},
		
		reset : function () {
			
			// SET ITEM WITH
			this.itemWidth = this.items.filter(':first').outerWidth();
			
			// RESET POSITION
			this.windowFrame.scrollLeft(this.itemWidth * this.visible * this.currentPage);
			
		},
		
		autoSize : function () {
			
			// GET WIDTH OF PARENT
			var w = this.element.parent().width();

			this.element.width(w);
			this.windowFrame.width(w);
			this.items.width(w);

			// GET HEIGHT OF IMAGE
			var h = this.items.filter(':first').find('> img').height();
					
			this.element.height(h);
			this.windowFrame.height(h);
			this.items.height(h);
			
			this.itemWidth = w;
		},
		
		_create: function() {
			
			var self = this;

			this.currentPage = 1;			
			this.windowFrame = $('> div', this.element).css('overflow', 'hidden');
			this.slide = this.windowFrame.find('> ul');
			this.items = this.slide.find('> li');
			
			if ( this.options.autoSize ) {
				
				this.autoSize();
				
				$(window).resize(function () {
					
					self.autoSize();
					
					// RESET POSITION
					self.windowFrame.scrollLeft(self.itemWidth * self.visible * self.currentPage);
					
				});
				
			} else {
				this.itemWidth = this.items.filter(':first').outerWidth();
			}
				
			this.visible = Math.ceil(this.windowFrame.innerWidth() / this.itemWidth);
			this.pages = Math.ceil(this.items.length / this.visible);
			
			this.autoAdvanceTimer = null;
			this.pageIndicators = null;
			
			// IF MORE THAN ONE PAGE
			if (this.pages > 1) {
				
				if (this.options.infinite) {
					
					// 1. Pad so that 'visible' number will always be seen, otherwise create empty items
					if ((this.items.length % this.visible) != 0) {
						this.slide.append(repeat('<li class="empty" />', this.visible - (this.items.length % this.visible)));
						this.items = this.slide.find('> li');
					}
					
					// 2. Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
					this.items.filter(':first').before(this.items.slice(- this.visible).clone().addClass('cloned'));
					this.items.filter(':last').after(this.items.slice(0, this.visible).clone().addClass('cloned'));
					this.items = this.slide.find('> li'); // reselect
					
					// 3. Set the left position to the first 'real' item
					this.windowFrame.scrollLeft(this.itemWidth * this.visible);
				}
				
				// ADD NAV ELEMENTS
				if (this.options.insertNavigation)
					this.insertNavigation();
				
				// HOOK UP PAGE INDICATORS
				this.pageIndicators = $('.pages', this.element);
				if (this.pageIndicators.length > 0) {
					for (var i = 1; i <= this.pages; i++) {
						$('<a href="#">' + i + '</a>').click(function() {
							self.goto( parseInt($(this).html()) );																						
							return false;
						}).appendTo(this.pageIndicators);
					}
					$('a:first', this.pageIndicators).addClass('active');
				}
							
				// 5. Bind to the forward and back buttons
				$('a.back', this.element).click(function () {
					self.prev();												
					return false;																						
				});
				
				$('a.forward', this.element).click(function () {
					self.next();												
					return false;
				});
			}
		
			// START CAROUSEL
			if (this.options.speed > 0 && this.pages > 1) {
				this.start();
				this.element.mouseenter(function () {
					self.stop();
					self.start();
				})
			};
	
		},
		
		insertNavigation : function ( ) {
			
			this.windowFrame

				// INSERT ARROWS
				.after('<a class="arrow back">Back</a><a class="arrow forward">Next</a>')
				
				// ADD CONTAINER FOR PAGE INDICATORS
				.after('<div class="pages"></div>');
			
		},
		
		start : function ( ) {
			var self = this;
			
			if ( ! this.autoAdvanceTimer ) {
				this.autoAdvanceTimer = setInterval (function () {
						self._goto( self.currentPage + 1 );																						
					}, this.options.speed);
			}
		},
		
		stop : function ( ) {
			if ( this.autoAdvanceTimer ) {
				clearInterval(this.autoAdvanceTimer);
				this.autoAdvanceTimer = null;
			}
		},
		
		goto : function ( page ) {
			this.stop();
			this._goto(page);
			this.start();
		},

		_goto : function ( page ) {
			if ( this.options.infinite ) {
				this._gotoInfinite( page );
			} else {
				this._gotoFinite( page );
			}				
		},
		
		_gotoFinite : function ( page ) {
			var self = this,
					dir = page < this.currentPage ? -1 : 1,
					n = Math.abs(this.currentPage - page),
					left = this.itemWidth * dir * this.visible * n;
			
			// RESET POSITION WHEN OUTSIDE LIMITS
			if (page > this.pages) {
				left = this.itemWidth * this.pages * -1;
				page = 1;
			} else if (page < 1) {
				left = this.itemWidth * (this.pages - 1);
				page = this.pages;
			}

			// ANIMATE CAROUSEL			
			this.windowFrame.filter(':not(:animated)').animate({
						scrollLeft : '+=' + left
					}, 500, function () {
						
						// UPDATE PAGE INDICATORS
						$('a:nth-child(' + self.currentPage + ')', self.pageIndicators).removeClass('active');
						$('a:nth-child(' + page + ')', self.pageIndicators).addClass('active');
						self.currentPage = page;
						
						// CALLBACK FUNCTION
						self.options.onInterval(this.currentPage);
			});                
		},		
		
		_gotoInfinite : function ( page ) {
			var self = this,
					dir = page < this.currentPage ? -1 : 1,
					n = Math.abs(this.currentPage - page),
					left = this.itemWidth * dir * this.visible * n;
			
			// ANIMATE CAROUSEL
			this.windowFrame.filter(':not(:animated)').animate({
						scrollLeft : '+=' + left
					}, 500, function () {
						
						if (page == 0) {
							
							// POSITION AT THE END
							self.windowFrame.scrollLeft(self.itemWidth * self.visible * self.pages);
							page = self.pages;
							
						} else if (page > self.pages) {
							
							// RESET BACK TO STARTING POSITION
							self.windowFrame.scrollLeft(self.itemWidth * self.visible);
							page = 1;
							
						} 
						
						// UPDATE PAGE INDICATORS
						$('a:nth-child(' + self.currentPage + ')', self.pageIndicators).removeClass('active');
						$('a:nth-child(' + page + ')', self.pageIndicators).addClass('active');
						self.currentPage = page;
						
						// CALLBACK FUNCTION
						self.options.onInterval( self.currentPage );
			
			});                
	
		},
		
		next : function ( ) {
			this.goto( this.currentPage + 1 );
		},
		
		prev : function ( ) {
			this.goto( this.currentPage - 1 );
		},

    _setOption: function( key, value ) {

			this.options[ key ] = value;
			
      // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
      $.Widget.prototype._setOption.apply( this, arguments );
			// For UI 1.9 the _super method can be used instead
			// this._super( "_setOption", key, value );

    }
		
	});
	
}( jQuery ) );

