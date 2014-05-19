$.widget( "l5.select", {
	
	options: {
		toggle : '> .toggle',
		target : '> .menu',
		listItems : 'li',
		
		// CALLBACKS
		onSelect : function () {},
		beforeOpen : function () {},
		beforeClose : function () {},
		afterOpen : function () {},
		afterClose : function () {}
	},
	
	target : null,
	toggle : null,
	listItems : null,
	
	_create: function() {
		var o = this;
		
		with (o) {
		
			toggle = element.find(options.toggle);
			if (toggle.length == 0) {
				$.error( 'l5.select: "' +  options.toggle + '" not found.' );
			}
			
			target = element.find(options.target).hide();
			if (target.length == 0) {
				$.error( 'l5.select: "' +  options.target + '" not found.' );
			}
			
			listItems = target.find(options.listItems);
			if (listItems.length == 0) {
				$.error( 'l5.select: "' +  options.listItems + '" not found.' );
			}
			
			element.click(function (e) {
				e.stopPropagation();
			});
			
			toggle.click(function () {

				if (o.isOpen()) {
				
					o.close();
					
				} else {
				
					o.open();
					
				}
				
			});
			
			listItems.click(function (e) {
				var clicked = $(this);
				
				// VALUES OF THE CLICKED DATA ATTRIBUTES
				var values = clicked.data();
				
				if ( o.options.onSelect(values) != false ) {
					o.toggle.find('.value').text(values.value);
					o.close();
				}
			});
						
		}
	},
	
	isOpen : function() {
		return this.target.is(':visible');
	},
	
	open : function () {
		var o = this;
		
		if ( o.options.beforeOpen(o) != false ) {
			
			// ADD DOCUMENT CLICK TO CLOSE SELECT
			$(document).on('click.l5.select', function (e) {
				e.stopPropagation();
				o.close();
				
				return false;
			});
		
			o.target.fadeIn();
			
			o.element.addClass('active');
			
			o.options.afterOpen(o);
			
		}
	},
	
	close : function () {
		var o = this;
		
		if ( o.options.beforeClose(o) != false ) {
			
			// REMOVE DOCUMENT CLICK
			$(document).off('click.l5.select');
		
			o.target.fadeOut();
			
			o.element.removeClass('active');
			
			o.options.afterClose(o);
		}
	}
		
});
