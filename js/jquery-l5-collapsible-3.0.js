// JavaScript Document

(function( $ ) {

  $.widget( "l5.collapsibleMenu", {
 
    // DEFAULT VALUES
    options: {
		
			initial : -1,				// INDEX OF INITIALLY OPEN
			
			multiple : true,			// MULTIPLE OPEN AT THE SAME TIME?
			
			clickable : true,			// ADD CLICK EVENT TO TOGGLES?
			
			collapsed : true,			// INITIAL STATE AS COLLAPSED?
			
			head : '> :even',			// COLLAPSIBLE HEAD SELECTOR
			
			toggle : '',				// OPTIONAL TOGGLE SELECTOR; A CLICKABLE ELEMENT WITHIN THE COLLAPSIBLE HEAD. 
										// IF NOT PROVIDED, THE ENTIRE HEAD BECOMES THE TOGGLE
			
			collapsible : '',			// COLLAPSIBLE SELECTOR; SELECTS FIRST ITEM, AFTER THE TOGGLE, WHICH MATCHES THE SELECTOR
										// BY DEFAULT, SELECTS THE FIRST ITEM AFTER THE TOGGLE
										
			animationExpand : 'slideDown',

			animationCollapse : 'slideUp',
			
			// CALLBACKS
			init : function () {},
			beforeExpand : function () {},
			afterExpand : function () {},
			beforeCollapse : function () {},
			afterCollapse : function () {}
    },
 
    // INITIALIZE
    _create: function () {

			var o = this;
			
			// INITIALIZE COLLAPSIBLES
			this.headSet = o.element
				.find(o.options.head)
				.each(function (index, head) {
					
					o._makeCollapsible(index, head);
						
				});
			
			// SET UTILITY CLASSES
			o.headSet.filter(':first').addClass('first').end().filter(':last').addClass('last');
			
			// OPEN DEFAULT COLLAPSIBLE
			if (o.options.initial > -1) {
				
				var defaultElement = o.headSet.eq(this.options.initial);
				
				defaultElement.trigger('expand');
				
			}
			
			// EXECUTE INITIALIZATION CALLBACK
			o.options.init(this); 

    },
	
	_makeCollapsible : function (index, head) {
		
		var	o = this,
			$head = $(head);
		
		// ASSOCIATE DATA WITH HEAD ELEMENT
		$head.data({
			index : index,
			head : head,		// SELF REFERENCE 
			toggle : o.options.toggle ? $head.find(o.options.toggle) : $head,
			collapsible : $head.nextAll(o.options.collapsible).eq(0)
		});
		
		$head.on({
			
			// ADD EXPAND EVENT
			expand : function () {
					
				if (! $head.hasClass('active')) {
					
					// EXECUTE CALLBACK
					o.options.beforeExpand( $head.data() );
					
					$head.addClass('active').data().collapsible[o.options.animationExpand]({ 
						complete: function () {
							
								$(this).addClass('open');
								
								// EXECUTE CALLBACK
								o.options.afterExpand( $head.data() ); 
						} 
					});
					
					if (! o.options.multiple) {
						
						// CLOSE ALL OPEN
						o.headers.filter('.active').not(this).trigger('collapse');
						
					}
					
				}
				
			},
			
			// ADD COLLAPSE EVENT
			collapse : function () {
				
				if ( $head.hasClass('active') ) {
				
					// EXECUTE CALLBACK
					o.options.beforeCollapse( $head.data() );
				
					$head.removeClass('active').data().collapsible.slideUp({ 
						complete: function () { 
							
							$(this).removeClass('open');
							
							// EXECUTE CALLBACK
							o.options.afterCollapse( $head.data() ); 
							
						} 
					});
				}
				
			}
			
		});			
		
		
		// ADD CLICK EVENT
		if (o.options.clickable) {
			
			$head.data().toggle.on({
				click : function () {
					
					if ($head.hasClass('active'))
						$head.trigger('collapse');
					else {
						$head.trigger('expand');
					}
					
					return false;
				}
			});
			
		}
		
		// SET INITIAL STATE
		if (o.options.collapsed) {
			$head.data().collapsible.hide();
		} else {
			$head.addClass('active');
		}

	},
		
	expand : function ( n ) {
		
		if (n >= 0) {
			this.headSet.eq(n).trigger('expand');
		} else
			this.headSet.trigger('expand');
		
	},
	collapse : function ( n ) { 
		
		if (n >= 0) {
			this.headSet.eq(n).trigger('collapse');
		} else
			this.headSet.trigger('collapse');
		
	},
	
	next : function ( ) {
		
		if ( ! this.options.multiple ) {
			var index = this.headSet.index( this.headSet.filter('.active') );
			
			this.headSet.filter(':eq(' + (index+1) + ')').trigger('expand');
			this.headSet.filter(':eq(' + index + ')').trigger('collapse');
		}
		
	},

    // Use the _setOption method to respond to changes to options
    _setOption: function ( key, value ) {

		this.options[ key ] = value;
		
		// In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
		$.Widget.prototype._setOption.apply( this, arguments );
		// For UI 1.9 the _super method can be used instead
		// this._super( "_setOption", key, value );

    },
 
    // Use the destroy method to clean up any modifications your widget has made to the DOM

    destroy: function () {
			
		this.headSet.removeClass('active').filter(':first').removeClass('first').end().filter(':last').removeClass('last').end().off('click').next().show();
		
		// In jQuery UI 1.8, you must invoke the destroy method from the base widget
		$.Widget.prototype.destroy.call( this );
		// In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
						
    }

  });

}( jQuery ) );

