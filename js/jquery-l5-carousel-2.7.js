/*
	JQUERY LEVEL5 CAROUSEL
	
	RESPONSIVE EXAMPLE:
	
	<script>
		$(function () {
			$('.carousel').carousel();
		});		
	</script>

	<div class="carousel">
		<div class="frame">
			<ul>
				<li data-label="First"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
				<li data-label="Second"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
				<li data-label="Third"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
			</ul>
		</div> <!-- /.frame -->
	</div> <!-- /carousel -->
	
	EXAMPLE:
	
	<script>
		$(function () {
			$('.carousel').carousel({ insertNav : false });
		});		
	</script>

	<div class="carousel">
		<div class="frame">
			<ul>
				<li data-label="First"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
				<li data-label="Second"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
				<li data-label="Third"><img src="http://placehold.it/940x250&text=Feature" width="100%" /></li>
			</ul>
		</div> <!-- /.frame -->
		<a class="arrow back"><span>Back</span></a>
		<a class="arrow forward"><span>Next</span></a>
		<div class="carousel-indicators">
			<a href="#" class="carousel-slide-1" data-slide="1"><span>1</span></a>
			<a href="#" class="carousel-slide-2" data-slide="2"><span>2</span></a>
			<a href="#" class="carousel-slide-3" data-slide="3"><span>3</span></a>
		</div> <!-- /carousel-indicators -->
	</div> <!-- /carousel -->
	
*/

