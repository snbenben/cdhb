/// <reference path="../../Base/Global.js" />
/// <reference path="../../Common/jquery-1.7.1.js" />
//信息查询子模块
window.ImgArr = [
        baseUrl + "Content/CDHPIMG/DSC00073-1.jpg",
        baseUrl + "Content/CDHPIMG/DSC00073-2.jpg",
        baseUrl + "Content/CDHPIMG/DSC00073-3.jpg"
];
var projectQuery = OpenLayers.Class({
    currentData: null,
    //假数据统计组，逻辑比较混乱 后期改
    currentTempData: [],
    currentDetailsData: null,
    currentMarkerData: [],
    totalPages: 0,
    nowPage: 1,
    pageCount: 10,
    totalData: [],
    isAll: "查看全部",
    isStatistic: false,
    //初始化
    initialize: function (obj) {
        this.pageInitialize();
    },
    pageInitialize: function () {
        var that = this;
        $("#MenuTitle").text("数据查询");
        var html = '' +
            '<div id="queryConditions">' +
                '<div class="MenuCommonElement"><div class="MenuElementsTitle">行政区划</div></div>' +
                '<div class="MenuCommonElement"><select id="QueryCity">' + util_GetCityAll() + '</select><select id="QueryCounty"><option value="">全部</option></select></div>' +
                '<div class="MenuCommonElement"><select id="QueryTown"><option value="">全部</option></select></div>' +
                '<div class="MenuCommonElement"><div class="MenuElementsTitle">环境问题</div></div>' +
                //'<div class="MenuCommonElement">' +
                //    '<select id="QueryType">' + util_GetChanYeType() + '</select>' +
                // '</div>' +
                 '<div class="MenuCommonElement">' +
                    '<select id="QueryEType">' + util_GetEnviromentType() + '</select>' +
                 '</div>' +
                //'<div class="MenuCommonElement"><div class="MenuElementsTitle">主要产品</div></div>' +
                //'<div class="MenuCommonElement"><input id="QueryProduct" type="text" value="关键字模糊检索"/></div>' +
                '<div class="MenuCommonElement"><div class="MenuElementsTitle">航测时间</div></div>' +
                //'<div class="MenuCommonElement"><input id="QueryYearMin" class="QueryYear" type="text"/><div class="QueryMiddle">至</div><input id="QueryYearMax" class="QueryYear" type="text"/></div>' +
                '<div class="MenuCommonElement"><input id="QueryTimeMin" class="QueryYear" type="text"/><div class="QueryMiddle">至</div><input id="QueryTimeMax" class="QueryYear" type="text"/></div>' +
                //'<div class="MenuCommonElement"><div class="MenuElementsTitle">从业人数区间（人）</div></div>' +
                //'<div class="MenuCommonElement"><input id="QueryPeopleMin" class="QueryYear" type="text"/><div class="QueryMiddle">至</div><input id="QueryPeopleMax" class="QueryYear" type="text"/></div>' +
                //'<div class="MenuCommonElement"><div class="MenuElementsTitle">从业女性人数区间（人）</div></div>' +
                //'<div class="MenuCommonElement"><input id="QueryWomenMin" class="QueryYear" type="text"/><div class="QueryMiddle">至</div><input id="QueryWomenMax" class="QueryYear" type="text"/></div>' +
                '<div class="MenuCommonElement"><div id="QuerySubmit">查询</div></div>' +
            '</div>' +
            '<div id="queryDetailsRes">' +
            '</div>';
        $("#MenuBody").empty().append(html);
        $("#queryDetailsRes").height($("#MenuBody").height() - 20);
        that.pageEvtsRegister();
    },
    pageEvtsRegister: function () {
        var that = this;
        //初始化日期插件
        $('#QueryTimeMin').calendar({ zIndex: 9999 }).val("2016-06-11");
        $('#QueryTimeMax').calendar({ zIndex: 9999 }).val("2016-06-13");
        //行政区划下拉框
        $("#QueryCity").change(function () {
            var val = $(this).val();
            if (val == "51") {
                $("#QueryCounty").empty().append('<option value="">全部</option>');
            } else {
                $("#QueryCounty").empty().append(util_GetCountyByCityCode(val));
            }
        });
        //县区下拉框变化
        $("#QueryCounty").change(function () {
            var val = $(this).val();
            if (val == "") {
                //全部
                $("#QueryTown").empty().append('<option value="">全部</option>');
            } else {
                $.post(baseUrl + "Home/QueryTownInfo", { countyCode: val }, function (cbdata) {
                    if (cbdata == null || cbdata.length == 0) {
                        $("#QueryTown").empty().append('<option value="">全部</option>');
                        return;
                    }
                    var tempHtml = '<option value="">全部</option>';
                    for (var i = 0; i < cbdata.length; i++) {
                        tempHtml += '<option value="' + cbdata[i].tCode + '">' + cbdata[i].tName + '</option>';
                    }
                    $("#QueryTown").empty().append(tempHtml);
                })
            }
        });

        //关键字输入框
        $("#QueryProduct").focus(function () {
            if ($(this).val() == "关键字模糊检索") {
                $(this).val("");
            }
        }).blur(function () {
            if ($(this).val() == "") {
                $(this).val("关键字模糊检索");
            }
        });
        //提交按钮
        $("#QuerySubmit").unbind("click").bind("click", function () {
            //var conditionObj = {
            //    gbcode: $("#QueryCounty").val() == "" ? $("#QueryCity").val() : $("#QueryCounty").val(),
            //    cyType: $("#QueryType").val(),
            //    cyKeyWords: $("#QueryProduct").val() == "关键字模糊检索" ? "" : $("#QueryProduct").val(),
            //    nChanzhiMin: $("#QueryYearMin").val(),
            //    nChanzhiMax: $("#QueryYearMax").val(),
            //    renshuMin: $("#QueryPeopleMin").val(),
            //    renshuMax: $("#QueryPeopleMax").val(),
            //    womenMin: $("#QueryWomenMin").val(),
            //    womenMax: $("#QueryWomenMax").val()
            //};
            //$("#MenuWait").show();
            //$.post(baseUrl + "Home/QueryProInfo", { condition: JSON.stringify(conditionObj) }, function (cbdata) {
            //    $("#MenuWait").hide();
            //    if (cbdata == null || cbdata.length == 0) {
            //        if (CDWF.isStatistics) {
            //            that.statisticsAnimate(false);
            //        }
            //        alert("查询结果为空！");
            //        return;
            //    }
            //    that.currentData = cbdata;
            //    that.showQueryRes();
            //})
            that.showQueryRes();
        });
        //翻页
        $(".pageControlMJ").die("click").live("click", function () {
            var clickObj = $(this);
            var index = $(".pageControlMJ").index(clickObj);
            switch (index) {
                case 0:
                    //首页
                    if (that.nowPage == 1) {
                        return;
                    }
                    that.nowPage = 1;
                    break;
                case 1:
                    //上一页
                    if (that.nowPage == 1) {
                        return;
                    }
                    that.nowPage -= 1;
                    break;
                case 2:
                    //下一页
                    if (that.nowPage == that.totalPages) {
                        return;
                    }
                    that.nowPage += 1;
                    break;
                case 3:
                    //尾页
                    if (that.nowPage == that.totalPages) {
                        return;
                    }
                    that.nowPage = that.totalPages;
                    break;
            }
            that.createQueryDetailsPage();
        });
        //列表元素点击事件
        $(".mj_Res_Element").die("click").live("click", function () {
            var clickObj = $(this);
            var index = $(".mj_Res_Element").index(clickObj);
            if (clickObj.hasClass("mj_Res_ElementSelected")) {
                return;
            }
            $(".mj_Res_Element").removeClass("mj_Res_ElementSelected");
            clickObj.addClass("mj_Res_ElementSelected");
            //对地图标注操作
            //if (CDWF.MarkerLastSelected != null) {
            //    var selectedId = CDWF.MarkerLastSelected.id.split('_')[1];
            //    CDWF.MarkerLastSelected.setUrl(baseUrl + "Content/Index/Images/Markers/" + that.currentMarkerData[index].ProjectType + ".png");
            //}
            $(".olPopup").css("display", "none");
            //CDWF.MarkerArr[index].setUrl(baseUrl + "Content/Index/Images/Markers/" + that.currentMarkerData[index].ProjectType + "-1.png");
            //CDWF.MarkerLastSelected = CDWF.MarkerArr[index];

            //从列表中展开POP
            if (CDWF.PopArr[index] == null || CDWF.PopArr[index] == undefined) {
                var pop = CDWF.MapObj.createPopup({
                    id: "projectPop_" + index,
                    longitude: that.currentMarkerData[index].jd,
                    latitude: that.currentMarkerData[index].wd,
                    width: 400,
                    height: 160,
                    html: that.createPopHtml(that.currentMarkerData[index], index)
                });
                pop.show();
                that.popCallback();
                CDWF.PopArr[index] = pop;
            } else {
                CDWF.PopArr[index].show();
            }
            CDWF.MapObj.mapobj.setCenter(new OpenLayers.LonLat(that.currentMarkerData[index].X, that.currentMarkerData[index].Y), CDWF.MapObj.mapobj.getZoom());
        });
        //结果列表返回
        $("#queryResReturn").die("click").live("click", function () {
            CDWF.isStatistics = false;
            CDWF.MapObj.clearEles();
            $("#queryDetailsRes").hide("fast", function () {
                $("#queryConditions").show();
            });
            that.statisticsAnimate(false);
            $("#QuerySBody").empty();
            that.isAll = "查看全部";
            that.isStatistic = false;
            that.pageCount = 10;
            $("#QSStatisticDetails").text("详情模式");
        });
        //统计详情模式
        $("#QSStatisticDetails").die("click").live("click", function () {
            var text = $(this).text();
            if (text == "详情模式") {
                that.currentTempData = EPClassify;
                //更改提示
                $(this).text("关闭详情");
                $("#QSSTitle").text("全部统计结果").width(190);
                //增加SELECT框
                var sHtml = '<select id="detailsSelect">' +
                                '<option value="">全部</option>' +
                                '<option value="2016-06-11">2016-06-11</option>' +
                                '<option value="2016-06-12">2016-06-12</option>' +
                                '<option value="2016-06-13">2016-06-13</option>' +
                            '</select>';
                $("#QSSDetailSelect").width(160).append(sHtml);
                $("#detailsSelect").css({
                    "width": "120px",
                    "height": "23px",
                    "position": "relative",
                    "top": "-2px",
                    "left": "-3px"
                });
                that.isStatistic = true;
                //每一行的点击事件
                $(".QuerySChildren").live("click", function () {
                    that.isAll = "查看全部";
                    that.pageCount = 10;
                    var index = $(".QuerySChildren").index($(this));
                    if ($(this).hasClass("QuerySChildrenClicked")) {
                        return;
                    }
                    $(".QuerySChildren").removeClass("QuerySChildrenClicked");
                    $(this).addClass("QuerySChildrenClicked");
                    //日期选择
                    var sDate = $("#detailsSelect").val();

                    //that.currentDetailsData = that.currentData[index].details;
                    that.currentDetailsData = that.getSpeicalData(sDate, index);
                    //CDWF.MarkerLastSelected = null;
                    that.createQueryDetailsPageCommon();
                });
                //详情模式下选择框
                $("#detailsSelect").live("change", function () {
                    if ($(this).val() == "") {
                        that.currentTempData = EPClassify;
                        $("#QSSTitle").text("全部统计结果")
                    } else {
                        that.currentTempData = that.getSpeicalClassfiyTempData($(this).val());
                        $("#QSSTitle").text($(this).val() + "统计结果")
                    }
                    //改变数值
                    var tempHtml = '';
                    for (var i = 0; i < that.currentTempData.length; i++) {
                        tempHtml += '<div class="QuerySChildren">' +
                                    '<div class="QSTThead QSTThead3">' + that.currentTempData[i].mingcheng + '</div>' +
                                    '<div class="QSTThead QSTThead4 noBRight">' + that.currentTempData[i].details.length + '</div>' +
                              '</div>'
                    }
                    $("#QuerySBody").empty().append(tempHtml);
                    $(".QuerySChildren:eq(0)").trigger("click");
                });
                $(".QuerySChildren:eq(0)").trigger("click");
            } else {
                $(this).text("详情模式");
                $("#detailsSelect").die("change");
                $("#QSSDetailSelect").width(0).empty();
                $("#QSSTitle").text($("#QueryTimeMin").val() + "至" + $("#QueryTimeMax").val() + "航测数据统计").width(350);


                that.isStatistic = false;
                that.isAll = "查看全部";
                that.pageCount = 10;

                $(".QuerySChildren").die("click");
                $(".QuerySChildren").removeClass("QuerySChildrenClicked");
                //假数据
                that.currentDetailsData = EProblemEX;
                that.createQueryDetailsPageCommon();

                var tempHtml = '';
                that.currentTempData = EPClassify;
                for (var i = 0; i < that.currentTempData.length; i++) {
                    tempHtml += '<div class="QuerySChildren">' +
                                '<div class="QSTThead QSTThead3">' + that.currentTempData[i].mingcheng + '</div>' +
                                '<div class="QSTThead QSTThead4 noBRight">' + that.currentTempData[i].details.length + '</div>' +
                          '</div>'
                }
                $("#QuerySBody").empty().append(tempHtml);
            }
        });

        //查看全部
        $("#queryResAll").die("click").live("click", function () {
            var text = $(this).text();
            if (text == "查看全部") {
                that.isAll = "分页查看";
                that.currentDetailsData = [];
                var data = that.currentData;
                if (that.isStatistic) {
                    var index = $(".QuerySChildren").index($(".QuerySChildrenClicked"));
                    that.currentDetailsData = that.currentTempData[index].details;
                } else {
                    that.currentDetailsData = EProblemEX;
                }
                that.pageCount = that.currentDetailsData.length;
                that.createQueryDetailsPageCommon();
            } else {
                that.isAll = "查看全部";
                that.currentDetailsData = [];
                var data = that.currentData;
                if (that.isStatistic) {
                    var index = $(".QuerySChildren").index($(".QuerySChildrenClicked"));
                    that.currentDetailsData = that.currentTempData[index].details;
                } else {
                    that.currentDetailsData = EProblemEX;
                }
                that.pageCount = 10;
                that.createQueryDetailsPageCommon();
            }
        });
    },
    showQueryRes: function () {
        var that = this;
        CDWF.isStatistics = true;
        that.createStatisticsPage();
    },
    //查询统计页
    createStatisticsPage: function () {
        var that = this;
        //var data = that.currentData;
        //虚拟数据
        var data = EPClassify;
        var html = '';
        that.currentDetailsData = [];


        for (var i = 0; i < data.length; i++) {
            html += '<div class="QuerySChildren">' +
                        '<div class="QSTThead QSTThead3">' + data[i].mingcheng + '</div>' +
                        '<div class="QSTThead QSTThead4 noBRight">' + data[i].details.length + '</div>' +
                        //'<div class="QSTThead QSTThead2">' + data[i].congYeRenShu + '/' + data[i].womenRenShu + '</div>' +
                        //'<div class="QSTThead QSTThead1 noBRight" style="width: 23%">' + data[i].nianChanZhi + '</div>' +
                  '</div>'
            //var detailsData = data[i].details;
            //for (var j = 0; j < detailsData.length; j++) {
            //    that.currentDetailsData.push(detailsData[j]);
            //}
        }

        //Temp,假数据
        that.currentDetailsData = EProblemEX;

        $("#QSSDetailSelect").width(0).empty();
        $("#QSSTitle").text($("#QueryTimeMin").val() + "至" + $("#QueryTimeMax").val() + "航测数据统计").width(350);
        $("#QuerySBody").empty().append(html);
        $("#QueryStatisticResult").height((data.length + 2) * 31);
        $("#queryConditions").hide("fast", function () {
            $("#queryDetailsRes").show(function () {

                that.createQueryDetailsPageCommon();
            });
        });
        that.statisticsAnimate(true);
    },
    //详情列表前置函数
    createQueryDetailsPageCommon: function () {
        var that = this;

        that.nowPage = 1;
        that.totalPages = Math.ceil(that.currentDetailsData.length / that.pageCount);
        that.createQueryDetailsPage();
    },
    createQueryDetailsPage: function () {
        var that = this;
        var step = that.getStep();
        var data = that.currentDetailsData;
        var resHtml = '<div class="mj_queryRes_title">查询结果(共' + that.currentDetailsData.length + '条)<div id="queryResReturn">返回</div><div id="queryResAll">' + that.isAll + '</div></div><div class="mj_queryRes_content">';
        that.currentMarkerData = [];
        for (var i = 0; i < step; i++) {
            var dataTemp = data[(that.nowPage - 1) * that.pageCount + i];
            that.currentMarkerData.push(dataTemp);

            //name: 'F-1火点正在燃烧',
            //hpsj: '2016-6-13',
            //hps: '成都市',
            //hpx: '成华区',
            //hpz: '龙潭街道',
            //hpxxdd: '四川省成都市成华区龙潭街道',
            //hpwt: 'F',
            //jd: 104.2087633,
            //wd: 30.7103505

            //var projName = dataTemp.ProjectName.length > 16 ? dataTemp.ProjectName.substr(0, 16) : dataTemp.ProjectName;
            //var projPlace = dataTemp.ProjectPosition.length > 16 ? dataTemp.ProjectPosition.substr(0, 16) : dataTemp.ProjectPosition;
            resHtml += '<div class="mj_Res_Element mj_Res_Element' + i + '">' +
                          '<div class="mj_Res_e_mark mj_Res_e_mark_' + dataTemp.hpwt + '"></div>' +
                          '<div class="mj_Res_e_body" title="' + dataTemp.name + '">' +
                              '<div class="mj_details mj_location">' + dataTemp.name + '</div>' +
                              '<div class="mj_details mj_level">' + dataTemp.hpxxdd + '</div>' +
                              '<div class="mj_details mj_auth">' + dataTemp.hpwt + ' ' + dataTemp.hpsj + '</div>' +
                          '</div>' +
                       '</div>'
        }
        resHtml += '</div><div class="mj_queryRes_bottom">' +
                '<div class="pageTipsMJ">第1页/共2页</div>' +
                '<div class="pageControlMJ" style="margin-left:10px;">首页</div>' +
                '<div class="pageControlMJ">上一页</div>' +
                '<div class="pageControlMJ">下一页</div>' +
                '<div class="pageControlMJ">尾页</div>' +
            '</div>';
        $("#queryDetailsRes").empty().append(resHtml);
        $(".pageTipsMJ").text("").text("第" + that.nowPage + "页/共" + that.totalPages + "页");
        $(".mj_queryRes_content").height($("#queryDetailsRes").height() - 60);
        //自定义滚动条
        $('.mj_queryRes_content').jScrollPane(
            {
                showArrows: false,
                horizontalGutter: 10
            }
        );
        CDWF.ScrollBar = $('.mj_queryRes_content').data('jsp');
        that.createMarker();
    },

    createMarker: function () {
        var that = this;
        CDWF.MapObj.clearEles();
        var dataLength = that.currentMarkerData.length;
        //盛放marker的图层
        var markerslayer = new OpenLayers.Layer.Markers("markers");
        CDWF.MarkerLayer = markerslayer;
        CDWF.MapObj.mapobj.addLayer(markerslayer);
        for (var i = 0; i < dataLength; i++) {
            //调用Map.js下的方法构造Marker
            var marker = CDWF.MapObj.createMarker({
                index: i,
                markerID: "projectMarker_" + i,
                popid: "projectPop_" + i,
                baseLayer: markerslayer,
                size: { w: 20, h: 20 },
                pw: 400,
                //ph: that.currentMarkerData[i].ProjectType == "07" ? 250 : 200,
                ph: 160,
                html: that.createPopHtml(that.currentMarkerData[i], i),
                longitude: that.currentMarkerData[i].jd,
                latitude: that.currentMarkerData[i].wd,
                imgSrc: "Content/Index/Images/Markers/" + that.currentMarkerData[i].hpwt + ".png",
                callback: that.markerClicked,
                popCallback: that.popCallback
            });
            CDWF.MarkerArr.push(marker);
            var myColor = "";
            switch (that.currentMarkerData[i].hpwt) {
                case "F":
                case "B":
                case "C":
                case "R":
                    myColor = "#FF0404";
                    break;
                case "S":
                    myColor = "#FFFC04";
                    break;
                case "W":
                    myColor = "#31F504";
                    break;
                case "O":
                    myColor = "#A416C7";
                    break;
            }
            var textFeature = CDWF.MapObj.createText({
                x: that.currentMarkerData[i].jd,
                y: that.currentMarkerData[i].wd,
                name: that.currentMarkerData[i].num,
                color: myColor,
            });
            CDWF.TextArr.push(textFeature);
        }
    },
    //民居类POP内容区域页面编辑
    createPopHtml: function (data, i) {
        //name: 'F-1火点正在燃烧',
        //hpsj: '2016-6-13',
        //hps: '成都市',
        //hpx: '成华区',
        //hpz: '龙潭街道',
        //hpxxdd: '四川省成都市成华区龙潭街道',
        //hpwt: 'F',
        //jd: 104.2087633,
        //wd: 30.7103505
        var that = this;
        //var pName = data.ProjectName.length > 16 ? data.ProjectName.substr(0, 13) + "..." : data.ProjectName;
        //var people = data.PersonInCharge == "" ? "暂无" : data.PersonInCharge;
        //var peopleContact = data.ContactInformation == "" ? "暂无" : data.ContactInformation;
        //var product = data.ProjectProduct.length > 18 ? data.ProjectProduct.substr(0, 15) + "..." : data.ProjectProduct;
        //var suportType = data.SportType.length > 14 ? data.SportType.substr(0, 13) + "..." : data.SportType;
        //var pHeight = data.ProjectType == "07" ? 250 : 200;
        var hjwtName = "";
        //        ["F", "涉气：火点，正在焚烧"],
        //["B", "涉气：黑斑，焚烧痕迹"],
        //["C", "涉气：燃煤、排烟问题"],
        //["R", "涉气：施工、扬尘问题"],
        //["S", "涉土问题"],
        //["W", "涉水问题"],
        //["O", "其它问题"]
        switch (data.hpwt) {
            case "F":
                hjwtName = "涉气问题，F/火点，正在焚烧";
                break;
            case "B":
                hjwtName = "涉气问题，B/黑斑，焚烧痕迹";
                break;
            case "C":
                hjwtName = "涉气问题，C/燃煤、排烟问题";
                break;
            case "R":
                hjwtName = "涉气问题，R/施工、扬尘问题";
                break;
            case "S":
                hjwtName = "涉土问题，S";
                break;
            case "W":
                hjwtName = "涉水问题，W";
                break;
            case "O":
                hjwtName = "其它问题，O";
                break;
        }

        var res = '';
        //var imgSRC = baseUrl + 'Content/CDHPIMG/DSC00073-1.jpg';
        var imgSRC = baseUrl + 'Content/CDHPIMG/' + data.imgArr.split('#')[0];

        res += '<div style="width:400px;height:170px;font-family:宋体;padding:5px;">' +
                   '<div style="width:100%;height:31px;">' +
                     '<div style="width:100%;height:30px;font-size:18px;text-align:left;text-indent:3px; border-bottom:1px solid #CCCCCC;line-height:30px;font-weight:bolder;color:#333333;" title="' + data.name + '">' +
                        data.name +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:60px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">发生点：</div>' +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:240px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.hpxxdd + '</div>' +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">环境问题：</div>' +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:200px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + hjwtName + '</div>' +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">航测时间：</div>' +
                     '</div>' +
                     '<div style="width:100%;height:30px;">' +
                        '<div style="width:200px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.hpsj + '</div>' +
                     '</div>' +
                     '<div class="showPopImg" style="position:absolute;width:130px;height:165px;top:45px;left:270px;cursor:pointer;">' +
                        '<img src="' + imgSRC + '" style="width:130px;height:165px;"/>' +
                        '<div class="showImgPath" style="display:none">' + data.imgArr + '</div>' +
                     '</div>';
        //'<div style="width:100%;height:30px;">' 
        //   '<div id="showImg' + i + '" class="showPopImg" style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;float:left;text-decoration:underline;color:#085890;cursor:pointer;">查看照片</div>' +
        //'</div>';

        //'<div style="width:100%;height:30px;">' +
        //   '<div style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">主要产品：</div>' +
        //   '<div style="width:240px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;"  title="' + data.ProjectProduct + '">' + product + '</div>' +
        //'</div>' +
        //'<div style="width:100%;height:30px;">' +
        //   '<div style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">占地面积：</div>' +
        //   '<div style="width:90px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.FloorSpace + ' ㎡</div>' +
        //   '<div style="width:60px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">年产值：</div>' +
        //   '<div style="width:90px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.AnnualOutputValue + ' 万元</div>' +
        //'</div>' +
        //'<div style="width:100%;height:30px;">' +
        //   '<div style="width:80px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">从业人数：</div>' +
        //   '<div style="width:90px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.EmployeesNums + ' 人</div>' +
        //   '<div style="width:60px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">女性：</div>' +
        //   '<div style="width:90px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.WomenEmployees + ' 人</div>' +
        //'</div>';
        //if (data.ProjectType == "07") {
        //    res += '' +
        //             '<div style="width:100%;height:30px; margin-top:6px;">' +
        //                '<div style="width:120px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">妇联支持项目类型：</div>' +
        //                '<div style="width:200px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;"  title="' + data.SportType + '">' + suportType + '</div>' +
        //             '</div>' +
        //             '<div style="width:100%;height:30px; margin-top:6px;">' +
        //                '<div style="width:120px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#666666;float:left;">妇联支持项目资金：</div>' +
        //                '<div style="width:200px;height:30px;text-align:left;text-indent:3px;font-size:13px;line-height:30px;color:#333333;float:left;">' + data.SportMoney + ' 万元</div>' +
        //             '</div>';
        //}

        res += '</div>' +
          '</div>';
        return res;
    },
    //Marker点击事件
    markerClicked: function (obj) {
        var that = this;
        var markerId = obj.id.split('_')[1];
        CDWF.ScrollBar.scrollToElement(".mj_Res_Element" + markerId, 2);
        $(".mj_Res_Element").removeClass("mj_Res_ElementSelected");
        $(".mj_Res_Element" + markerId).addClass("mj_Res_ElementSelected");
        if (CDWF.MarkerLastSelected != null) {
            //var selectedId = CDWF.MarkerLastSelected.id.split('_')[1];
            //CDWF.MarkerLastSelected.setUrl(baseUrl + "Content/Index/Images/Markers/" + CDWF.MenuObj.currentMarkerData[selectedId].ProjectType + ".png");
        }
        //CDWF.MarkerArr[markerId].setUrl(baseUrl + "Content/Index/Images/Markers/" + CDWF.MenuObj.currentMarkerData[markerId].ProjectType + "-1.png");
        //CDWF.MarkerLastSelected = CDWF.MarkerArr[markerId];
        CDWF.MapObj.mapobj.setCenter(obj.lonlat, CDWF.MapObj.mapobj.getZoom());
    },
    popCallback: function () {
        var that = this;
        $(".showPopImg").unbind("click").bind("click", function () {
            var imgsArr = [];
            var pt = $(this).find(".showImgPath")[0].innerText.split('#');
            for (var i = 0; i < pt.length; i++) {
                imgsArr.push(baseUrl + 'Content/CDHPIMG/' + pt[i]);
            }
            var imgViewW = new ImgViewWindow();
            imgViewW.showImg(imgsArr, imgsArr, 0);
        });
    },
    statisticsAnimate: function (isShow) {
        var topPx = isShow ? ($("#Index").height() - $("#QueryStatisticResult").height() - 2) + "px" : $("#Index").height() + "px";
        $("#QueryStatisticResult").animate({ top: topPx });
    },
    //管理查询翻页
    getStep: function () {
        var that = this;
        if (that.nowPage < that.totalPages) {
            return that.pageCount;
        } else {
            return that.currentDetailsData.length - (that.nowPage - 1) * that.pageCount;
        }
    },
    functionClosed: function () {
        var that = this;
        CDWF.CurrentActiveFuncIndex = -1;
        CDWF.MapObj.clearEles();
        if (CDWF.isStatistics) {
            CDWF.isStatistics = false;
            that.statisticsAnimate(false);
        }
    },
    //获取当前指定日期的统计数据
    getSpeicalData: function (dateStr, index) {
        var that = this;
        //index 0 涉气 1 涉土 2 涉水 3 其它
        var data = that.currentTempData[index];
        if (dateStr == "") {
            //全部日期
            return data.details;
        }
        var res = [];
        for (var i = 0; i < data.details.length; i++) {
            if (data.details[i].hpsj == dateStr) {
                res.push(data.details[i]);
            }
        }
        return res;
    },
    getSpeicalClassfiyTempData: function (dateStr) {
        var res = [{ mingcheng: "涉气问题", details: [] },
            { mingcheng: "涉土问题", details: [] },
            { mingcheng: "涉水问题", details: [] },
            { mingcheng: "其它问题", details: [] }];
        for (var i = 0; i < EPClassify.length; i++) {
            var data = EPClassify[i].details;
            for (var j = 0; j < data.length; j++) {
                if (data[j].hpsj == dateStr) {
                    res[i].details.push(data[j]);
                }
            }
        }
        return res;
    }
});