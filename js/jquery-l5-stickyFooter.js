// JavaScript Document

$.widget( "l5.stickyFooter", {
	
	options : {
	},
	
	_create : function () {
		this.apply();
	},
	
	_position : function () {
	
		footerHeight = this.element.height();
		footerTop = ($(window).scrollTop()+$(window).height()-footerHeight)+"px";
		
		if ( ($(document.body).height()+footerHeight) < $(window).height()) {
			 this.element.css({
				 		display: "block",
						position: "absolute",
						bottom: -footerHeight,
			 }).animate({
						bottom: 0
			 }).parent().css({ overflow : 'hidden' });
		} else {
			 this.element.css({
						position: "static"
			 })
		}
			 
	},
	
	apply : function () {
		var o = this;
		
		this._position();
		$(window)
			.on('scroll.stickyFooter', o._position)
			.on('resize.stickyFooter', o._position);
	},
	
	relinquish : function () {
		this.element.css({
			position: "static"
		})
		$(window)
			.off('scroll.stickyFooter')
			.off('resize.stickyFooter');
	}
	
});