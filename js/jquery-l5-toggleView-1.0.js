/*
	TOGGLEVIEW PLUGIN
	LEVEL FIVE SOLUTIONS

	MARKUP EXAMPLE:
	
	<div class="toggle-view">
	
		<div class="default">
			<input type="text" /> <a href="#" class="toggle">ADD</a>
		</div> <!-- /@@@ -->	
							
		<div class="hide">
			<span>@@@<span> <a href="#" class="toggle">[X]</a>
		</div> <!-- /@@@ -->
		
	</div> <!-- /toggle-view -->
	
	JAVASCRIPT EXAMPLE:
	
	$('.toggle-view').toggleView({
		beforeToggle : function (o) {
			
			// GET VALUE FROM DEFAULT VIEW
			var val = o.defaultView.find('input[type=text]').val();
			
			// SET VALUE IN HIDDEN VIEW
			o.toggleView.find('span').text(val);
			
		}
	});
	
*/

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
		var o = this;
		
		with (o) {
			defaultView = element.find(options.defaultView);
			toggleView = element.find(options.toggleView).hide();
			
			defaultView.find(options.toggle).click(function () {
				if ( options.beforeToggle(o) != false ) {
					defaultView.hide();
					toggleView.show();
					
					options.afterToggle(o);
				}
			});
			
			toggleView.find(options.toggle).click(function () {
				if ( options.beforeToggleBack(o) != false ) {
					toggleView.hide();
					defaultView.show();
					
					options.afterToggleBack(o);
				}
			});
			
		}
	}
		
});