
//滚动条插件

//滚动条插件
; (function sss ($) {

    var CornerSlide = function (element, options) {

        this.options = options;
        this.element = $(element);
        this.isActive = false;
        this.content = null, this.slide = null, this.slideBar = null;
        this.createSlide();
        this.show();
        this.element.on('mousewheel.slide', $.proxy(this.mousewheel, this));
        this.element.on('show.slide', $.proxy(this.show, this));
        this.element.on('mouseenter.slide', $.proxy(this.show, this));
        this.element.on('DOMNodeInserted.slide DOMNodeRemoved.slide', $.proxy(this.show, this));
        this.element.find(".cornerBar").draggable({
            axis: "y",
            containment: this.element.find(".cornerSlide"),
            drag: $.proxy(this.drag, this)
        });

        if (this.options.isAutoHide) {
            this.element.on('mouseleave.slide', $.proxy(this.hide, this));
        }

    }

    CornerSlide.prototype = {

        createSlide: function () {
            this.element.css('overflow', 'hidden');
            this.element.children().wrapAll('<div class="cornerSlideContent"></div>');
            this.content = this.element.children('.cornerSlideContent');
            this.content.css({
                'position': 'relative',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': 'auto',
                'overflow': 'hidden'
            });
            this.element.append('<div class="cornerSlide" style=""><div class="cornerBar"></div></div>');
            var options = this.options;
            this.slide = this.element.children('.cornerSlide');
            this.slideBar = this.slide.find('.cornerBar');
            this.slide.css({
                'position': 'absolute',
                'top': '0',
                'bottom': '0',
                'right': '0',
                'width': options.slideWidth,
                'background-color': options.slideColor,
                'z-index': '6000',
                'border-radius': '4px',
                'display': 'none',
                'overflow': 'hidden'
            });
            this.slideBar.css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'width': options.slideWidth,
                'height': options.minBarHeight,
                'background-color': options.slideBarColor,
                'border-radius': '4px',
                'cursor': 'pointer'
            });
        },

        show: function () {
            var element = this.element,
                content = this.content,
                slide = this.slide,
                slideBar = this.slideBar;
            if (content.height() > element.height()) {
                this.isActive = true;
                this.slide.show();
                //计算滚动条的高度
                var contentHeight = content.height(),
                    clientHeight = element.height(),
                    slideHeight = slide.height();
                var height = Math.max(clientHeight / contentHeight * slideHeight, this.options.minBarHeight);
                slideBar.css('height', height + 'px');
            } else {
                if (this.element.is(":visible")) {
                    this.isActive = false;
                    this.slide.hide();
                    this.content.css('top', '0');
                }
            }
        },

        mousewheel: function (evt) {
            if (!this.isActive) return;
            var delta = evt.delta || evt.wheelDelta || (evt.originalEvent && evt.originalEvent.wheelDelta) || -evt.detail || (evt.originalEvent && -evt.originalEvent.detail);
            var stepHeight = this.options.stepHeight, top;
            if (delta < 0) { //up
                top = parseInt(this.content.css('top'), 10) - stepHeight;
                adjustPosition(this, top);
            } else {//down
                top = parseInt(this.content.css('top'), 10) + stepHeight;
                adjustPosition(this, top);
            }
            evt.preventDefault();
            evt.stopPropagation();
        },

        drag: function (evt) {
            var top = parseInt($(evt.target).css("top"));
            var element = this.element, content = this.content, slide = this.slide;
            var contentHeight = content.height(), clientHeight = element.height(), slideHeight = slide.height();
            if (top >= slideHeight - this.options.minBarHeight) {
                this.scrollTop(contentHeight - clientHeight);
            } else {
                var scrollTop = top / slideHeight * contentHeight;
                this.scrollTop(scrollTop);
            }

        },

        hide: function () {
            if (this.isActive) {
                this.slide.hide();
            }
        },

        clear: function () {
            this.element.off('mousewheel.slide');
            this.element.off('show.slide');
            this.element.off('mouseenter.slide');
            this.element.off('DOMNodeInserted.slide');
            this.element.off('DOMNodeRemoved.slide');
            this.element.off('mouseleave.slide');
            this.element.find(".cornerBar").draggable("destroy");
            this.slide.remove();
        },

        scrollTop: function (top) {
            if (!this.isActive) return;
            top = -Math.abs(parseInt(top, 10) || 0);
            adjustPosition(this, top);
        },

        toBottom: function () {
            if (!this.isActive || this.element.is(":hidden")) return;
            var top = this.element.height() - this.content.height();
            adjustPosition(this, top);
        },

        toTop: function () {
            if (!this.isActive) return;
            adjustPosition(this, 0);
        }

    };

    //私有方法
    //这里top为div的top属性值，为负数
    function adjustPosition(context, top) {
        var minBarHeight = context.options.minBarHeight, element = context.element,
            content = context.content, slide = context.slide, slideBar = context.slideBar;
        var contentHeight = content.height(),
            clientHeight = element.height(),
            slideHeight = slide.height();
        top = parseInt(top) || 0;
        if (top < clientHeight - contentHeight) {
            context.options.bottomCallBack();
        }
        if (top > 0) {
            context.options.topCallBack();
        }
        top = Math.max(clientHeight - contentHeight, top);
        top = Math.min(0, top);
        content.css('top', top + 'px');
        var height = Math.max(clientHeight / contentHeight * slideHeight, minBarHeight);
        var barTop = Math.min(Math.abs(top) / contentHeight * slideHeight, slideHeight - height);
        slideBar.css({ 'top': barTop + 'px', 'height': height + 'px' });
    }


    $.fn.cornerSlide = function (option) {

        if (this.length == 0) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var innerReturn;

        var slideDefault = {
            minBarHeight: 25,
            slideWidth: 8,
            stepHeight: 40,
            slideColor: '#dcdcdc',
            slideBarColor: '#c0c0c0',
            isAutoHide: true, //离开后是否自动隐藏
            topCallBack: $.noop,  //滚动到顶部的回调
            bottomCallBack: $.noop,  //滚动到底部的回调
        };

        this.each(function () {
            var $this = $(this),
                data = $this.data('cornerslide'),
                options = typeof option == 'object' ? option : {};

            if (!data) {
                $this.data('cornerslide', data = new CornerSlide(this, $.extend(slideDefault, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                innerReturn = data[option].call(data, args);
            }
        });

        if (innerReturn !== undefined)
            return innerReturn;
        else
            return this;
    };

})(jQuery);

