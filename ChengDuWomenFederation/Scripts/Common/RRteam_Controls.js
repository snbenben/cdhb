/*------------------------全局定义-----------------------------*/
window.RRteam = {};

//Rrteam.Control = OpenLayers.Class(Rrteam, {
//});

RRteam.Control = {};
RRteam.Marker = {};

/*---------------------------------------------------------鹰眼控件---------------------------------------------------------*/

/**
* Class: Zondy.Control.OverviewMap
* The OverMap control creates a small overview map, useful to display the 
* extent of a zoomed map and your main map and provide additional 
* navigation options to the User.  By default the overview map is drawn in
* the lower right corner of the main map. Create a new overview map with the
* <Zondy.Control.OverviewMap> constructor.
*
* Inerits from:
*  - <OpenLayers.Control>
*/
RRteam.Control.OverviewMap = OpenLayers.Class(OpenLayers.Control, {

    /**
    * Property: element
    * {DOMElement} The DOM element that contains the overview map
    */
    element: null,

    /**
    * APIProperty: ovmap
    * {<OpenLayers.Map>} A reference to the overview map itself.
    */
    ovmap: null,

    /**
    * APIProperty: size
    * {<OpenLayers.Size>} The overvew map size in pixels.  Note that this is
    * the size of the map itself - the element that contains the map (default
    * class name olControlOverviewMapElement) may have padding or other style
    * attributes added via CSS.
    */
    size: new OpenLayers.Size(160, 160),

    /**
    * APIProperty: layers
    * {Array(<OpenLayers.Layer>)} Ordered list of layers in the overview map.
    * If none are sent at construction, the base layer for the main map is used.
    */
    layers: null,

    /**
    * APIProperty: minRectSize
    * {Integer} The minimum width or height (in pixels) of the extent
    *     rectangle on the overview map.  When the extent rectangle reaches
    *     this size, it will be replaced depending on the value of the
    *     <minRectDisplayClass> property.  Default is 15 pixels.
    */
    minRectSize: 15,

    /**
    * APIProperty: minRectDisplayClass
    * {String} Replacement style class name for the extent rectangle when
    *     <minRectSize> is reached.  This string will be suffixed on to the
    *     displayClass.  Default is "RectReplacement".
    *
    * Example CSS declaration:
    * (code)
    * .olControlOverviewMapRectReplacement {
    *     overflow: hidden;
    *     cursor: move;
    *     background-image: url("img/overview_replacement.gif");
    *     background-repeat: no-repeat;
    *     background-position: center;
    * }
    * (end)
    */
    minRectDisplayClass: "RectReplacement",

    /**
    * APIProperty: minRatio
    * {Float} The ratio of the overview map resolution to the main map
    *     resolution at which to zoom farther out on the overview map.
    */
    minRatio: -1024,

    /**
    * APIProperty: maxRatio
    * {Float} The ratio of the overview map resolution to the main map
    *     resolution at which to zoom farther in on the overview map.
    */
    maxRatio: 1024,

    /**
    * APIProperty: mapOptions
    * {Object} An object containing any non-default properties to be sent to
    *     the overview map's map constructor.  These should include any
    *     non-default options that the main map was constructed with.
    */
    mapOptions: null,

    /**
    * APIProperty: autoPan
    * {Boolean} Always pan the overview map, so the extent marker remains in
    *     the center.  Default is false.  If true, when you drag the extent
    *     marker, the overview map will update itself so the marker returns
    *     to the center.
    */
    autoPan: false,

    /**
    * Property: handlers
    * {Object}
    */
    handlers: null,

    /**
    * Property: resolutionFactor
    * {Object}
    */
    resolutionFactor: 1,

    /**
    * APIProperty: maximized
    * {Boolean} Start as maximized (visible). Defaults to false.
    */
    maximized: true,

    /**
    * Constructor: Zondy.Control.OverviewMap
    * Create a new overview map
    *
    * Parameters:
    * object - {Object} Properties of this object will be set on the overview
    * map object.  Note, to set options on the map object contained in this
    * control, set <mapOptions> as one of the options properties.
    */
    initialize: function (options) {
        this.layers = [];
        this.handlers = {};
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    /**
    * APIMethod: destroy
    * Deconstruct the control
    */
    destroy: function () {
        if (!this.mapDiv) { // we've already been destroyed
            return;
        }
        if (this.handlers.click) {
            this.handlers.click.destroy();
        }
        if (this.handlers.drag) {
            this.handlers.drag.destroy();
        }

        this.ovmap && this.ovmap.eventsDiv.removeChild(this.extentRectangle);
        this.extentRectangle = null;

        if (this.rectEvents) {
            this.rectEvents.destroy();
            this.rectEvents = null;
        }

        if (this.ovmap) {
            this.ovmap.destroy();
            this.ovmap = null;
        }

        this.element.removeChild(this.mapDiv);
        this.mapDiv = null;

        this.div.removeChild(this.element);
        this.element = null;

        if (this.maximizeDiv) {
            OpenLayers.Event.stopObservingElement(this.maximizeDiv);
            this.div.removeChild(this.maximizeDiv);
            this.maximizeDiv = null;
        }

        if (this.minimizeDiv) {
            OpenLayers.Event.stopObservingElement(this.minimizeDiv);
            this.div.removeChild(this.minimizeDiv);
            this.minimizeDiv = null;
        }

        this.map.events.un({
            "moveend": this.update,
            "changebaselayer": this.baseLayerDraw,
            scope: this
        });

        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
    * Method: draw
    * Render the control in the browser.
    */
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!(this.layers.length > 0)) {
            if (this.map.baseLayer) {
                var layer = this.map.baseLayer.clone();
                this.layers = [layer];
            } else {
                this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                return this.div;
            }
        }

        // create overview map DOM elements
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'block';

        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');

        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000;  //HACK
        this.extentRectangle.className = this.displayClass + 'ExtentRectangle';

        this.rectPoint = document.createElement('div');
        this.rectPoint.style.position = 'absolute';
        this.rectPoint.className = this.displayClass + "rectPoint";

        this.extentRectangle.appendChild(this.rectPoint);

        this.element.appendChild(this.mapDiv);

        this.div.appendChild(this.element);

        // Optionally add min/max buttons if the control will go in the
        // map viewport.
        if (!this.outsideViewport) {
            this.div.className += " " + this.displayClass + 'Container';
            this.div.style.overflow = 'hidden';
            var imgLocation = OpenLayers.Util.getImagesLocation();
            // maximize button div
            var img = imgLocation + 'zoom-max.png';
            this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        this.displayClass + 'MaximizeButton',
                                        null,
                                        new OpenLayers.Size(18, 18),
                                        img,
                                        'absolute');
            this.maximizeDiv.style.display = 'none';
            this.maximizeDiv.className = this.displayClass + 'MaximizeButton';
            OpenLayers.Event.observe(this.maximizeDiv, 'click',
                OpenLayers.Function.bindAsEventListener(this.maximizeControl,
                                                        this)
            );
            this.div.appendChild(this.maximizeDiv);

            // minimize button div
            var img = imgLocation + 'zoom-min.png';
            this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        'OpenLayers_Control_minimizeDiv',
                                        null,
                                        new OpenLayers.Size(18, 18),
                                        img,
                                        'absolute');
            this.minimizeDiv.style.display = 'block';
            this.minimizeDiv.className = this.displayClass + 'MinimizeButton';
            OpenLayers.Event.observe(this.minimizeDiv, 'click',
                OpenLayers.Function.bindAsEventListener(this.minimizeControl,
                                                        this)
            );
            this.div.appendChild(this.minimizeDiv);
            var eventsToStop = ['dblclick', 'mousedown'];

            for (var i = 0, len = eventsToStop.length; i < len; i++) {

                OpenLayers.Event.observe(this.maximizeDiv,
                                                     eventsToStop[i],
                                                     OpenLayers.Event.stop);

                OpenLayers.Event.observe(this.minimizeDiv,
                                                     eventsToStop[i],
                                                     OpenLayers.Event.stop);
            }

            //初始化为最小化
            //this.minimizeControl();
        } else {
            // show the overview map
            this.element.style.display = '';
        }
        if (this.map.getExtent()) {
            this.update();
        }

        this.map.events.register('moveend', this, this.update);
        if (this.maximized) {
            this.maximizeControl();
        }
        return this.div;
    },

    /**
    * Method: baseLayerDraw
    * Draw the base layer - called if unable to complete in the initial draw
    */
    baseLayerDraw: function () {
        this.draw();
        this.map.events.unregister("changebaselayer", this, this.baseLayerDraw);
    },

    /**
    * Method: rectDrag
    * Handle extent rectangle drag
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} The pixel location of the drag.
    */
    rectDrag: function (px) {
        var deltaX = this.handlers.drag.last.x - px.x;
        var deltaY = this.handlers.drag.last.y - px.y;
        if (deltaX != 0 || deltaY != 0) {
            var rectTop = this.rectPxBounds.top;
            var rectLeft = this.rectPxBounds.left;
            var rectHeight = Math.abs(this.rectPxBounds.getHeight());
            var rectWidth = this.rectPxBounds.getWidth();
            // don't allow dragging off of parent element
            var newTop = Math.max(0, (rectTop - deltaY));
            newTop = Math.min(newTop,
                              this.ovmap.size.h - this.hComp - rectHeight);
            var newLeft = Math.max(0, (rectLeft - deltaX));
            newLeft = Math.min(newLeft,
                               this.ovmap.size.w - this.wComp - rectWidth);
            this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                       newTop + rectHeight,
                                                       newLeft + rectWidth,
                                                       newTop));
        }
    },

    /**
    * Method: mapDivClick
    * Handle browser events
    *
    * Parameters:
    * evt - {<OpenLayers.Event>} evt
    */
    mapDivClick: function (evt) {
        var pxCenter = this.rectPxBounds.getCenterPixel();
        var deltaX = evt.xy.x - pxCenter.x;
        var deltaY = evt.xy.y - pxCenter.y;
        var top = this.rectPxBounds.top;
        var left = this.rectPxBounds.left;
        var height = Math.abs(this.rectPxBounds.getHeight());
        var width = this.rectPxBounds.getWidth();
        var newTop = Math.max(0, (top + deltaY));
        newTop = Math.min(newTop, this.ovmap.size.h - height);
        var newLeft = Math.max(0, (left + deltaX));
        newLeft = Math.min(newLeft, this.ovmap.size.w - width);
        this.setRectPxBounds(new OpenLayers.Bounds(newLeft,
                                                   newTop + height,
                                                   newLeft + width,
                                                   newTop));
        this.updateMapToRect();
    },

    /**
    * Method: maximizeControl
    * Unhide the control.  Called when the control is in the map viewport.
    *
    * Parameters:
    * e - {<OpenLayers.Event>}
    */
    maximizeControl: function (e) {
        $(".RRteamControlOverviewMapElement").animate({ width: "160px", height: "160px" }, 200);
        $(".RRteamControlOverviewMapMaximizeButton").hide();
        $(".RRteamControlOverviewMapMinimizeButton").show();

    },

    /**
    * Method: minimizeControl
    * Hide all the contents of the control, shrink the size, 
    * add the maximize icon
    * 
    * Parameters:
    * e - {<OpenLayers.Event>}
    */
    minimizeControl: function (e) {
        $(".RRteamControlOverviewMapElement").animate({ width: "18px", height: "18px" }, 200);
        $(".RRteamControlOverviewMapMinimizeButton").hide();
        $(".RRteamControlOverviewMapMaximizeButton").show();

    },



    /**
    * Method: update
    * Update the overview map after layers move.
    */
    update: function () {
        if (this.ovmap == null) {
            this.createMap();
        }

        if (this.autoPan || !this.isSuitableOverview()) {
            this.updateOverview();
        }

        // update extent rectangle
        this.updateRectToMap();
    },

    /**
    * Method: isSuitableOverview
    * Determines if the overview map is suitable given the extent and
    * resolution of the main map.
    */
    isSuitableOverview: function () {
        var mapExtent = this.map.getExtent();
        var maxExtent = this.map.maxExtent;
        var testExtent = new OpenLayers.Bounds(
                                Math.max(mapExtent.left, maxExtent.left),
                                Math.max(mapExtent.bottom, maxExtent.bottom),
                                Math.min(mapExtent.right, maxExtent.right),
                                Math.min(mapExtent.top, maxExtent.top));

        if (this.ovmap.getProjection() != this.map.getProjection()) {
            testExtent = testExtent.transform(
                this.map.getProjectionObject(),
                this.ovmap.getProjectionObject());
        }

        var resRatio = this.ovmap.getResolution() / this.map.getResolution();
        return ((resRatio > this.minRatio) &&
                (resRatio <= this.maxRatio) &&
                (this.ovmap.getExtent().containsBounds(testExtent)));
    },

    /**
    * Method updateOverview
    * Called by <update> if <isSuitableOverview> returns true
    */
    updateOverview: function () {
        var mapRes = this.map.getResolution();
        var targetRes = this.ovmap.getResolution();
        var resRatio = targetRes / mapRes;
        if (resRatio > this.maxRatio) {
            // zoom in overview map
            targetRes = this.minRatio * mapRes;
        } else if (resRatio <= this.minRatio) {
            // zoom out overview map
            targetRes = this.maxRatio * mapRes;
        }
        var center;
        if (this.ovmap.getProjection() != this.map.getProjection()) {
            center = this.map.center.clone();
            center.transform(this.map.getProjectionObject(),
                this.ovmap.getProjectionObject());
        } else {
            center = this.map.center;
        }
        this.ovmap.setCenter(center, this.ovmap.getZoomForResolution(
            targetRes * this.resolutionFactor));
        this.updateRectToMap();
    },

    /**
    * Method: createMap
    * Construct the map that this control contains
    */
    createMap: function () {
        // create the overview map
        var options = OpenLayers.Util.extend(
                        { controls: [], maxResolution: 'auto',
                            fallThrough: false
                        }, this.mapOptions);
        this.ovmap = new OpenLayers.Map(this.mapDiv, options);
        this.ovmap.eventsDiv.appendChild(this.extentRectangle);

        // prevent ovmap from being destroyed when the page unloads, because
        // the OverviewMap control has to do this (and does it).
        OpenLayers.Event.stopObserving(window, 'unload', this.ovmap.unloadDestroy);

        this.ovmap.addLayers(this.layers);

        this.ovmap.zoomTo(1);
        // check extent rectangle border width
        this.wComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-left-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-right-width'));
        this.wComp = (this.wComp) ? this.wComp : 2;
        this.hComp = parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-top-width')) +
                     parseInt(OpenLayers.Element.getStyle(this.extentRectangle,
                                               'border-bottom-width'));
        this.hComp = (this.hComp) ? this.hComp : 2;

        this.handlers.drag = new OpenLayers.Handler.Drag(
            this, { move: this.rectDrag, done: this.updateMapToRect },
            { map: this.ovmap }
        );
        this.handlers.click = new OpenLayers.Handler.Click(
            this, {
                "click": this.mapDivClick
            }, {
                "single": true, "double": false,
                "stopSingle": true, "stopDouble": true,
                "pixelTolerance": 1,
                map: this.ovmap
            }
        );
        this.handlers.click.activate();

        this.rectEvents = new OpenLayers.Events(this, this.extentRectangle,
                                                null, true);
        this.rectEvents.register("mouseover", this, function (e) {
            if (!this.handlers.drag.active && !this.map.dragging) {
                this.handlers.drag.activate();
            }
        });
        this.rectEvents.register("mouseout", this, function (e) {
            if (!this.handlers.drag.dragging) {
                this.handlers.drag.deactivate();
            }
        });

        if (this.ovmap.getProjection() != this.map.getProjection()) {
            var sourceUnits = this.map.getProjectionObject().getUnits() ||
                this.map.units || this.map.baseLayer.units;
            var targetUnits = this.ovmap.getProjectionObject().getUnits() ||
                this.ovmap.units || this.ovmap.baseLayer.units;
            this.resolutionFactor = sourceUnits && targetUnits ?
                OpenLayers.INCHES_PER_UNIT[sourceUnits] /
                OpenLayers.INCHES_PER_UNIT[targetUnits] : 1;
        }
    },

    /**
    * Method: updateRectToMap
    * Updates the extent rectangle position and size to match the map extent
    */
    updateRectToMap: function () {
        // If the projections differ we need to reproject
        var bounds;
        if (this.ovmap.getProjection() != this.map.getProjection()) {
            bounds = this.map.getExtent().transform(
                this.map.getProjectionObject(),
                this.ovmap.getProjectionObject());
        } else {
            bounds = this.map.getExtent();
        }
        var pxBounds = this.getRectBoundsFromMapBounds(bounds);
        if (pxBounds) {
            this.setRectPxBounds(pxBounds);
        }
    },

    /**
    * Method: updateMapToRect
    * Updates the map extent to match the extent rectangle position and size
    */
    updateMapToRect: function () {
        var lonLatBounds = this.getMapBoundsFromRectBounds(this.rectPxBounds);
        if (this.ovmap.getProjection() != this.map.getProjection()) {
            lonLatBounds = lonLatBounds.transform(
                this.ovmap.getProjectionObject(),
                this.map.getProjectionObject());
        }
        this.map.panTo(lonLatBounds.getCenterLonLat());
    },

    /**
    * Method: setRectPxBounds
    * Set extent rectangle pixel bounds.
    *
    * Parameters:
    * pxBounds - {<OpenLayers.Bounds>}
    */
    setRectPxBounds: function (pxBounds) {
        var top = Math.max(pxBounds.top, 0);
        var left = Math.max(pxBounds.left, 0);
        var bottom = Math.min(pxBounds.top + Math.abs(pxBounds.getHeight()),
                              this.ovmap.size.h - this.hComp);
        var right = Math.min(pxBounds.left + pxBounds.getWidth(),
                             this.ovmap.size.w - this.wComp);
        var width = Math.max(right - left, 0);
        var height = Math.max(bottom - top, 0);
        if (width < this.minRectSize || height < this.minRectSize) {
            this.extentRectangle.className = this.displayClass +
                                             this.minRectDisplayClass;
            var rLeft = left + (width / 2) - (this.minRectSize / 2);
            var rTop = top + (height / 2) - (this.minRectSize / 2);
            this.extentRectangle.style.top = Math.round(rTop) + 'px';
            this.extentRectangle.style.left = Math.round(rLeft) + 'px';
            this.extentRectangle.style.height = this.minRectSize + 'px';
            this.extentRectangle.style.width = this.minRectSize + 'px';
        } else {
            this.extentRectangle.className = this.displayClass +
                                             'ExtentRectangle';
            this.extentRectangle.style.top = Math.round(top) + 'px';
            this.extentRectangle.style.left = Math.round(left) + 'px';
            this.extentRectangle.style.height = Math.round(height) + 'px';
            this.extentRectangle.style.width = Math.round(width) + 'px';
        }
        this.rectPxBounds = new OpenLayers.Bounds(
            Math.round(left), Math.round(bottom),
            Math.round(right), Math.round(top)
        );
    },

    /**
    * Method: getRectBoundsFromMapBounds
    * Get the rect bounds from the map bounds.
    *
    * Parameters:
    * lonLatBounds - {<OpenLayers.Bounds>}
    *
    * Returns:
    * {<OpenLayers.Bounds>}A bounds which is the passed-in map lon/lat extent
    * translated into pixel bounds for the overview map
    */
    getRectBoundsFromMapBounds: function (lonLatBounds) {

        //        var leftBottomLonLat = new OpenLayers.LonLat(lonLatBounds.left,
        //                                                     lonLatBounds.bottom);
        //        var rightTopLonLat = new OpenLayers.LonLat(lonLatBounds.right,
        //                                                   lonLatBounds.top);
        //        var leftBottomPx = this.getOverviewPxFromLonLat(leftBottomLonLat);
        //        var rightTopPx = this.getOverviewPxFromLonLat(rightTopLonLat);
        var lonlatcenter = new OpenLayers.LonLat((lonLatBounds.left + lonLatBounds.right) / 2, (lonLatBounds.top + lonLatBounds.bottom) / 2);
        var left = lonlatcenter.lon - 240 * this.map.resolution;
        var right = lonlatcenter.lon + 240 * this.map.resolution;
        var top = lonlatcenter.lat + 160 * this.map.resolution;
        var bottom = lonlatcenter.lat - 160 * this.map.resolution;
        var leftBottomLonLat = new OpenLayers.LonLat(left, bottom);
        var rightTopLonLat = new OpenLayers.LonLat(right, top);
        var leftBottomPx = this.getOverviewPxFromLonLat(leftBottomLonLat);
        var rightTopPx = this.getOverviewPxFromLonLat(rightTopLonLat);
        var bounds = null;
        if (leftBottomPx && rightTopPx) {
            bounds = new OpenLayers.Bounds(leftBottomPx.x, leftBottomPx.y,
                                           rightTopPx.x, rightTopPx.y);
        }
        return bounds;
    },

    /**
    * Method: getMapBoundsFromRectBounds
    * Get the map bounds from the rect bounds.
    *
    * Parameters:
    * pxBounds - {<OpenLayers.Bounds>}
    *
    * Returns:
    * {<OpenLayers.Bounds>} Bounds which is the passed-in overview rect bounds
    * translated into lon/lat bounds for the overview map
    */
    getMapBoundsFromRectBounds: function (pxBounds) {
        var leftBottomPx = new OpenLayers.Pixel(pxBounds.left,
                                                pxBounds.bottom);
        var rightTopPx = new OpenLayers.Pixel(pxBounds.right,
                                              pxBounds.top);
        var leftBottomLonLat = this.getLonLatFromOverviewPx(leftBottomPx);
        var rightTopLonLat = this.getLonLatFromOverviewPx(rightTopPx);
        return new OpenLayers.Bounds(leftBottomLonLat.lon, leftBottomLonLat.lat,
                                     rightTopLonLat.lon, rightTopLonLat.lat);
    },

    /**
    * Method: getLonLatFromOverviewPx
    * Get a map location from a pixel location
    *
    * Parameters:
    * overviewMapPx - {<OpenLayers.Pixel>}
    *
    * Returns:
    * {<OpenLayers.LonLat>} Location which is the passed-in overview map
    * OpenLayers.Pixel, translated into lon/lat by the overview map
    */
    getLonLatFromOverviewPx: function (overviewMapPx) {
        var size = this.ovmap.size;
        var res = this.ovmap.getResolution();
        var center = this.ovmap.getExtent().getCenterLonLat();

        var delta_x = overviewMapPx.x - (size.w / 2);
        var delta_y = overviewMapPx.y - (size.h / 2);

        return new OpenLayers.LonLat(center.lon + delta_x * res,
                                     center.lat - delta_y * res);
    },

    /**
    * Method: getOverviewPxFromLonLat
    * Get a pixel location from a map location
    *
    * Parameters:
    * lonlat - {<OpenLayers.LonLat>}
    *
    * Returns:
    * {<OpenLayers.Pixel>} Location which is the passed-in OpenLayers.LonLat, 
    * translated into overview map pixels
    */
    getOverviewPxFromLonLat: function (lonlat) {
        var res = this.ovmap.getResolution();
        var extent = this.ovmap.getExtent();
        var px = null;
        if (extent) {
            px = new OpenLayers.Pixel(
                        Math.round(1 / res * (lonlat.lon - extent.left)),
                        Math.round(1 / res * (extent.top - lonlat.lat)));
        }
        return px;
    },

    CLASS_NAME: 'RRteam.Control.OverviewMap'
});

