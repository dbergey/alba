jQuery(function($) {
	$.widget('alba.eclipse', {
		options: {
			debug: false,
			addendum: {}
			// offset: '0 0' // or {left: 0, top: 0}
		},
		_create: function() {
			this.clone = $('<div></div>').css({
				position: 'absolute',
				background: 'transparent',
				borderColor: 'transparent',
				borderStyle: 'solid'
			}).addClass('alba-placeholder').insertBefore(this.element);
			
			// so we can see it
			if (this.options.debug) this.clone.css({ background: 'rgba(0, 0, 255, 0.1)' });
			
			this.element.unbind('move.alba_eclipse').bind('move.alba_eclipse', $.proxy(this.refresh, this)).trigger('move');
		},
		refresh: function() {
			// reposition and resize
			this.clone.css({
				height: this.element.height(),
				width: this.element.width(),
				zIndex: this.element.css('zIndex') +2
			});
			
			$.each('paddingTop paddingRight paddingLeft paddingBottom fontSize fontFamily fontWeight fontStyle letterSpacing lineHeight textAlign textDecoration borderTopWidth borderRightWidth borderBottomWidth borderLeftWidth verticalAlign boxSizing webkitBoxSizing mozBoxSizing'.split(' '), $.proxy(function(i, prop) {
				this.clone.css(prop, this.element.css(prop));
			}, this));
			
			$.each(this.options.addendum, $.proxy(function(prop, val) {
				this.clone.css(prop, val);
			}, this));
			
			$(this.clone).filter(':visible').position({
				my: 'left top',
				at: 'left top',
				of: this.element
			});
		},
		destroy: function() {
			this.clone.remove();
			this.element.unbind('.alba_eclipse');
		},
		fetch: function() { return this.clone; }
	});
});
