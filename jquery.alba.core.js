jQuery(function($) {
	
	function setUpPlaceholders() {
		$('input[placeholder]').placeholder({
			debug: true,
			stay: true
		});
	}
	
	// initial setup
	setUpPlaceholders();
	
	// all future page modifications
	// IS THIS TOO MUCH??
	var throttleTimeout;
	$('body').bind('DOMSubtreeModified', function() {
		clearTimeout(throttleTimeout);
		throttleTimeout = setTimeout(function() {
			setUpPlaceholders();
		}, 200);
	});
});