/*---------------------------------------------------------测量控件（长度和面积）---------------------------------------------------------*/

/**
* Class: Zondy.Marker.Text
*
* Inherits from:
*  - <OpenLayers.Marker> 
*/
RRteam.Marker.Text = OpenLayers.Class(OpenLayers.Marker, {

    /** 
    * Property: lonLat 
    * {<OpenLayers.LonLat>} 
    */
    lonLat: null,

    /** 
    * Property: lonLat 
    * {<String>}(Html内容)
    */
    content: "",

    /** 
    * Property: size 
    * {<OpenLayers.Size>}
    */
    size: null,

    /** 
    * Property: div
    * {DOMElement}
    */
    div: null,

    /**
    * APIProperty: tolerance
    * {int}(私有)
    */
    tolerance: 7,

    /** 
    * Constructor: Zondy.Marker.Text
    *
    * Parameters:
    * lonLat - {<OpenLayers.LonLat>} 
    * borderColor - {String} 
    * borderWidth - {int} 
    */
    initialize: function (lonLat, content, size, borderColor, borderWidth) {
        this.lonLat = lonLat;
        this.content = content;
        this.size = size;
        this.div = OpenLayers.Util.createDiv();
        this.div.style.overflow = 'hidden';
        this.div.style.backgroundColor = '#EDEDED';
        this.div.style.textAlign = "center";
        this.div.style.fontSize = "12";
        this.div.className = 'ZondyMarkerTextDiv';

        this.events = new OpenLayers.Events(this, this.div, null);
        this.setBorder(borderColor, borderWidth);
    },

    /**
    * Method: destroy 
    */
    destroy: function () {

        this.bounds = null;
        this.div = null;

        OpenLayers.Marker.prototype.destroy.apply(this, arguments);
    },

    /** 
    * Method: setBorder
    * Allow the user to change the box's color and border width
    * 
    * Parameters:
    * color - {String} Default is "#949494"
    * width - {int} Default is 1
    */
    setBorder: function (color, width) {
        if (!color) {
            color = "#949494";
        }
        if (!width) {
            width = 1;
        }
        this.div.style.border = width + "px solid " + color;
    },

    /** 
    * Method: draw
    * 
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    * sz - {<OpenLayers.Size>} 
    * 
    * Returns: 
    * {DOMElement} A new DOM Image with this marker icon set at the 
    *         location passed-in
    */
    draw: function (px) {
        px = px.add(this.tolerance, 0);
        if (!this.size) {
            this.size = new OpenLayers.Size(80, 20);
        }
        OpenLayers.Util.modifyDOMElement(this.div, null, px, this.size);
        this.div.innerHTML = this.content;

        return this.div;
    },

    /**
    * Method: display
    * Hide or show the icon
    * 
    * Parameters:
    * display - {Boolean} 
    */
    display: function (display) {
        this.div.style.display = (display) ? "" : "none";
    },

    CLASS_NAME: "RRteam.Marker.Text"
});

