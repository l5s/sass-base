// JavaScript Document

(function( $ ) {

  $.widget( "l5.collapsibleMenu", {
 
    // DEFAULT VALUES
    options: {
			defaultIndex : -1,
			multiple : true,			// MULTIPLE OPEN AT THE SAME TIME
			clickable : true,			// ADD CLICK EVENT TO TOGGLES
			collapsed : true,			// INITIAL STATE
			toggle : '> :even',		// TOGGLE SELECTOR
			collapsible : '',			// COLLAPSIBLE SELECTOR; SELECTS FIRST ITEM, AFTER THE TOGGLE, WHICH MATCHES THE SELECTOR
														// BY DEFAULT, SELECTS THE FIRST ITEM AFTER THE TOGGLE
			
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
			
			this.toggles = o.element.find(o.options.toggle);
			
			// UTILITY CLASSES
			this.toggles.filter(':first').addClass('first').end().filter(':last').addClass('last');
			
			this.toggles.bind({
				
				// ADD EXPAND EVENT
				expand : function () {
						
					var index = o.toggles.index(this);
					
					if (! $(this).hasClass('active')) {
						
						o.options.beforeExpand(index);
						$(this).addClass('active').nextAll(o.options.collapsible).eq(0).slideDown({ 
							complete: function () { 
									$(this).addClass('open'); 
									o.options.afterExpand(index); 
							} 
						});
						
						if (! o.options.multiple) {
							// Close all open
							o.toggles.filter('.active').not(this).trigger('collapse');
						}
						
					}
				},
				
				// ADD COLLAPSE EVENT
				collapse : function () {
					var index = o.toggles.index(this);
					
					if ( $(this).hasClass('active'))
					
						o.options.beforeCollapse(index);
					
						$(this).removeClass('active').nextAll(o.options.collapsible).eq(0).slideUp({ 
							complete: function () { 
								$(this).removeClass('open'); 
								o.options.afterCollapse(index); 
							} 
						});
				}
				
			});
			
			// SET INITIAL STATE
			if (o.options.collapsed) {
				this.toggles.each(function () {
					$(this).nextAll(o.options.collapsible).eq(0).hide();
				});
			} else {
				this.toggles.addClass('active');
			}
			
			// ADD CLICK EVENT
			if (this.options.clickable) {
				this.toggles.bind({
					click : function () {
						var el = $(this);
						
						if (el.hasClass('active'))
							el.trigger('collapse');
						else {
							el.trigger('expand');
						}
						
						return false;
					}
				});
			}
			
			
			// OPEN DEFAULT
			if (this.options.defaultIndex > -1) {
				var el = this.toggles.eq(this.options.defaultIndex);
				el.trigger('expand');
			}
			
			o.options.init(this); 

    },
		
		expand : function ( n ) {
			
			if (n >= 0) {
				this.toggles.eq(n).trigger('expand');
			} else
				this.toggles.trigger('expand');
			
		},
		collapse : function ( n ) { 
			
			if (n >= 0) {
				this.toggles.eq(n).trigger('collapse');
			} else
				this.toggles.trigger('collapse');
			
		},
		
		advance : function ( ) {
			
			if ( ! this.options.multiple ) {
				var index = this.toggles.index(this.toggles.filter('.active'));
				
				this.toggles.filter(':eq(' + (index+1) + ')').trigger('expand');
				this.toggles.filter(':eq(' + index + ')').trigger('collapse');
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
			
			this.toggles.removeClass('active').filter(':first').removeClass('first').end().filter(':last').removeClass('last').end().unbind('click').next().show();

      // In jQuery UI 1.8, you must invoke the destroy method from the base widget
      $.Widget.prototype.destroy.call( this );
			// In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
						
    }

  });

}( jQuery ) );

