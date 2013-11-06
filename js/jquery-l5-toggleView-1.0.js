// JavaScript Document

$.widget( "l5.toggleView", {
	
	options: {
		toggle : '.toggle',
		defaultView : '> .default:first',
		toggleView : '> .hide',
		
		// CALLBACKS
		beforeToggle : function () {},
		beforeToggleBack : function () {},
		afterToggle : function () {},
		afterToggleBack : function () {}
	},
	
	defaultView : null,
	toggleView : null,
	
	_create: function() {
		with (this) {
			defaultView = element.find(options.defaultView);
			toggleView = element.find(options.toggleView).hide();
			
			defaultView.find(options.toggle).click(function () {
				if ( options.beforeToggle(this) != false ) {
					defaultView.hide();
					toggleView.show();
					
					options.afterToggle(this);
				}
			});
			
			toggleView.find(options.toggle).click(function () {
				if ( options.beforeToggleBack(this) != false ) {
					toggleView.hide();
					defaultView.show();
					
					options.afterToggleBack(this);
				}
			});
			
		}
	}
		
});