/**
* Class: Zondy.Texts
* Draw divs as 'Texts' on the layer. 
*
* Inherits from:
*  - <OpenLayers.Layer.Markers>
*/
RRteam.Texts = OpenLayers.Class(OpenLayers.Layer.Markers, {

    /**
    * Constructor: Zondy.Texts
    *
    * Parameters:
    * name - {String}
    * options - {Object} Hashtable of extra options to tag onto the layer
    */
    initialize: function (name, options) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
    },

    /** 
    * Method: drawMarker 
    * Calculate the pixel location for the marker, create it, and
    *    add it to the layer's div
    *
    * Parameters: 
    * marker - {<Zondy.Marker.Text>}
    */
    drawMarker: function (marker) {
        var lonLat = marker.lonLat;
        var location = this.map.getLayerPxFromLonLat(lonLat);
        if (location == null) {
            marker.display(false);
        } else {
            var markerDiv = marker.draw(location);
            if (!marker.drawn) {
                this.div.appendChild(markerDiv);
                marker.drawn = true;
            }
        }
    },


    /**
    * APIMethod: removeMarker 
    * 
    * Parameters:
    * marker - {<OpenLayers.Marker.Box>} 
    */
    removeMarker: function (marker) {
        OpenLayers.Util.removeItem(this.markers, marker);
        if ((marker.div != null) &&
            (marker.div.parentNode == this.div)) {
            this.div.removeChild(marker.div);
        }
    },

    CLASS_NAME: "RRteam.Texts"
});