(function( $ ) {
	
	function repeat(str, num) {
		return new Array( num + 1 ).join( str );
	}
	
	$.widget( 'l5.carousel', {
		
		// default options
		options: {
			
			speed : 7500,
			infinite : true,
			insertNav : true,
			
			// RESPONSIVE OPTIONS
			autoSize : true,
			autoItemWidth : true,
			
			// CALLBACKS
			init : function () {},
			beforeResize : function () {},
			afterResize : function () {},
			beforeSlide : function () {},
			afterSlide : function () {}
			
		},
		
		autoSize : function () {
			
			// SET THE WIDTH OF THE INNER ITEMS
			
			var width = this.element.width(); // CAROUSEL WIDTH; EXCLUDES ANY PADDING

			this.windowFrame.width(width);
			
			if ( this.options.autoItemWidth ) {
				this.items.width(width - ( this.items.innerWidth() - this.items.width() ) ); // SET ITEM WIDTH MINUS ANY PADDING
				this.itemWidth = width;
			}

			// SET THE HEIGHT BASED ON THE INNER ITEMS
			
			var height = this.items.filter(':first').outerHeight();
			
			this.element.height(height);
			this.windowFrame.height(height);
							
		},
		
		_create: function() {
			
			var self = this;

			this.currentPage = 1;			
			this.windowFrame = $('> .frame', this.element).css('overflow', 'hidden');
			this.slide = this.windowFrame.find('> ul');
			this.items = this.slide.find('> li');
			this.itemWidth = this.items.filter(':first').outerWidth(true); // DEFAULT VALUE
			
			if ( this.options.autoSize ) {
				
				this.autoSize();
				
				$(window).resize(function () {
					
					// CALLBACK
					self.options.beforeResize(self);
					
					self.autoSize();
					
					// RE-ALIGN THE LEFT SIDE OF THE CURRENT ITEM
					if (self.options.infinite) {
						self.windowFrame.scrollLeft(self.itemWidth * self.visible * self.currentPage);
					} else {
						self.windowFrame.scrollLeft(self.itemWidth * self.visible * (self.currentPage - 1));
					}
					
					// CALLBACK
					self.options.afterResize(self);
					
				});
				
			}
				
			this.visible = Math.ceil(this.windowFrame.innerWidth() / this.itemWidth);
			this.pages = Math.ceil(this.items.length / this.visible);
			
			this.autoAdvanceTimer = null;
			this.indicators = null;
			
			// IF MORE THAN ONE PAGE
			if (this.pages > 1) {
				
				if (this.options.infinite) {
					
					// 1. Pad so that 'visible' number will always be seen, otherwise create empty items
					if ((this.items.length % this.visible) != 0) {
						this.slide.append( repeat('<li class="empty" />', this.visible - (this.items.length % this.visible) ) );
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
				if ( this.options.insertNav ) {
					this.windowFrame
		
						// INSERT ARROWS
						.after('<a class="arrow back"><span>Back</span></a><a class="arrow forward"><span>Next</span></a>')
						
						// ADD CONTAINER FOR PAGE INDICATORS
						.after('<div class="carousel-indicators"></div>');
				}
				
				// HOOK UP PAGE INDICATORS
				this.indicators = $('.carousel-indicators', this.element);
				
				if (this.indicators.length > 0) {
					
					for (var i = 1; i <= this.pages; i++) {
						
						var label = this.items.filter(':not(.cloned)').eq(i - 1).attr('data-label') || i;
						var indicator = $('.carousel-slide-' + i, this.element);
						
						if ( indicator.length == 0 ) {
							indicator = $('<a href="#" class="carousel-slide-' + i + '" data-slide="' + i + '"><span>' + label + '</span></a>').appendTo(this.indicators);
						}
						
						indicator.click(function() {
							
							var $target = $(this);
							
							self.goto( $target.attr('data-slide') );
																													
							return false;
						});
						
					}
					
					$('a:first', this.indicators).addClass('active');
					
				}
							
				// 5. Bind to the forward and back buttons
				$('.back', this.element).click(function () {
					self.prev();												
					return false;																						
				});
				
				$('.forward', this.element).click(function () {
					self.next();												
					return false;
				});
			}
			
			// CALLBACK
			this.options.init(self);
		
			// START CAROUSEL
			if (this.options.speed > 0 && this.pages > 1) {
				this.start();
				this.element.mouseenter(function () {
					self.stop();
					self.start();
				})
			};
	
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
			
			if ( this.autoAdvanceTimer ) {
				this.stop();
			}
			
			this._goto(page);
			
			if (this.options.speed > 0 && this.pages > 1) {
				this.start();
			}
			
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
			
			if ( self.options.beforeSlide(page) == false )
				return false;

			// ANIMATE CAROUSEL			
			this.windowFrame.filter(':not(:animated)').animate({
						scrollLeft : '+=' + left
					}, 500, function () {
						
						// UPDATE PAGE INDICATORS
						$('a:nth-child(' + self.currentPage + ')', self.indicators).removeClass('active');
						$('a:nth-child(' + page + ')', self.indicators).addClass('active');
						self.currentPage = page;
						
						// CALLBACK FUNCTION
						self.options.afterSlide(this.currentPage);
			});                
		},		
		
		_gotoInfinite : function ( page ) {
			var self = this,
					dir = page < this.currentPage ? -1 : 1,
					n = Math.abs(this.currentPage - page),
					left = this.itemWidth * dir * this.visible * n;
			
			// UPDATE PAGE #
			var newPage = page;
			
			if (page == 0) {
				newPage = self.pages;
			} else if (page > self.pages) {
				newPage = 1;
			} 
					
			if ( self.options.beforeSlide(newPage) == false )
				return false;
			
			// ANIMATE CAROUSEL
			this.windowFrame.filter(':not(:animated)').animate({
						scrollLeft : '+=' + left
					}, 500, function () {
						
						if (page == 0) {
							
							// POSITION AT THE END
							self.windowFrame.scrollLeft(self.itemWidth * self.visible * self.pages);
							
						} else if (page > self.pages) {
							
							// RESET BACK TO STARTING POSITION
							self.windowFrame.scrollLeft(self.itemWidth * self.visible);
							
						}
						page = newPage;
						
						// UPDATE PAGE INDICATORS
						$(':nth-child(' + self.currentPage + ')', self.indicators).removeClass('active');
						$(':nth-child(' + page + ')', self.indicators).addClass('active');
						self.currentPage = page;
						
						// CALLBACK FUNCTION
						self.options.afterSlide( self.currentPage );
			
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

