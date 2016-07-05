
    //图片预览功能  全局方法--by xyp 
    //点击时调用showImg(imgUrl,index),index为当前要显示的图片的索引值
    var  ImgViewWindow = OpenLayers.Class({
        index: 0,    //index为要显示图片的index值，0为起始值
        imgUrl: null,//图片路径数组
        imgMinUrl: null,//图片缩略图数组
        initialize: function (options) {
            OpenLayers.Util.extend(this, options || {});
            this.imgUrl = [];
            this.imgMinUrl = [];
            this.initpage();
            this.element.on('click', '.imgViewli', $.proxy(this.imgClick, this));
            this.element.on('click', '.imgViewBox', $.proxy(this.closeWindowClick, this));
            this.element.on('click', '.leftBtn', $.proxy(this.leftBtnClick, this));
            this.element.on('click', '.rightBtn', $.proxy(this.rightBtnClick, this));

            var that = this;
            this.element.find(".imgViewContent img").load(function () {
                that.setImgSize.call(that, 1, $(this));
            });
        },
        ClassName: "ImgViewWindow"
    });
    var obj = ImgViewWindow.prototype;
    obj.showImg = function (imgUrl, imgMinUrl, index) {
        if (index == null) {
            index = 0;
        }
        // var imgMinUrl=[];
        if (imgUrl.length != imgMinUrl.length)
            imgMinUrl = imgUrl;
        if (imgUrl.length && index >= 0 && index < imgUrl.length) {
            this.imgUrl = imgUrl;
            this.imgMinUrl = imgMinUrl;
            this.index = index;
            this.element.find(".imgViewRight ul").empty();
            this.element.show();
            for (var i = 0; i < this.imgUrl.length; i++) {
                var strImg = '<li class="imgViewli"><img src="' + this.imgMinUrl[i] + '" class="imgMiniBox"/></li>';
                this.element.find(".imgViewRight ul").append(strImg);
            }
            if (this.index == 0) {
                this.element.find(".leftBtn").addClass("lastImg");
            }
            else if (this.index == this.imgUrl.length - 1) {
                this.element.find(".rightBtn").addClass("lastImg");
            }
            this.element.find(".totalIndex").text(this.imgMinUrl.length);
            this.element.find(".imgViewli").eq(this.index).trigger('click');
            var imgHeight = this.element.find(".imgViewli").eq(this.index).position().top;
            this.element.find(".imgViewRight").cornerSlide("scrollTop", imgHeight);//设置滚动条的位置
            this.windowResize();
        }
    };
    obj.initpage = function () {
        str = '<div class="imgViewBody">' +
                '<div class="imgViewLeft">' +
                    '<div class="imgViewBox">' +
                        '<div class="imgViewContent">' +
                        '<img class="imgSty">' +
                        '</div>' +
                        '<div class="leftBtn"><div class="leftBtnImg"></div></div>' +
                        '<div class="rightBtn"><div class="rightBtnImg"></div></div>' +
                    '</div>' +
                    '<div class="leftBottom">' +
                        '<div class="imgIndex"><span class="currentIndex">0</span>/<span class="totalIndex">0</span></div>' +
                        '<a href="/Scripts/plugins/imgview/img/2.png" target="_blank" title="新窗口显示"><div class="viewBtn viewBtnShowInNewPage"></div></a>' +
                        //'<a href="/Scripts/plugins/imgview/img/2.png" title="下载"><div class="viewBtn viewBtndownloadImg"></div></a>' +
                    '</div>' +
                '</div>' +
                '<div class="imgViewRight">' +
                    '<ul style="padding:0px; margin:0px;"></ul>' +
                '</div>' +
              '</div>';
        this.element = $(str);
        //this.element.appendTo('body');
        $(top.document.body).append(this.element);
        this.element.hide();
        this.element.find(".imgViewRight").cornerSlide({
            slideColor: 'transparent',
            slideBarColor: '#515151'
        });
    };
    obj.imgClick = function (evt) {
        var index = this.element.find(".imgViewli").index(evt.currentTarget);
        this.index = index;
        // var $img = this.element.find(".imgMiniBox").eq(index);
        var img = this.imgUrl[index];
        // this.element.find(".imgViewContent img").attr('src', $img[0].src);
        this.element.find(".imgViewContent img").attr('src', img);
        this.element.find(".imgViewli").removeClass("imgclicksty").eq(index).addClass("imgclicksty");
        // this.element.find(".leftBottom a").attr("href", $img[0].src);
        this.element.find(".leftBottom a").eq(0).attr("href", img + "&isDownload=false");
        this.element.find(".leftBottom a").eq(1).attr("href", img);
        this.element.find(".currentIndex").text(index + 1);
        //this.setImgSize(1);
    };
    obj.leftBtnClick = function (evt) {
        if (this.index == 0) {
            evt.stopPropagation(evt); return;
        }
        this.index -= 1;
        this.changeImg();
        evt.stopPropagation(evt);
    };
    obj.rightBtnClick = function (evt) {
        if (this.index == this.imgUrl.length - 1) {
            evt.stopPropagation(evt); return;
        }
        this.index += 1;
        this.changeImg();
        evt.stopPropagation();
    };
    obj.changeImg = function () {
        if (this.index == 0) {
            this.element.find(".leftBtn").addClass("lastImg");
        }
        else if (this.index == this.imgUrl.length - 1) {
            this.element.find(".rightBtn").addClass("lastImg");
        }
        else {
            this.element.find(".leftBtn").removeClass("lastImg");
            this.element.find(".rightBtn").removeClass("lastImg");
        }
        var imgHeight1 = this.element.find(".imgViewli").eq(this.index).offset().top;
        var imgHeight2 = this.element.find(".imgViewli").eq(this.index).position().top;
        var scroH = $(window).scrollTop();
        if ((imgHeight1 - scroH) > $(window).height() || (imgHeight1 - scroH) < 0) {
            this.element.find(".imgViewRight").cornerSlide("scrollTop", imgHeight2);//设置滚动条的位置
        }
        //else if(){
        //    this.element.find(".imgViewRight").cornerSlide("scrollTop", imgHeight2);//设置滚动条的位置
        //}
        this.element.find(".imgViewli").eq(this.index).trigger('click');
    };
    obj.closeWindowClick = function () {
        this.element.hide();
        this.element.find(".imgSty").css({
            "width": 'auto',
            "height": 'auto',
        });
        this.element.find(".imgSty").attr("src", "");
        this.imgUrl = [];
        this.index = 0;
        $(window).off('resize.imgView');
    };
    obj.windowResize = function () {
        var that = this;
        $(window).on('resize.imgView', function () {
            that.setImgSize(0);
        });
    };
    obj.setImgSize = function (flag, $image) {
        var obj = { //外容器宽高,为了预留出一定的距离，所以宽-80 高-40
            width: this.element.find(".imgViewContent").width() - 80,
            height: this.element.find(".imgViewContent").height() - 40
        };
        if (flag) {
            //设置样式 
            var that = this;
            this.element.find(".imgViewContent").css("line-height", obj.height + 40 + 'px');
            var image = new Image();
            image.src = $image.attr("src");
            image.onload = function () {
                var ss = calculateImgBox($(image), obj.height, obj.width);
                that.element.find(".imgSty").animate({
                    "width": ss.width,
                    "height": ss.height,
                });
            }
        }
        else {
            this.element.find(".imgViewContent").css("line-height", obj.height + 40 + 'px');
            this.element.find(".imgSty").css({
                "max-width": obj.width,
                "max-height": obj.height,
                //"line-height": obj.height+40,
            });
        }
    };
    /*根据比例大小 计算图片的大小*/
    calculateImgBox = function ($img, maxHeight, maxWidth) {
        var height = $img[0].height;
        if (!height) {
            height = $img[0].clientHeight;
        }
        var width = $img[0].width;
        if (!width) {
            width = $img[0].clientWidth;
        }
        if (!maxHeight) {
            maxHeight = $img.css('max-height');
        }
        if (!maxWidth) {
            maxWidth = $img.css('max-width');
        }
        var flag1 = height > maxHeight;
        var flag2 = width > maxWidth;
        var radio = 1;
        if (flag1 || flag2) {
            var radio1 = maxHeight / height;
            var radio2 = maxWidth / width;
            if (radio1 < radio2) {
                height = maxHeight;
                width = width * radio1;
                radio = radio1;
            } else {
                width = maxWidth;
                height = height * radio2;
                radio = radio2;
            }
        }
        return { 'width': width, 'height': height };
    };
