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
		<div class="carousel-links">
			<a href="#" class="carousel-slide-1" data-slide="1"><span>1</span></a>
			<a href="#" class="carousel-slide-2" data-slide="2"><span>2</span></a>
			<a href="#" class="carousel-slide-3" data-slide="3"><span>3</span></a>
		</div> <!-- /carousel-links -->
	</div> <!-- /carousel -->
	
*/

(function( $ ) {
	
	function repeat(str, num) {
		return new Array( num + 1 ).join( str );
	}
	
	$.widget( 'l5.carousel', {
		
		// OPTIONS
		options: {
			
			speed : 7500,
			infinite : true,
			insertArrows : true,
			insertLinks : true,
			
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
		
		// PROPERTIES
		viewport : null,
		slide : null,
		visible : 0,
		itemNumber : 1,
		items : null,
		itemWidth : 0, // DEFAULT VALUE
		pages : 0,
		currentPage : 1,
		linksContainer : null,
		autoAdvanceTimer : null,
		
		autoSize : function () {
			
			with ( this ) {
				
				// CALCULATE CAROUSEL WIDTH
				
				var width = element.width(); // CAROUSEL WIDTH; EXCLUDES PADDING
	
				viewport.width(width);
				
				if ( options.autoItemWidth ) {
					items.width(width - ( items.innerWidth() - items.width() ) ); // SET ITEM WIDTH MINUS ANY PADDING
					itemWidth = width;
				}
	
				// SET THE HEIGHT BASED ON THE INNER ITEMS
				
				var height = items.filter(':first').outerHeight();
				
				element.height(height);
				viewport.height(height);
				
			}		
							
		},
		
		_create: function() {
			
			var carousel = this;
			
			with (carousel) {
	
				viewport = $('> .frame', element).css('overflow', 'hidden');
				slide = viewport.find('> ul');
				items = slide.find('> li');
				itemWidth = items.filter(':first').outerWidth(true); // DEFAULT VALUE
				
				if ( options.autoSize ) {
					
					autoSize();
					
					$(window).resize(function () {
						
						// CALLBACK
						options.beforeResize( carousel );
						
						autoSize();
						
						// REDO PADDING AND INDICATORS
						if ( ! options.autoItemWidth ) {

							visibleTemp = viewport.innerWidth() / itemWidth;
							
							// NO. OF VISIBLE ITEMS CHANGED?
							if ( visibleTemp != visible ) {
								
								visible = visibleTemp;
								
								// REMOVE PADDING
								items.remove('.cloned, .empty');
								
								// RESELECT CAROUSEL ITEMS
								items = slide.find('> li');
								
								// RECALCULATE PAGES
								pages = Math.ceil( items.length / Math.round(visible) );
								
								// RECALCULATE CURRENT PAGE
								currentPage = Math.ceil( itemNumber / Math.round(visible) );
								
								// ADD NEW PADDING
								_padItems();
			
								// RESET VIEWPORT POSITION
								// 1. FIGURE OUT WHICH PAGE ITEH ITEM IS IN: Math.ceil(itemNumber / Math.round(visible))
								// 2. GET THE ITEMS PRECEEDING IT: (Math.ceil(itemNumber / Math.round(visible)) - 1) * Math.round(visible)
								// 3. ADD CLONED ITEMS: Math.ceil(visible)
								// 4. FIND PIXEL VALUE: (TOTAL # OF PRECEEDING ITEMS) * itemWidth
								viewport.scrollLeft( ( (Math.ceil(itemNumber / Math.round(visible)) - 1) * Math.round(visible) + Math.ceil(visible) ) * itemWidth);
		
								// REDO LINKS
								linksContainer.children().remove();
								_setupLinks();
								
							}
														
						} else {
							
							// RE-ALIGN THE LEFT SIDE OF THE CURRENT ITEM
							viewport.scrollLeft(itemWidth * Math.round(visible) * currentPage);
						
						}
						
						// CALLBACK
						options.afterResize(carousel);
						
					});
					
				}
					
				visible = viewport.innerWidth() / itemWidth;
				pages = Math.ceil( items.length / Math.round(visible) );
				
				// MULTIPLE PAGES?
				if (pages > 0) {
					
					_padItems();
					
					// INSERT ARROWS
					if ( options.insertArrows ) {
						viewport.after('<a class="arrow back"><span>Back</span></a><a class="arrow forward"><span>Next</span></a>')
					}
												
					// BIND EVENTS TO ARROWS
					$('.back', element).click(function () {
						carousel.prev();												
						return false;																						
					});
					
					$('.forward', element).click(function () {
						carousel.next();												
						return false;
					});

					// ADD CONTAINER FOR PAGE INDICATORS
					if ( options.insertLinks ) {
						viewport.after('<div class="carousel-links"></div>');
					}
					
					linksContainer = $('.carousel-links', element);
					
					// HOOK UP PAGE INDICATORS
					_setupLinks();
						
				}
				
				// CALLBACK
				options.init( carousel );
			
				// START CAROUSEL
				if (options.speed > 0 && pages > 1) {
					start();
					element.mouseenter(function () {
						carousel.stop();
						carousel.start();
					})
				};
	
			}
	
		},
		
		_setupLinks : function () {
			
			var carousel = this;
			
			with ( carousel ) {

				if (linksContainer.length > 0) {
					
					for (var i = 1; i <= pages; i++) {
						
						var label = i;
						if ( options.autoItemWidth ) {
							label = items.filter(':not(.cloned)').eq(i - 1).attr('data-label') || i;
						}
						
						// GET THE INDICATOR IF IT ALREADY EXISTS
						var link = $('.carousel-slide-' + i, element);
						
						// IF IT DOESN'T EXIST CREATE A NEW ONE
						if ( link.length == 0 ) {
							link = $('<a href="#" class="carousel-slide-' + i + '" data-slide="' + i + '"><span>' + label + '</span></a>').appendTo(linksContainer);
						}
						
						link.click(function() {
							
							var $target = $(this);
							
							goto( parseInt( $target.attr('data-slide') ) );
																													
							return false;
							
						});
						
					}							
					
					$('a', linksContainer).eq(currentPage - 1).addClass('active');
				}

			}
						
		},
		
		_padItems : function () {
			
			var carousel = this;
			
			with ( carousel ) {
					
				// 1. Pad so that 'visible' number will always be seen, otherwise create empty items
				if (( items.length % Math.round(visible) ) != 0) {
					slide.append( repeat('<li class="empty" />', Math.round(visible) - (items.length % Math.round(visible)) ) );
					items = slide.find('> li');
				}
				
				// 2. Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
				items.filter(':first').before(items.slice(- Math.ceil(visible)).clone().addClass('cloned'));
				items.filter(':last').after(items.slice(0, Math.ceil(visible)).clone().addClass('cloned'));
				items = slide.find('> li'); // reselect
				
				// 3. Set the left position to the first 'real' item
				viewport.scrollLeft(itemWidth * Math.ceil(visible));
				
			}
			
		},
		
		start : function ( ) {
			var carousel = this;
			
			if ( ! carousel.autoAdvanceTimer ) {
				carousel.autoAdvanceTimer = setInterval (function () {
						carousel._goto( carousel.currentPage + 1 );																						
					}, carousel.options.speed);
			}
		},
		
		stop : function ( ) {
			if ( this.autoAdvanceTimer ) {
				clearInterval(this.autoAdvanceTimer);
				this.autoAdvanceTimer = null;
			}
		},
		
		goto : function ( page ) {
			
			with ( this ) {
				
				stop();
				
				_goto(page);
				
				if (options.speed > 0 && pages > 1) {
					start();
				}
				
			}
						
		},

		_goto : function ( page ) {
			
			var carousel = this;
			
			with ( carousel ) {

				var dir = page < currentPage ? -1 : 1,
						n = Math.abs(currentPage - page),
						left = itemWidth * dir * Math.round(visible) * n;

				// UPDATE PAGE #
				var newPage = page;
				
				if ( page == 0 ) {
					newPage = pages;
				} else if (page > pages) {
					newPage = 1;
				} 
						
				if ( options.beforeSlide( carousel ) == false )
					return false;
				
				// ANIMATE CAROUSEL
				viewport.filter(':not(:animated)').animate({
							scrollLeft : '+=' + left
						}, 500, function () {
							
							if ( page == 0 ) {
								
								// POSITION AT THE END
								viewport.scrollLeft( ( itemWidth * Math.round(visible) * (pages - 1) ) + itemWidth * Math.ceil(visible) );
								
							} else if (page > pages) {
								
								// RESET BACK TO STARTING POSITION
								viewport.scrollLeft(itemWidth * Math.ceil(visible));
								
							}
							page = newPage;
							
							// UPDATE PAGE INDICATORS
							$(':nth-child(' + currentPage + ')', linksContainer).removeClass('active');
							$(':nth-child(' + page + ')', linksContainer).addClass('active');
							currentPage = page;
							
							itemNumber = ((currentPage - 1) * Math.round(visible)) + 1;
							
							// CALLBACK FUNCTION
							options.afterSlide( carousel );
				
				});                

			}		
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

