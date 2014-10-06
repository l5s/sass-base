// JavaScript Document - Tab functionality

(function( $ ) {

	$.widget( "l5.simpleTabs", {
		
		options: {
			
			index : 0,					// Index of the initial active tab
			selector : 'a',				// Tab element selector
			toggleContent : true,		// Associate tab with content block
			
			// CALLBACKS
			init : function () {},
			beforeChange : function () {},
			afterChange : function () {}
			
		},
 
		_create: function() {

			var o = this;
			
			o.index = -1;	// TAB INDEX; FIRST TIME THROUGH IT IS UNSET (-1)
			o.tabs = $(o.options.selector, this.element);
			o.content = [];
			
			if (o.options.toggleContent) {
				this.tabs.each(function () {
					var tab = $(this);
					var ref = tab.attr("data-ref") || tab.attr("href");
					var contentBlock = $(ref);
					
					if (contentBlock.length === 0) {
						$.error( 'tabs: "' +  ref + '" not found' );
					}
					contentBlock.each(function () {
						o.content.push(this);
					});
						
				});
			}
			
			this.tabs.click(function () {
				
				var clicked = $(this);
				var index = o.tabs.index(this);
				
				// CALLBACK
				if (o.options.beforeChange({ element : this, index : index, lastElement : o.tabs.eq(o.index), lastIndex : o.index }, o) === false)
					return;
					
				// CHANGE TAB CONTENT
				if (o.options.toggleContent) {
					
					// ITERATE OVER CONTENT CONTAINERS
					$.each(o.content, function () {
						var container = $(this),
							active = container.filter(clicked.attr("data-ref") || clicked.get(0).hash);
						
						// HIDE CONTAINER
						container.hide().removeClass('active');
						
						// IF ACTIVE, SHOW IT
						active.show();
						
						// DELAY FOR CSS TRANSITIONS
						setTimeout(function () {							
							active.addClass('active');														
						}, 1);
						
					});
					
				}
				
				// CHANGE TAB:
				// A) SELECT THE PARENT LI
				if ( clicked.parent('li').length > 0 ) {
					o.tabs.parent().removeClass('active prev next');
					clicked.parent().addClass('active').prev().addClass('prev').end().next().addClass('next');
				} else {
				// B) SELECT THE ELEMENT ITSELF	
					o.tabs.removeClass('active prev next');
					clicked.addClass('active').prev().addClass('prev').end().next().addClass('next');
				}
				
				// CALLBACK
				o.options.afterChange({ element : this, index : index, lastElement : o.tabs.eq(o.index), lastIndex : o.index }, o);
				
				// SET THE ACTIVE INDEX; FIRST TIME THROUGH IT IS UNSET (-1)
				o.index = index; 
				
				return false;
				
			}).eq(o.options.index).click();
			
			// CALLBACK
			o.options.init(o);
			
		},
		
		set : function (n) {
			this.tabs.eq(n).click();
		},
		
		next : function () {
			this.set(this.index + 1);
		},
		
		prev : function () {
			this.set(this.index - 1);
		}
 
	});

}( jQuery ) );
