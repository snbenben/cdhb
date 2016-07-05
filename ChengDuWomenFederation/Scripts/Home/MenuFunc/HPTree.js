/// <reference path="../../Base/Global.js" />
/// <reference path="../../Common/jquery-1.7.1.js" />
//信息查询子模块
var HPTree = OpenLayers.Class({
    //初始化
    initialize: function (obj) {
        this.pageInitialize();
    },
    pageInitialize: function () {
        var that = this;
        $("#MenuTitle").text("航测数据");
        var tHtml = '' +
            '<div id="treeHome">' +
                '<ul id="hpTree" class="ztree"></ul>' +
            '</div>';
        $("#MenuBody").empty().append(tHtml);
        $("#treeHome").width($("#MenuBody").width()).height($("#MenuBody").height());
        that.initializeTree();
    },
    initializeTree: function () {
        var that = this;
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: that.treeClicked,
                onCheck: that.treeChecked,
            }
        };
        //读取配置数组，构建树结构
        var treeNodesData = [];
        for (var i = 0; i < CDWF.CustomLayer.length; i++) {
            if (!CDWF.CustomLayer[i].isBaseLayer) {
                treeNodesData.push(CDWF.CustomLayer[i]);
            }
        }

        //根据配置数据源，构造Nodes
        //暂空使用假数据
        $.fn.zTree.init($("#hpTree"), setting, CDWF.TreeNode);
    },

    //树状点击事件
    treeClicked: function (event, treeId, treeNode) {
        //alert(treeId + "$" + LjObj.currentTreeObjInfo.treetextid);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        //if (!treeNode.checked) {
        treeObj.checkNode(treeNode, !treeNode.checked, true, true);
        //}
    },
    //树节点check事件
    treeChecked: function (event, treeId, treeNode) {
        //alert(treeId);
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        //获取当前选中的所有节点
        var nodes = treeObj.getCheckedNodes(true);
        var noCheckNodes = treeObj.getCheckedNodes(false);

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].isParent) {
                continue;
            }
            CDWF.MapObj.mapobj.getLayersByName(nodes[i].layerName)[0].setVisibility(true);
            for (var j = 0; j < CDWF.TreeNode.length; j++) {
                for (var m = 0; m < CDWF.TreeNode[j].children.length; m++) {
                    for (var n = 0; n < CDWF.TreeNode[j].children[m].children.length; n++) {
                        if(CDWF.TreeNode[j].children[m].children[n].layerName == nodes[i].layerName){
                            CDWF.TreeNode[j].children[m].children[n].checked = true;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < noCheckNodes.length; i++) {
            if (noCheckNodes[i].isParent) {
                continue;
            }
            CDWF.MapObj.mapobj.getLayersByName(noCheckNodes[i].layerName)[0].setVisibility(false);
            for (var j = 0; j < CDWF.TreeNode.length; j++) {
                for (var m = 0; m < CDWF.TreeNode[j].children.length; m++) {
                    for (var n = 0; n < CDWF.TreeNode[j].children[m].children.length; n++) {
                        if (CDWF.TreeNode[j].children[m].children[n].layerName == noCheckNodes[i].layerName) {
                            CDWF.TreeNode[j].children[m].children[n].checked = false;
                        }
                    }
                }
            }
        }

        //var tempStr = "全部";
        //var tempStr2 = "";
        //if (nodes.length == 0 || nodes[0].check_Child_State == 2) {
        //} else {
        //    tempStr = "";
        //    for (var i = 1; i < nodes.length; i++) {
        //        if (!nodes[i].isParent) {
        //            tempStr += nodes[i].name + ";";
        //            tempStr2 += nodes[i].value + ";";
        //        }
        //    }
        //}
        //$("#" + LjObj.currentTreeObjInfo.treetextid).val(tempStr);
        //$("#" + LjObj.currentTreeObjInfo.treetextid + "_Real").val(tempStr2);
    },

    //板子关闭
    functionClosed: function () {
        var that = this;
        CDWF.CurrentActiveFuncIndex = -1;
        //CDWF.MapObj.clearEles();
        //if (CDWF.isStatistics) {
        //    CDWF.isStatistics = false;
        //    that.statisticsAnimate(false);
        //}
    }
})