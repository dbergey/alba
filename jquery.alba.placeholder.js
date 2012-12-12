/*
TODO:
- pass rightclicks through so field context menus appear even when clone is visible
*/
jQuery(function($) {
	$.widget('alba.placeholder', {
		options: {
			debug: false,
			stay: true, // stay = lion-style (stays until keypress, even if field has focused)
			fx: ($.browser.msie && $.browser.version < 9) ? false : 'fade', // 'fade' or false
			color: ($.browser.msie && $.browser.version < 9) ? '#cccccc' : 'rgba(0, 0, 0, 0.35)',
			offset: '0 0'
		},
		_create: function() {
			// suppress on iOS, since we don't pass focus through nicely yet
			if (navigator.userAgent.match(/iPhone|iPad/)) return false;
			if (this.clone) return this.clone;
			this.clone = this.element.eclipse({
				debug: this.options.debug,
				addendum: $.extend({
					cursor: 'text',
					// keep placeholders on one line (unless it's a textarea)
					'overflow': 'hidden',
					'text-overflow': 'ellipsis',
					'white-space': this.element.is('textarea') ? 'wrap' : 'nowrap',
					// disallow selection of placeholder text
					'-webkit-user-select': 'none',
					'-khtml-user-select': 'none',
					'-moz-user-select': 'none',
					'-ms-user-select': 'none',
					'user-select': 'none',
					color: this.options.color
				}, this.element.is('input[type=search]') ? { paddingLeft: 25 } : {}),
				offset: this.options.offset
			}).eclipse('fetch');
			this.element.attr('_placeholder', this.element.attr('placeholder'));
			this.element.removeAttr('placeholder');
			this.clone.css({
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