/**
* Class: Zondy.Control.Measure
* Allows for drawing of features for measurements.
*
* Inherits from:
*  - <OpenLayers.Control>
*/
RRteam.Control.Measure = OpenLayers.Class(OpenLayers.Control, {

    /** 
    * APIProperty: handlerOptions
    * {Object} Used to set non-default properties on the control's handler
    */
    handlerOptions: null,

    /**
    * Property: callbacks
    * {Object} The functions that are sent to the handler for callback
    */
    callbacks: null,

    /**
    * Property: displaySystem
    * {String} Display system for output measurements.  Supported values
    *     are 'english', 'metric', and 'geographic'.  Default is 'metric'.
    */
    displaySystem: 'metric',

    /**
    * Property: geodesic
    * {Boolean} Calculate geodesic metrics instead of planar metrics.  This
    *     requires that geometries can be transformed into Geographic/WGS84
    *     (if that is not already the map projection).  Default is false.
    */
    geodesic: false,

    /**
    * Property: displaySystemUnits
    * {Object} Units for various measurement systems.  Values are arrays
    *     of unit abbreviations (from OpenLayers.INCHES_PER_UNIT) in decreasing
    *     order of length.
    */
    displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },

    /**
    * Property: delay
    * {Number} Number of milliseconds between clicks before the event is
    *     considered a double-click.  The "measurepartial" event will not
    *     be triggered if the sketch is completed within this time.  This
    *     is required for IE where creating a browser reflow (if a listener
    *     is modifying the DOM by displaying the measurement values) messes
    *     with the dblclick listener in the sketch handler.
    */
    partialDelay: 100,

    /**
    * Property: delayedTrigger
    * {Number} Timeout id of trigger for measurepartial.
    */
    delayedTrigger: null,

    /**
    * APIProperty: persist
    * {Boolean} Keep the temporary measurement sketch drawn after the
    *     measurement is complete.  The geometry will persist until a new
    *     measurement is started, the control is deactivated, or <cancel> is
    *     called.
    */
    persist: true,

    /** 
    * Property: texts
    * {<Zondy.Texts>}(私有)
    */
    texts: null,

    /** 
    * Property: closeMarkers
    * {<OpenLayers.Layer.Markers>}(私有)
    */
    closeMarkers: null,

    /**
    * APIProperty: tolerance
    * {int}(私有)
    */
    tolerance: 15,
    /**
    * APIProperty: stat
    * {Array}(私有)
    */
    stat: null,

    /**
    * APIProperty: order
    * {int}(私有)
    */
    order: null,

    /**
    * APIProperty: measureLayer
    * {OpenLayers.Layer.Vector}(私有)
    */
    measureLayer: null,

    /**
    * APIProperty: immediate
    * {Boolean} Activates the immediate measurement so that the "measurepartial"
    *     event is also fired once the measurement sketch is modified.
    *     Default is false.
    */
    immediate: true,

    xiaoqiang: null,

    /**
    * Constructor: Zondy.Control.Measure
    * 
    * Parameters:
    * handler - {<OpenLayers.Handler>} 
    * options - {Object} 
    */
    initialize: function (handler, options) {

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        var callbacks = { done: this.measureComplete,
            point: this.measurePartial
        };
        if (this.immediate) {
            callbacks.modify = this.measureImmediate;
        }
        this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
        /// no clicked
        this.clicked = false;
        //measure layer style
        this.measureStyles = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                pointRadius: "${type}", // sized according to type attribute
                fillColor: "#CAFF70",
                fillOpacity: 0.3,
                strokeColor: "#ff9933",
                strokeWidth: 2,
                graphicZIndex: 1
            })
        });

        // style the sketch fancy
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "#556B2F",
                fillOpacity: 0.5,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#8B814C",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3,
                strokeDashstyle: "dash"
            }
        };
        this.style = new OpenLayers.Style();
        this.style.addRules([
                new OpenLayers.Rule({ symbolizer: sketchSymbolizers })
            ]);
        var styleMap = new OpenLayers.StyleMap({ "default": this.style });
        // let the handler options override, so old code that passes 'persist' 
        // directly to the handler does not need an update
        this.handlerOptions = OpenLayers.Util.extend(
            { persist: this.persist, layerOptions: { styleMap: styleMap }
            }, this.handlerOptions
        );
        this.handler = new handler(this, this.callbacks, this.handlerOptions);

    },
    /**
    * APIMethod: activate
    */
    draw: function (px) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.div.style.border = "solid red 1px";
        this.div.style.backgroundColor = "#E2ECFA";
        this.div.style.fontSize = "12";

        //when first click,we can draw it
        if (this.clicked) {
            if (this.handler.CLASS_NAME.indexOf('Path') > -1) {//measure length
                this.div.innerHTML = "";
                var element = document.createElement("div");
                //change units
                this.changeUnits();
                element.innerHTML = "总长: <b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b>" + this.stat[1] + "<br>单击确定地点，双击结束";
                this.div.appendChild(element);
            } else { //measure area
                this.div.innerHTML = "";
                var element = document.createElement("div");
                //change units
                this.changeUnits();
                element.innerHTML = "当前面积: <b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b>平方" + this.stat[1] + "<br>单击确定地点，双击结束";
                this.div.appendChild(element);
            }

        }
        if (!this.clicked) {
            //this.div.appendChild(document.createTextNode("单击确定起点"));
            this.div.appendChild(document.createTextNode(""));
            this.map.events.register('mouseover', this, this.showDiv);
            this.map.events.register('mouseout', this, this.hideDiv);
        }
        //first create measure layer
        if (!this.measureLayer) {
            this.measureLayer = new OpenLayers.Layer.Vector("measureLayer", {
                styleMap: this.measureStyles
            });
            this.map.addLayer(this.measureLayer);
        }
        //first create texts layer
        if (!this.texts) {
            this.texts = new RRteam.Texts("measureTexts");
            this.map.addLayer(this.texts);
            this.pointIndex = 0;
        }
        //first create close marker layer
        if (!this.closeMarkers) {
            this.closeMarkers = new OpenLayers.Layer.Markers("measureClose");
            this.map.addLayer(this.closeMarkers);
        }
        return this.div;
    },
    /** 
    * Method: showDiv
    *  show the div
    */
    showDiv: function (evt) {

        this.div.style.left = evt.xy.x + this.tolerance + "px";
        this.div.style.top = evt.xy.y + this.tolerance + "px";

        this.div.style.display = "";
    },
    /** 
    * Method: hideDiv
    *  hide the div
    *
    */
    hideDiv: function () {
        //Hide div
        this.div.style.display = "none";
    },
    /** 
    * Method: changeDiv
    *  change the div
    *
    */
    changeDivContent: function () {
        this.clicked = true;
        this.div.innerHTML = "";
        this.draw();
        this.div.style.display = "";
    },
    /**
    * APIMethod: activate
    */
    activate: function () {
        return OpenLayers.Control.prototype.activate.apply(this, arguments);
    },

    /**
    * APIMethod: deactivate
    */
    deactivate: function () {
        this.cancelDelay();
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },

    /**
    * APIMethod: cancel
    * Stop the control from measuring.  If <persist> is true, the temporary
    *     sketch will be erased.
    */
    cancel: function () {
        this.cancelDelay();
        this.handler.cancel();
    },

    /**
    * APIMethod: setImmediate
    * Sets the <immediate> property. Changes the activity of immediate
    * measurement.
    */
    setImmediate: function (immediate) {
        this.immediate = immediate;
        if (this.immediate) {
            this.callbacks.modify = this.measureImmediate;
        } else {
            delete this.callbacks.modify;
        }
    },
    /**
    * APIMethod: changeUnits
    * change units
    */
    changeUnits: function () {
        //change units
        if (this.stat) {
            if (this.stat[1] == "km") {
                this.stat[1] = "公里";
            } else if (this.stat[1] == "m") {
                this.stat[1] = "米";
            }
        }
    },
    /**
    * Method: updateHandler
    *
    * Parameters:
    * handler - {Function} One of the sketch handler constructors.
    * options - {Object} Options for the handler.
    */
    updateHandler: function (handler, options) {
        var active = this.active;
        if (active) {
            this.deactivate();
        }
        this.handler = new handler(this, this.callbacks, options);
        if (active) {
            this.activate();
        }
    },

    /**
    * Method: measureComplete
    * Called when the measurement sketch is done.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    */
    measureComplete: function (geometry) {
        this.cancelDelay();
        this.measure(geometry);
        var geoObj = geometry.components;
        //change units
        this.changeUnits();
        var feature = new OpenLayers.Feature.Vector(geometry);
        this.xiaoqiang = feature;
        this.measureLayer.addFeatures([feature]);

        if (geometry.CLASS_NAME.indexOf('LineString') > -1) {
            this.lonLat = new OpenLayers.LonLat(geoObj[this.pointIndex - 1].x, geoObj[this.pointIndex - 1].y);
            //add text
            var content = "总长: <b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b>" + this.stat[1];
            var text = new RRteam.Marker.Text(this.lonLat, content, new OpenLayers.Size(150, 20));
            this.texts.addMarker(text);

        } else {
            var geoPoly = geoObj[0].components;
            this.lonLat = new OpenLayers.LonLat(geoPoly[this.pointIndex - 1].x, geoPoly[this.pointIndex - 1].y);
            //add text
            var content = "总面积: <b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b>平方" + this.stat[1];
            var text = new RRteam.Marker.Text(this.lonLat, content, new OpenLayers.Size(200, 20));
            this.texts.addMarker(text);
        }
        //add close marker
        //var imageLoaction = OpenLayers.Util.getImagesLocation();
        var imageLoaction = OpenLayers._getScriptLocation() + "image/";
        var close = new OpenLayers.Marker(this.lonLat, new OpenLayers.Icon(imageLoaction + "measureclose.png", new OpenLayers.Size(18, 18)));
        close.events.register('click', this, function () {
            this.measureLayer.removeFeatures([feature]);
            this.closeMarkers.clearMarkers();
            this.texts.clearMarkers();
            this.map.removeLayer(this.measureLayer);
            this.map.removeLayer(this.closeMarkers);
            this.map.removeLayer(this.texts);
        });
        close.events.register('mouseover', this, function () {
            close.icon.imageDiv.style.cursor = "pointer";
            close.icon.imageDiv.title = "清除本次测量";
        });
        this.closeMarkers.addMarker(close);

        //Complete
        this.map.events.unregister('mouseover', this, this.showDiv);
        this.map.events.unregister('mouseout', this, this.hideDiv);
        this.div.innerHTML = "";
        this.hideDiv();
        this.deactivate();
    },

    /**
    * Method: measurePartial
    * Called each time a new point is added to the measurement sketch.
    *
    * Parameters:
    * point - {<OpenLayers.Geometry.Point>} The last point added.
    * geometry - {<OpenLayers.Geometry>} The sketch geometry.
    */
    measurePartial: function (point, geometry) {
        this.cancelDelay();
        geometry = geometry.clone();

        // when we're wating for a dblclick, we have to trigger measurepartial
        // after some delay to deal with reflow issues in IE
        if (this.handler.freehandMode(this.handler.evt)) {
            // no dblclick in freehand mode
            this.measure(geometry);
            if (geometry.CLASS_NAME.indexOf('LineString') > -1) {//measure length
                var geoObj = geometry.components;
                //change units
                this.changeUnits();
                if (this.pointIndex == 0) {
                    var lonLat = new OpenLayers.LonLat(geoObj[0].x, geoObj[0].y);
                    var text = new RRteam.Marker.Text(lonLat, "<b><font color='#5E5E5E'>起点", new OpenLayers.Size(50, 20));
                    this.texts.addMarker(text);
                    this.pointIndex++;

                } else {
                    var lonLat = new OpenLayers.LonLat(geoObj[this.pointIndex].x, geoObj[this.pointIndex].y);
                    var content = "<b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b>" + this.stat[1];
                    var text = new RRteam.Marker.Text(lonLat, content, new OpenLayers.Size(80, 20));
                    this.texts.addMarker(text);
                    this.pointIndex++;
                }
            } else {//measure area
                this.pointIndex++;
            }

        } else {
            this.delayedTrigger = window.setTimeout(
                OpenLayers.Function.bind(function () {
                    this.delayedTrigger = null;
                    this.measure(geometry);
                    var geoObj = geometry.components;
                    //change units
                    this.changeUnits();
                    if (geometry.CLASS_NAME.indexOf('LineString') > -1) {//measure length

                        if (this.pointIndex == 0) {
                            var lonLat = new OpenLayers.LonLat(geoObj[0].x, geoObj[0].y);
                            var text = new RRteam.Marker.Text(lonLat, "<b><font color='#5E5E5E'>起点", new OpenLayers.Size(50, 20));
                            this.texts.addMarker(text);
                            this.pointIndex++;
                        } else {
                            var lonLat = new OpenLayers.LonLat(geoObj[this.pointIndex].x, geoObj[this.pointIndex].y);
                            var content = "<b><font color='red'>" + this.stat[0].toFixed(2) + "</font></b><font color='#5E5E5E'>" + this.stat[1] + "</font>";
                            var text = new RRteam.Marker.Text(lonLat, content, new OpenLayers.Size(80, 20));
                            this.texts.addMarker(text);
                            this.pointIndex++;
                        }
                    } else {//measure area
                        this.pointIndex++;
                    }

                }, this),
                this.partialDelay
            );
        }
    },

    /**
    * Method: measureImmediate
    * Called each time the measurement sketch is modified.
    * 
    * Parameters: point - {<OpenLayers.Geometry.Point>} The point at the
    * mouseposition. feature - {<OpenLayers.Feature.Vector>} The sketch feature.
    */
    measureImmediate: function (point, feature, drawing) {
        if (drawing && this.delayedTrigger === null &&
                                !this.handler.freehandMode(this.handler.evt)) {
            this.measure(feature.geometry);
            //change main div
            this.changeDivContent();
        }
    },

    /**
    * Method: cancelDelay
    * Cancels the delay measurement that measurePartial began.
    */
    cancelDelay: function () {
        if (this.delayedTrigger !== null) {
            window.clearTimeout(this.delayedTrigger);
            this.delayedTrigger = null;
        }
    },

    /**
    * Method: measure
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * eventType - {String}
    */
    measure: function (geometry) {
        var order;
        if (geometry.CLASS_NAME.indexOf('LineString') > -1) {
            this.stat = this.getBestLength(geometry);
            this.order = 1; //测量距离
        } else {
            this.stat = this.getBestArea(geometry);
            this.order = 2; //测量面积
        }
    },

    /**
    * Method: getBestArea
    * Based on the <displaySystem> returns the area of a geometry.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    *
    * Returns:
    * {Array([Float, String])}  Returns a two item array containing the
    *     area and the units abbreviation.
    */
    getBestArea: function (geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for (var i = 0, len = units.length; i < len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit);
            if (area > 1) {
                break;
            }
        }
        return [area, unit];
    },

    /**
    * Method: getArea
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * units - {String} Unit abbreviation
    *
    * Returns:
    * {Float} The geometry area in the given units.
    */
    getArea: function (geometry, units) {
        var area, geomUnits;
        if (this.geodesic) {
            area = geometry.getGeodesicArea(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if (inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area * 1.609344 * 1.609344 / 4;
    },

    /**
    * Method: getBestLength
    * Based on the <displaySystem> returns the length of a geometry.
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    *
    * Returns:
    * {Array([Float, String])}  Returns a two item array containing the
    *     length and the units abbreviation.
    */
    getBestLength: function (geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for (var i = 0, len = units.length; i < len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit);
            if (length > 1) {
                break;
            }
        }
        return [length, unit];
    },

    /**
    * Method: getLength
    *
    * Parameters:
    * geometry - {<OpenLayers.Geometry>}
    * units - {String} Unit abbreviation
    *
    * Returns:
    * {Float} The geometry length in the given units.
    */
    getLength: function (geometry, units) {
        var length, geomUnits;
        if (this.geodesic) {
            length = geometry.getGeodesicLength(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if (inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length * 1.609344 / 2;
    },
    destroyed: function () {

        this.map.events.unregister('mouseover', this, this.showDiv);
        this.map.events.unregister('mouseout', this, this.hideDiv);
        this.div.innerHTML = "";
        this.hideDiv();

        this.closeMarkers.clearMarkers();
        this.texts.clearMarkers();
        if (this.measureLayer) {
            this.measureLayer.destroyFeatures();
        }
        if (this.map.getLayer(this.measureLayer)) {
            this.map.removeLayer(this.measureLayer);
        }
        if (this.map.getLayer(this.closeMarkers)) {
            this.map.removeLayer(this.closeMarkers);
        }
        if (this.map.getLayer(this.texts)) {
            this.map.removeLayer(this.texts);
        }
        this.deactivate();
    },
    CLASS_NAME: "RRteam.Control.Measure"
});
