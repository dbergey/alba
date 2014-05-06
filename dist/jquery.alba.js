jQuery(function($) {

	// This is ripped right out of the jQuery source
	var matched, browser;
	
	// Use of jQuery.browser is frowned upon.
	jQuery.uaMatch = function( ua ) {
		ua = ua.toLowerCase();
		
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			    /(msie) ([\w.]+)/.exec( ua ) ||
			    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			    [];
		
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
	
	matched = $.uaMatch( navigator.userAgent );
	browser = {};
	
	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}
	
	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}
	
	jQuery.browser = browser;

});

/*
- requires jquery.js, ui.position.js 
- doesn't work with .delegate yet, i don't think (but .live works)
- test:
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	<script src="https://raw.github.com/jquery/jquery-ui/master/ui/jquery.ui.position.js"></script>
	<script src="jquery.alba.move.js"></script>
	<div id="div1">div1</div>
	<div id="div2">div2</div>
	<script>
	$(function($) {
		$('#div1').live('move', function(event) { console.log('movement!', this, event); });
		$('#div2').bind('move', function(event) { console.log('movement!', this, event); });
		setTimeout(function() { $('#div1').css('margin-top', 100); }, 2000);
		setTimeout(function() { $('#div2').css('margin-top', 100); }, 1000);
	});
	</script>
*/

jQuery(function($){
	var els = $([]);

	$.event.special.move = {
		setup: function() {
			// $('body').data('moveEventInterval', setInterval($.event.special.move.interval, 1250));
		},
		teardown: function() {
			// clearInterval($('body').data('moveEventInterval'));
		},
		add: function(event) {
			els = els.add(this == document ? event.selector : this);
			els.each(function() {
				var el = $(this);
				el.data('moveEventPosition', el.offset());
			});
		},
		interval: function() {
			els.each(function() {
				var el = $(this);
				var pos = el.data('moveEventPosition') || {};
				var offset = el.offset();
				if ( pos.left != offset.left || pos.top != offset.top || pos.height != el.height() || pos.width != el.width()) {
					el.trigger('move');
					// essentially, when the callback is done, but guessing. TODO find a better way to do this
					setTimeout(function() {
						el.data('moveEventPosition', $.extend({}, el.offset(), {
							height: el.height(),
							width: el.width()
						}));
					}, 0);
				}
			});
		}
	};
	
	$('body').data('moveEventInterval', setInterval($.event.special.move.interval, 490));
	
});

jQuery(function($) {
	$.widget('alba.eclipse', {
		options: {
			debug: false,
			addendum: {},
			offset: '0 0' // or {left: 0, top: 0}
		},
		_create: function() {
			this.clone = $('<div></div>').css({
				position: 'absolute',
				background: 'transparent',
				borderColor: 'transparent',
				borderStyle: 'solid'
			}).addClass('alba-placeholder').insertBefore(this.element);
			// MSIE7 has a bug wherein position:absolute; elements
			// next to float: elements aren't necessarily really
			// "absolute" and will kind of go whereever they want.
			// adding this empty span prevents this bug.
			if($.browser.msie && $.browser.version < 8)
				$('<span></span>').insertAfter(this.clone);
			
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
			
			$.each('paddingTop paddingRight paddingLeft paddingBottom fontSize fontFamily fontWeight fontStyle letterSpacing lineHeight textAlign textDecoration borderTopWidth borderRightWidth borderBottomWidth borderLeftWidth verticalAlign'.split(' '), $.proxy(function(i, prop) {
				this.clone.css(prop, this.element.css(prop));
			}, this));
			
			$.each(this.options.addendum, $.proxy(function(prop, val) {
				this.clone.css(prop, val);
			}, this));
			
			$(this.clone).filter(':visible').position({
				my: 'left top',
				at: 'left top',
				offset: this.options.offset,
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
					'box-sizing': 'content-box',
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
			
			this.element.bind('keydown.alba_placeholder paste.alba_placeholder', $.proxy(function() {
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