/*-------------------------LTZommAnimation类----------------------------*/
//鼠标滚轮缩小至最小限制级别时，重写滚轮事件，地图不再四处滑动
/* 继承：
*  - <OpenLayers.Control.Navigation>
*/
OpenLayers.Control.LTZommAnimation = OpenLayers.Class(OpenLayers.Control.Navigation, {
    initialize: function (options) {
        OpenLayers.Control.Navigation.prototype.initialize.apply(this, arguments);
    },
    wheelUp: function (evt) {
        var newZoom = this.map.getZoom();
        this.wheelChange(evt, 1);
    },
    wheelDown: function (evt) {
        var newZoom = this.map.getZoom();
        this.wheelChange(evt, -1);
    },
    wheelChange: function (evt, deltaZ) {
        var currentZoom = this.map.getZoom();
        var newZoom = this.map.getZoom() + Math.round(deltaZ);
        newZoom = Math.max(newZoom, 0);
        newZoom = Math.min(newZoom, this.map.getNumZoomLevels());
        if (newZoom < 3) {
            this.map.setCenter(new OpenLayers.LonLat(CDWF.Chengdu.x, CDWF.Chengdu.y), 2);
            return;
        }
    }
});