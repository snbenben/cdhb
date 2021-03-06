﻿/// <reference path="Global.js" />
window.CDWF.Map = OpenLayers.Class({

    mapobj: null,

    markerLayer: new OpenLayers.Layer.Markers('markersLayer'),

    popupLayer: new OpenLayers.Layer('popupLayer'),

    popupArray: [],

    yellowLayer: new OpenLayers.Layer.Vector("YELLOW", {
        styleMap: new OpenLayers.StyleMap({
            'default': {
                strokeColor: "#000000",
                strokeOpacity: 1,
                strokeWidth: 1,
                fillColor: "#000000",
                fillOpacity: 0.1,
                graphicName: "star",
                pointRadius: 0,
                label: "${id}",
                fontColor: "${mycolor}",
                fontSize: "12px",
                fontWeight: "bolder",
                labelAlign: "lm",
                labelXOffset: 8,
                labelYOffset: 2
            }
        })
    }),
    /*初始化地图*/
    initialize: function (mapid, layerUrlArr) {
        //var mapMousePosition = new OpenLayers.Control.MousePosition();
        var mapNav = new OpenLayers.Control.Navigation({
            dragPanOptions: {         //惯性滑动,
                enableKinetic: {       //enableKinetic,可以设为bool，也可设为object,设为object时,object会考到{<OpenLayers.Kinetic> 的构造函数中
                    deceleration: 0.0135
                }
            },
            handleRightClicks: true  //屏蔽右键
        });
        var panzoombar = new Rrteam.Control.PanZoomBar({
            left: $("#Map").width() - 100,
            top: $("#Map").height() - 600
        });
        /*OLD*/
        //this.xMinMap = 90
        //this.yMinMap = 22.5
        //this.xMaxMap = 112.5
        //this.yMaxMap = 45
        var minLevelScrollControl = new OpenLayers.Control.LTZommAnimation();
        //this.mapobj = new OpenLayers.Map(mapid, {
        //    maxExtent: new OpenLayers.Bounds(90, 22.5, 112.5, 45), //90,0,135,40.9798980696202  90, 0, 135, 45
        //    controls: [mapNav, minLevelScrollControl, panzoombar],
        //    numZoomLevels: 8,
        //    maxResolution: (45 - 22.5) / 256,
        //    theme: null
        //    //restrictedExtent: new OpenLayers.Bounds(96, 25, 110, 35)
        //});

        //var layerUrlArr = [{ 'name': 'basicDitu', 'url': 'SCMAP' }, { 'name': 'testDitu', 'url': 'clip' }];
        //this.addLayersByName(CDWF.CustomLayer); //添加自定义图层
        /*OLD*/
        //////////////////////////////////////////////////////
        //加载天地图影像作为底图
        this.mapobj = new OpenLayers.Map(mapid, {
            maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90),
            //layers: [
            //    new Zondy.Map.TianDiTuLayer("天地图影像", {
            //        //TianDitu类型
            //        layerType: Zondy.Enum.TiandituType.IMG,
            //        //是否作为基础图层显示
            //        isBaseLayer: true,
            //        //是否可见
            //        visibility: true
            //    }),
            //    new Zondy.Map.TianDiTuLayer("天地图影像注记", {
            //        //TianDitu类型
            //        layerType: Zondy.Enum.TiandituType.CIA,
            //        isBaseLayer: false,
            //        visibility: true
            //    })
            //],
            controls: [mapNav, minLevelScrollControl, panzoombar],
            numZoomLevels: 18
        });

        var tidituLayersBase = new Zondy.Map.TianDiTuLayer("天地图影像", {
            //TianDitu类型
            layerType: Zondy.Enum.TiandituType.IMG,
            //是否作为基础图层显示
            isBaseLayer: true,
            //是否可见
            visibility: true
        });

        var tidituLayers = new Zondy.Map.TianDiTuLayer("天地图影像注记", {
            //TianDitu类型
            layerType: Zondy.Enum.TiandituType.CIA,
            isBaseLayer: false,
            visibility: true
        });

        var arcgis93restLayers = new OpenLayers.Layer.ArcGIS93Rest("ArcGIS Server Layer",
                    "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/export",
                    { layers: "show:0,2", isBaseLayer: false, visibility: true });
        //添加图层
        this.mapobj.addLayers([tidituLayersBase, tidituLayers, arcgis93restLayers]);

        //marker图层
        //this.mapobj.addLayer(this.markerLayer);

        var polygon_layer = new OpenLayers.Layer.Vector("polygonLayer");
        var point_layer = new OpenLayers.Layer.Vector("pointLayer");

        this.mapobj.addLayers([point_layer, polygon_layer, this.yellowLayer]);
        this.mapobj.setCenter(new OpenLayers.LonLat(CDWF.Chengdu.x, CDWF.Chengdu.y), 7);

        window.drawControls = {
            point: new OpenLayers.Control.DrawFeature(point_layer, OpenLayers.Handler.Point),
            polygon: new OpenLayers.Control.DrawFeature(polygon_layer, OpenLayers.Handler.Polygon)
        };
        for (var key in drawControls) {
            this.mapobj.addControl(drawControls[key]);
        }

        //var map = this.mapobj;
        //this.mapobj.events.register('click', this.mapobj, function (e) {
        //    var position = map.getLonLatFromPixel(e.xy);
        //});

        //this.limiteZoonLevel(2, 7);
        //this.addProvinceBorder();
        CDWF.MapObj = this.mapobj;
        return this;
    },

    /*设置地图可以缩放的级别*/
    limiteZoonLevelSpecial: function () {
        this.mapobj.isValidZoomLevel = function (zoomLevel) {
            return ((zoomLevel != null) &&
                (zoomLevel >= 0) && // 最小级
                (zoomLevel < 8));
        }
    },

    limiteZoonLevel: function (minLevel, maxLevel) {
        minLevel = minLevel || 0;  //如果没有传入minLevel,则默认为0
        maxLevel = maxLevel || this.mapobj.numZoomLevels;
        this.mapobj.isValidZoomLevel = function (zoomLevel) {
            return ((zoomLevel != null) &&
                (zoomLevel >= minLevel) && // 最小级
                (zoomLevel <= maxLevel));
        }
    },
    /*
    *根据图层的基本信息，得到图层
    *Paranmeters:
    *nameArr  - [object] -图层基本信息 包括 图层的名称、图层的地址
    *Returns:
    *layerArr - {openLayers Layer} 得到 的结果图层
    */
    addLayersByName: function (nameArr) {
        var layerArr = [];
        for (var i = 0; i < nameArr.length; i++) {
            var isBaseLayer = false;
            var isVisiable = false;
            if (i == 0) {
                isBaseLayer = true;
                isVisiable = true;
            }
            //定义瓦片图层
            var titleLayer = new Zondy.Map.TileLayerForMetro(nameArr[i].name, '', {
                baseUrl: baseUrl + 'Content/' + nameArr[i].url + '/IMG',
                isBaseLayer: isBaseLayer,
                visibility: isVisiable
            });
            layerArr.push(titleLayer);
        }
        this.mapobj.addLayers(layerArr);
    },

    addProvinceBorder: function () {
        var data = CDWF.Chengdu.region.split(';');
        var boderLayer = new OpenLayers.Layer.Vector('borderLayer');
        //元素样式
        var featureStyle = {
            strokeColor: "yellow",
            fillColor: "yellow",
            fillOpacity: 1,
            strokeWidth: 2,
            pointerEvents: "visiblePainted"
        };

        /*根据OpenLayers高亮的原理：先得到点坐标，再组合成线元素，最后形成区元素*/
        var length = data.length;
        var pointList = [];
        for (var i = 0; i < length; i++) {
            var point = data[i].split(',');
            var newPoint = new OpenLayers.Geometry.Point(point[0], point[1]);
            pointList.push(newPoint);
        }
        pointList.push(pointList[0]);
        var lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList), null, featureStyle); //形成区元素
        boderLayer.addFeatures([lineFeature]);
        this.mapobj.addLayer(boderLayer);
    },

    //创建Marker
    /*
    * 参数obj {Object}
    *   markerID:marker的ID
    *   baseLayer:markers所在图层
    *   popid:与marker相关的POP
    *   longitude:经度
    *   latitude：纬度
    *   imgSrc:marker图片路径
    *   size:markerSize
    *   index:markerIndex
    *   html:pophtml
    */
    createMarker: function (obj) {
        var that = this;
        var size = new OpenLayers.Size(obj.size.w * 2 / 3, obj.size.h * 2 / 3);
        var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
        var icon = new OpenLayers.Icon(baseUrl + obj.imgSrc, size, offset);
        var marker = new OpenLayers.Marker(new OpenLayers.LonLat(obj.longitude, obj.latitude), icon.clone());
        marker.id = obj.markerID;
        obj.baseLayer.addMarker(marker);
        if (obj.html == "") {
            return marker;
        }
        marker.events.register("mousedown", marker, mousedown);
        function mousedown() {
            $(".olPopup").css("display", "none");
            if (CDWF.PopArr[obj.index] == null || CDWF.PopArr[obj.index] == undefined) {
                var pop = that.createPopup({
                    id: obj.popid,
                    longitude: obj.longitude,
                    latitude: obj.latitude,
                    width: obj.pw,
                    height: obj.ph,
                    html: obj.html
                });
                pop.show();
                obj.popCallback.call(obj.popCallback);
                CDWF.PopArr[obj.index] = pop;
            } else {
                //obj.popCallback.call(obj.popCallback);
                CDWF.PopArr[obj.index].show();
            }
            if (obj.callback != null) {
                obj.callback.call(obj.callback, this);
            }
        }
        return marker;
    },
    //创建PopUp
    /*
    * 参数obj {Object}
    *   id:pop的ID
    *   longitude:经度
    *   latitude：纬度
    *   width:宽
    *   height:高
    *   html:pop里面的内容
    */
    createPopup: function (obj) {
        var popup = new OpenLayers.Popup.NestFramedCloud(obj.id,
            new OpenLayers.LonLat(obj.longitude, obj.latitude),
            new OpenLayers.Size(obj.width, obj.height),
            obj.html,
            null,
            true);
        popup.hide();
        this.mapobj.addPopup(popup);
        return popup;
    },

    createText: function (obj) {
        var that = this;
        //文字显示
        var point = new OpenLayers.Geometry.Point(obj.x, obj.y);
        feature = new OpenLayers.Feature.Vector(point);
        feature.attributes.id = obj.name;
        feature.attributes.mycolor = obj.color;
        features = [feature];
        this.yellowLayer.addFeatures(features);
        return feature;
    },
    //清空图上要素
    clearEles: function () {
        var that = this;
        //清除标注
        if (CDWF.TextArr.length > 0) {
            that.yellowLayer.removeFeatures(CDWF.TextArr);
        }
        CDWF.TextArr = [];

        for (var m = 0; m < CDWF.MarkerArr.length; m++) {
            CDWF.MarkerLayer.removeMarker(CDWF.MarkerArr[m]);
        }
        for (var n = 0; n < CDWF.PopArr.length; n++) {
            if (CDWF.PopArr[n] == null || CDWF.PopArr[n] == undefined) {
                continue;
            }
            CDWF.MapObj.mapobj.removePopup(CDWF.PopArr[n]);
        }
        CDWF.MarkerArr = [];
        CDWF.PopArr = [];
        if (CDWF.MarkerLayer != null) {
            CDWF.MapObj.mapobj.removeLayer(CDWF.MarkerLayer);
        }
        CDWF.MarkerLayer = null;
        CDWF.MarkerLastSelected = null;
        //LjObj.MarkersLastSeleted[LjObj.MenuSelectedIndex] = null;
    },

    OBJECT_NAME: 'window.CDWF.Map'
});