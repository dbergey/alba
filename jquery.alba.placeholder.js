/*
TODO:
- pass rightclicks through so field context menus appear even when clone is visible
*/
jQuery(function($) {
	$.widget('alba.placeholder', {
		options: {
			debug: false,
			stay: true, // stay = lion-style (stays until keypress, even if field has focused)
			fx: 'fade', // 'fade' or false
			color: 'rgba(0, 0, 0, 0.35)' // or #ccc, for crappy browsers maybe
		},
		_create: function() {
			if (this.clone) return this.clone;
			this.clone = this.element.eclipse({ debug: this.options.debug }).eclipse('fetch');
			this.element.attr('_placeholder', this.element.attr('placeholder'));
			this.element.removeAttr('placeholder');
			this.clone.css({
				cursor: 'text',
				color: this.options.color,
				display: this.element.val().length ? 'none' : 'block'
			}).text(this.element.attr('_placeholder'));
			
			// pass clicks through
			this.clone.bind('click.alba_placeholder', $.proxy(function(event) { this.element.focus(); }, this));
			// this.clone.bind('mousedown.alba_placeholder', $.proxy(function(event) {
			// 	this.element.focus();
			// 	// DEBUG
			// 	console.log('event.which:', event.which);
			// 	// rightclick?
			// 	if (event.which == 3) {
			// 		setTimeout($.proxy(function() {
			// 		// this.element.trigger('contextmenu');
			// 		this.element.trigger({
			// 			type: 'mousedown',
			// 			which: 3
			// 		}).trigger('mouseup');
			// 	
			// 		event.preventDefault();
			// 		return false;
			// 		}, this), 100);
			// 	}
			// }, this));
			
			this.element.bind('keydown.alba_placeholder', $.proxy(function() {
				if (this.options.stay)
					setTimeout($.proxy(function() {
						if (this.element.val().length > 0) this.hide();
							else this.show();
					}, this), 0);
			}, this));
			this.element.bind('focus.alba_placeholder', $.proxy(function() {
				if (!this.options.stay && this.clone.is(':visible')) this.hide();
			}, this));
			this.element.bind('blur.alba_placeholder', $.proxy(function() {
				if (!this.element.val().length && this.clone.is(':hidden')) this.show();
			}, this));
		},
		show: function() {
			if (!this.options.fx) this.clone.show();
				else this.clone[this.options.fx+'In'](100);
		},
		hide: function() {
			if (!this.options.fx) this.clone.hide();
				else this.clone[this.options.fx+'Out'](100);
		},
		destroy: function() {
			this.clone.unbind('.alba_placeholder');
		}
	});
});