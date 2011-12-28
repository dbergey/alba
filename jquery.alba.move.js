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
		remove: function(event) {
			els = els.remove(this == document ? event.selector : this);
		},
		interval: function() {
			els.each(function() {
				var el = $(this);
				var pos = el.data('moveEventPosition') || {};
				if ( pos.left == 0 && pos.top == 0 ) return;
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
