$(function () {
	var $window = $(window);
	var $stickyBar = $('#sticky-bar');
	var $parent = $stickyBar.parent();
	var initialY = $stickyBar.offset().top;

	/*
		STICKY BAR
	*/

	function stickyBar () {
		var y = $window.scrollTop();
		var w = $parent.width();

		$stickyBar.width(w);
		if (y > initialY) {
			$stickyBar.addClass('stuck');
		} else {
			$stickyBar.removeClass('stuck');
		}
	}

	/*
		SCROLL WINDOW
	*/

	$window.scroll(function () {
		stickyBar();
	});

	/*
		RESIZE WINDOW
	*/

	$window.resize(function () {

		// STICKY BAR NEEDS RESIZING
		stickyBar();

	});
});
