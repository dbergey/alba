jQuery(function($) {
	
	var placeholderSelector = 'input[placeholder], textarea[placeholder]';
	var placeholderOptions = { stay: true };

	// initial setup
	$(placeholderSelector).placeholder(placeholderOptions);
	
	// all future page modifications
	// IS THIS TOO MUCH??
	// var throttleTimeout;
	// $(document).bind('DOMNodeInserted', function(event) {
	// 	clearTimeout(throttleTimeout);
	// 	throttleTimeout = setTimeout(function() {
	// 		// DEBUG
	// 		console.log('insert:', $(event.target).find(placeholderSelector));
	// 		$(event.target).find(placeholderSelector).placeholder(placeholderOptions);
	// 	}, 300);
	// });
	// $('body').bind('DOMNodeRemoved', function(event) {
	// 	// DEBUG
	// 	console.log('remove:', $(event.target).find(placeholderSelector));
	// 	$(event.target).find(placeholderSelector).placeholder('destroy');
	// });
});