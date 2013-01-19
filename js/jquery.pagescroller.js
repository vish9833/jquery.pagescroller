(function($){

    var PageScroller = (function(){

        var defaults = {
            width: 100,
            position: 'left',
            triggerDistance: 100,
            bgColor: '#CFCFCF',
            arrowColor: '#BFBFBF',
            textColor: '#BFBFBF',
            upText: 'To top',
            showArrows: true
        }

        function PageScroller(){
            this.is_shown = false;
            this.check_scroll = $.proxy(this.check_scroll, this);
            this.check_cursor = $.proxy(this.check_cursor, this);
        }

        PageScroller.prototype.setup = function(){
            if (this.$el) return;
            this.$window = $(window);
            this.$container = $(document.body);
            this.$el = $('<div class="scroller-container">');
            this.$container.mousemove(this.check_cursor);
            this.$window.scroll(this.check_scroll);
            this.$el.click($.proxy(this.scroll_to_top, this));
            this.$el.appendTo(document.body);
        };

        PageScroller.prototype.check_scroll =function(e) {
            if (this.$window.scrollTop() == 0 ){
                this.hide();
            }
        };

        PageScroller.prototype.init = function(options){
            this.options = $.extend(true, {}, defaults, options);
            this.setup();
            this.chapters = $(this.options.chapters);
            this.element_prepared = false;
        };

        PageScroller.prototype.check_cursor = function(ev){
            var x = ev.pageX, y = ev.pageY;
            if (this.is_attop()) return;
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

        PageScroller.prototype.scroll_to_top = function(e){
            var point = 0;
            if (this.next_chapter && this.next_chapter.length){
                point = this.next_chapter.offset().top
            }
            this.$window.scrollTop(point);
            this.hide();
        };

        PageScroller.prototype.hide = function(){
            if (!this.is_shown) return;
            this.$el.hide();
            this.is_shown = false;
        };

        PageScroller.prototype.set_pos_left = function() {
            this.$el.css({left: '0px'});
        };

        PageScroller.prototype.set_pos_right = function() {
            this.$el.css({right: '0px'});
        };

        PageScroller.prototype.is_attop = function(){
            return (this.$window.scrollTop() == 0)
        };

        PageScroller.prototype.prepare_element = function(){
            /* Need to run this function only once after
             * options had been changed (with init() function) */
            if (this.element_prepared){
                return true;
            }
            this['set_pos_'+this.options.position]();
            this.$el.css({
                'background-color': this.options.bgColor,
                width: this.options.width
            })
            if (this.options.showArrows){
                this.$el.append(this.make_arrow_up());
            }
            this.$el.append(this.make_text());
            this.element_prepared = true;
        };

        PageScroller.prototype.make_text = function(){
            var txt = $('<div class="text">');
            txt.text(this.options.upText).css({
                color: this.options.textColor
            });
            return txt;
        };

        PageScroller.prototype.remove_title =function() {
            this.next_chapter = null;
            this.$el.removeAttr('title')
        };

        PageScroller.prototype.check_stops = function() {
            /* TODO: give this a better name */
            if (!this.chapters.length) {
                return this.remove_title();
            }
            var chapter, is_first = false, self = this;
            this.chapters.each(function(idx, el){
                var $this = $(this);
                if ($this.offset().top >= self.$window.scrollTop()){
                    if (idx == 0) is_first = true;
                    chapter = self.chapters.eq(idx - 1);
                    return false;
                }
            });
            if (is_first) {
                /* need to scroll to the top of the page */
                return this.remove_title();
            }
            this.next_chapter = chapter;
            this.$el.attr('title', this.make_excerpt());
        };

        PageScroller.prototype.make_excerpt =function() {
            return 'Go to ' + this.next_chapter.text().substr(0, 20) + '...';
        };

        PageScroller.prototype.make_arrow_up =function(){
            var arr = $('<div class="arrow-up">'),
                opts = this.options,
                bcolor = opts.arrowColor,
                width = opts.width;
            arr.css({
                'border-bottom-color': bcolor,
                'border-bottom-width': width * 0.3,
                'border-left-width': width * 0.4,
                'border-right-width': width * 0.4
            })
            return arr;
        };

        PageScroller.prototype.show = function(){
            if (this.is_shown) return;
            this.prepare_element();
            this.check_stops();
            this.$el.show();
            this.is_shown = true;
        };

        PageScroller.prototype.remove =function() {
            if (!this.$el) return;
            this.$el.remove();
            this.$window.unbind('scroll', this.check_scroll);
            this.$container.unbind('mousemove', this.check_cursor);
            this.$el = null;
        };

        return PageScroller;

    })()

    $.pagescroller = new PageScroller();

})(jQuery)
