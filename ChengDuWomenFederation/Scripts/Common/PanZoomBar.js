
/*------------------------全局定义-----------------------------*/
 window.Rrteam = {};

 Rrteam.Control = {};

/*-------------------------PanZoomBar类----------------------------*/
//实现一个地图导航的工具类
/* 继承：
*  - <OpenLayers.Control.PanZoom>
*/
 Rrteam.Control.PanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {

     /*-------------------------属性-----------------------------*/

     //left,在地图上的位置
     left: 30,

     //top,在地图上的位置
     top: 50,

     //底图的宽度
     bgImgWidth: 55,

     //底图的高度
     bgImgHeight: 55,

     // 方向按钮的宽度
     directIconWidth: 16,

     // 方向按钮的高度
     directIconHeight: 16,

     //放大，缩小图标的宽度
     zoomIconWidth: 26,

     //放大，缩小图标的高度
     zoomIconHeight: 24,

     //移动图标的宽度
     slideWidth: 20,

     //底图，向上，向左，向右，向下，放大，缩小，导航图标，导航条这些图标的名称
     ImageName: ["backgroundImg.png", "north-mini.png", "west-mini.png", "east-mini.png", "south-mini.png",
    "zoom-plus-mini.png", "zoom-minus-mini.png", "slider.png", "zoom-bar.png"],

     // 设置竖直导航条的宽度
     zoomStopWidth: 26,

     // 导航条地图每增加或减少一级，跳动的高度
     zoomStopHeight: 23,

     //导航条
     slider: null,

     //导航条事件
     sliderEvents: null,

     //DOM节点，zoomBarDiv
     zoomBarDiv: null,

     //div事件
     divEvents: null,

     //点击后地图移动的距离
     slideFactor: 100,

     //按钮数组
     buttons: null,

     //点击图标后执行的回调函数
     panupCallBack: $.noop,
     pandownCallBack: $.noop,
     panleftCallBack: $.noop,
     panrightCallBack: $.noop,
     zoominCallBack: $.noop,
     zoomoutCallBack: $.noop,

     /**
     * Constructor: OpenLayers.Control.PanZoomBar
     */
     initialize: function (options) {
         OpenLayers.Control.PanZoom.prototype.initialize.apply(this, arguments);
     },

     /**
     * APIMethod: destroy
     */
     destroy: function () {

         this.div.removeChild(this.slider);
         this.slider = null;

         this.sliderEvents.destroy();
         this.sliderEvents = null;

         this.div.removeChild(this.zoombarDiv);
         this.zoomBarDiv = null;

         this.divEvents.destroy();
         this.divEvents = null;

         this.map.events.un({
             "zoomend": this.moveZoomBar,
             "changebaselayer": this.redraw,
             scope: this
         });

         OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
     },

     /**
     * 设置地图
     * 
     * Parameters:
     * map - {<OpenLayers.Map>} 
     */
     setMap: function (map) {
         OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
         this.map.events.register("changebaselayer", this, this.redraw);
     },

     /** 
     * Method: redraw
     * clear the div and start over.
     */
     redraw: function () {
         if (this.div != null) {
             this.div.innerHTML = "";
         }
         this.draw();
     },

     /**
     * Method: draw 
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>} 
     */
     draw: function () {
         // initialize our internal div
         OpenLayers.Control.prototype.draw.apply(this, arguments);
         //导航插件摆放的位置
         var location = new OpenLayers.Pixel(this.left, this.top);
         var directW = this.directIconWidth;
         var directH = this.directIconHeight;
         var zoomIconW = this.zoomIconWidth;
         var zoomIconH = this.zoomIconHeight;
         var name = this.ImageName;
         var locationImg = OpenLayers._getScriptLocation() + "image/";
         //添加底图
         //if (this.ImageName[0] != "") {
         //    var backgroundimg = locationImg + name[0];
         //    var bgsz = new OpenLayers.Size(this.bgImgWidth, this.bgImgHeight);
         //    var bgxy = location;
         //    var bg = OpenLayers.Util.createAlphaImageDiv(
         //                           "bg",
         //                           bgxy, bgsz, backgroundimg, "absolute");
         //    this.div.appendChild(bg);
         //}
         //添加向左，向右，向上，向下按钮
         this.buttons = [];

         var centered = location.add(this.bgImgWidth / 2, this.bgImgHeight / 2);
         var sz1 = new OpenLayers.Size(directW, directH); //四个按钮的大小
         var sz2 = new OpenLayers.Size(zoomIconW, zoomIconH); //放大缩小地图两个按钮的大小
         
         //this._addButton("panup", locationImg + name[1], centered.add(-sz1.w * 0.5, -sz1.h * 1.5 + 2), sz1);
         //this._addButton("panleft", locationImg + name[2], centered.add(-sz1.w * 1.5 + 2, -sz1.h * 0.5), sz1);
         //this._addButton("panright", locationImg + name[3], centered.add(sz1.w * 0.5 - 2, -sz1.h * 0.5), sz1);
         //this._addButton("pandown", locationImg + name[4], centered.add(-sz1.w * 0.5, sz1.h * 0.5 - 2), sz1);
         this._addButton("zoomin", locationImg + name[5], centered.add(-sz2.w * 0.5, sz1.h * 1.5 + 15), sz2);
         var centered = this._addZoomBar(centered.add(0, sz1.h * 1.5 + 15 + sz2.h));
         this._addButton("zoomout", locationImg + name[6], centered.add(-sz2.w * 0.5, 0), sz2);
         return this.div;
     },

     /**
     * Method: _addButton
     * 
     * Parameters:
     * id - {String} 
     * img - {String} 
     * xy - {<OpenLayers.Pixel>} 
     * sz - {<OpenLayers.Size>} 
     * 
     * Returns:
     * {DOMElement} A Div (an alphaImageDiv, to be precise) that contains the
     *     image of the button, and has all the proper event handlers set.
     */

     _addButton: function (id, img, xy, sz) {
         var imgLocation = img;
         var btn = OpenLayers.Util.createAlphaImageDiv(
                                    this.id + "_" + id,
                                    xy, sz, imgLocation, "absolute");

         //we want to add the outer div
         this.div.appendChild(btn);
         this.div.style.cursor = "pointer";

         OpenLayers.Event.observe(btn, "mousedown",
            OpenLayers.Function.bindAsEventListener(this.buttonDown, btn));
         OpenLayers.Event.observe(btn, "dblclick",
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
         OpenLayers.Event.observe(btn, "click",
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
         btn.action = id;
         btn.map = this.map;
         btn.slideFactor = this.slideFactor;
         //给button按钮传入回调函数
         btn.panleftCallBack = this.panleftCallBack;
         btn.panrightCallBack = this.panrightCallBack;
         btn.panupCallBack = this.panupCallBack;
         btn.pandownCallBack = this.pandownCallBack;
         btn.zoominCallBack = this.zoominCallBack;
         btn.zoomoutCallBack = this.zoomoutCallBack;

         //we want to remember/reference the outer div
         this.buttons.push(btn);
         return btn;
     },

     /** 
     * Method: _addZoomBar
     * 
     * Parameters:
     * location - {<OpenLayers.Pixel>} where zoombar drawing is to start.
     */
     _addZoomBar: function (centered) {
         var imgLocation = OpenLayers._getScriptLocation() + "image/";
         var id = this.id + "_" + this.map.id;
         var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
         var slider = OpenLayers.Util.createAlphaImageDiv(id,
                       centered.add(-this.slideWidth * 0.5, zoomsToEnd * this.zoomStopHeight),
                       new OpenLayers.Size(21, 12),
                       imgLocation + this.ImageName[7],
                       "absolute");
         this.slider = slider;

         this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
                                            { includeXY: true });
         this.sliderEvents.on({
             "mousedown": this.zoomBarDown,
             "mousemove": this.zoomBarDrag,
             "mouseup": this.zoomBarUp,
             "dblclick": this.doubleClick,
             "click": this.doubleClick
         });

         var sz = new OpenLayers.Size();
         sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();
         sz.w = this.zoomStopWidth;
         var div = null;

         if (OpenLayers.Util.alphaHack()) {
             var id = this.id + "_" + this.map.id;
             div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      new OpenLayers.Size(sz.w,
                                              this.zoomStopHeight),
                                      imgLocation + this.ImageName[8],
                                      "absolute", null, "crop");
             div.style.height = sz.h + "px";
         } else {
             div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered.add(-this.zoomStopWidth * 0.5, 0),
                        sz,
                        imgLocation + this.ImageName[8]);
         }

         this.zoombarDiv = div;

         this.divEvents = new OpenLayers.Events(this, div, null, true,
                                                { includeXY: true });
         this.divEvents.on({
             "mousedown": this.divClick,
             "mousemove": this.passEventToSlider,
             "dblclick": this.doubleClick,
             "click": this.doubleClick
         });
         //  this.div.style.cursor = "pointer";
         this.div.appendChild(div);

         this.startTop = parseInt(div.style.top);
         this.div.appendChild(slider);

         this.map.events.register("zoomend", this, this.moveZoomBar);

         centered = centered.add(0,
            this.zoomStopHeight * this.map.getNumZoomLevels());
         return centered;
     },

     /*
     * Method: passEventToSlider
     * This function is used to pass events that happen on the div, or the map,
     * through to the slider, which then does its moving thing.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
     passEventToSlider: function (evt) {
         this.sliderEvents.handleBrowserEvent(evt);
     },

     /*
     * Method: divClick
     * Picks up on clicks directly on the zoombar div
     *           and sets the zoom level appropriately.
     */
     divClick: function (evt) {
         if (!OpenLayers.Event.isLeftClick(evt)) {
             return;
         }
         var y = evt.xy.y;
         var top = OpenLayers.Util.pagePosition(evt.object)[1];
         var levels = (y - top) / this.zoomStopHeight;
         if (!this.map.fractionalZoom) {
             levels = Math.floor(levels);
         }
         var zoom = (this.map.getNumZoomLevels() - 1) - levels;
         zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
         this.map.zoomTo(zoom);
         OpenLayers.Event.stop(evt);
     },

     /*
     * Method: zoomBarDown
     * event listener for clicks on the slider
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
     zoomBarDown: function (evt) {
         if (!OpenLayers.Event.isLeftClick(evt)) {
             return;
         }
         this.map.events.on({
             "mousemove": this.passEventToSlider,
             "mouseup": this.passEventToSlider,
             scope: this
         });
         this.mouseDragStart = evt.xy.clone();
         this.zoomStart = evt.xy.clone();
         this.div.style.cursor = "pointer"; //拖动时手型
         // reset the div offsets just in case the div moved
         this.zoombarDiv.offsets = null;
         OpenLayers.Event.stop(evt);
     },

     /*
     * Method: zoomBarDrag
     * This is what happens when a click has occurred, and the client is
     * dragging.  Here we must ensure that the slider doesn't go beyond the
     * bottom/top of the zoombar div, as well as moving the slider to its new
     * visual location
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
     zoomBarDrag: function (evt) {
         if (this.mouseDragStart != null) {
             var deltaY = this.mouseDragStart.y - evt.xy.y;
             var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
             if ((evt.clientY - offsets[1]) > 0 &&
                (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                 var newTop = parseInt(this.slider.style.top) - deltaY;
                 this.slider.style.top = newTop + "px";
             }
             this.mouseDragStart = evt.xy.clone();
             OpenLayers.Event.stop(evt);
         }
     },

     /*
     * Method: zoomBarUp
     * Perform cleanup when a mouseup event is received -- discover new zoom
     * level and switch to it.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
     zoomBarUp: function (evt) {
         if (!OpenLayers.Event.isLeftClick(evt)) {
             return;
         }
         if (this.zoomStart) {
             this.div.style.cursor = "pointer";
             this.map.events.un({
                 "mouseup": this.passEventToSlider,
                 "mousemove": this.passEventToSlider,
                 scope: this
             });
             var deltaY = this.zoomStart.y - evt.xy.y;
             var zoomLevel = this.map.zoom;
             if (this.map.fractionalZoom) {
                 zoomLevel += deltaY / this.zoomStopHeight;
                 zoomLevel = Math.min(Math.max(zoomLevel, 0),
                                     this.map.getNumZoomLevels() - 1);
             } else {
                 zoomLevel += Math.round(deltaY / this.zoomStopHeight);
             }
             this.map.zoomTo(zoomLevel);
             this.moveZoomBar();
             this.mouseDragStart = null;
             OpenLayers.Event.stop(evt);
         }
     },

     /*
     * Method: moveZoomBar
     * Change the location of the slider to match the current zoom level.
     */
     moveZoomBar: function () {
         var newTop =
            ((this.map.getNumZoomLevels() - 1) - this.map.getZoom()) *
            this.zoomStopHeight + this.startTop + 1;
         this.slider.style.top = newTop + "px";
     },

     /**
     * Method: buttonDown
     *
     * Parameters:
     * evt - {Event} 
     */
     buttonDown: function (evt) {
         if (!OpenLayers.Event.isLeftClick(evt)) {
             return;
         }

         switch (this.action) {
             case "panup":
                 this.map.pan(0, -this.slideFactor);
                 this.panupCallBack.call(this.panupCallBack);
                 break;
             case "pandown":
                 this.map.pan(0, this.slideFactor);
                 this.pandownCallBack.call(this.pandownCallBack);
                 break;
             case "panleft":
                 this.map.pan(-this.slideFactor, 0);
                 this.panleftCallBack.call(this.panleftCallBack);
                 break;
             case "panright":
                 this.map.pan(this.slideFactor, 0);
                 this.panrightCallBack.call(this.panrightCallBack);
                 break;
             case "zoomin":
                 this.map.zoomIn();
                 this.zoominCallBack.call(this.zoominCallBack);
                 break;
             case "zoomout":
                 this.map.zoomOut();
                 this.zoomoutCallBack.call(this.zoomoutCallBack);
                 break;
         }

         OpenLayers.Event.stop(evt);
     },

     CLASS_NAME: "Rrteam.Control.PanZoomBar"
 });
