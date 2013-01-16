(function($){

    var PageScroller = (function(){

        var defaults = {
            width: 100,
            position: 'left',
            triggerDistance: 100,
            bgColor: '#3BA7BF',
        }

        function PageScroller(){
            this.is_shown = false;
            this.options = $.extend(true, {} , defaults);
        }

        PageScroller.prototype.setup = function(){
            this.$container = $(document.body);
            this.$el = $('<div class="scroller-container">');
            this.$container.mousemove($.proxy(this.check_cursor, this));
            this.$el.click($.proxy(this.scroll_to_top, this));
            this.$el.appendTo(document.body);

        };

        PageScroller.prototype.init = function(options){
            this.options = $.extend(true, {}, defaults, options);
            this.setup();
        };

        PageScroller.prototype.check_cursor = function(ev){
            var x = ev.pageX, y = ev.pageY;
            if (this['check_distance_' + this.options.position](x, y)){
                this.show();
            } else {
                this.hide();
            }
        };

        PageScroller.prototype.check_distance_left = function(x, y) {
            return (x < this.options.triggerDistance);
        };

        PageScroller.prototype.check_distance_right = function(x, y) {
            return ((this.$container.width() - x) <
                     this.options.triggerDistance)
        };

        PageScroller.prototype.hide = function(){
            if (!this.is_shown) return;
            this.$el.hide();
            console.log('hiding now');
            this.is_shown = false;
        };

        PageScroller.prototype.set_pos_left = function() {
            this.$el.css({left: '0px'});
        };

        PageScroller.prototype.set_pos_right = function() {
            this.$el.css({right: '0px'});
        };

        PageScroller.prototype.show = function(){
            if (this.is_shown) return;
            this['set_pos_'+this.options.position]();
            this.$el.css({
                'background-color': this.options.bgColor,
                width: this.options.width
            })
            this.$el.show();
            this.is_shown = true;
        };

        return PageScroller;

    })()

    $.pagescroller = new PageScroller();

})(jQuery)
