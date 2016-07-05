//信息统计子模块
var projectStatistic = OpenLayers.Class({
    currentMarkerData: [
        {
            X: 104.06328,
            Y: 30.58212
        }, {
            X: 104.42,
            Y: 30.86
        }, {
            X: 103.79,
            Y: 30.41
        }
    ],
    statisticUnit: [
        "手工编织业",
        "绿色种植业",
        "生态养殖业",
        "农副产品加工",
        "生活性服务业",
        "女大学生新增就业",
        "妇联扶持项目"
    ],
    //初始化
    initialize: function () {
        this.pageInitialize();
    },
    pageInitialize: function () {
        //[["01", "手工编织业"], ["02", "绿色种植业"], 
        //["03", "生态养殖业"], ["04", "农副产品加工"], 
        //["05", "生活性服务业"], ["06", "女大学生新增就业"]];
        $("#MenuTitle").text("数据统计");
        var html = '' +
            '<div id="queryConditions">' +
                '<div class="MenuCommonElement"><div class="MenuElementsTitle">航测时间</div></div>' +
                '<div class="MenuCommonElement"><input id="QueryTimeMin1" class="QueryYear" type="text"/><div class="QueryMiddle">至</div><input id="QueryTimeMax1" class="QueryYear" type="text"/></div>' +
                '<div class="MenuCommonElement"><div class="MenuElementsTitle">产业类别</div></div>' +
                '<div class="MenuCommonElement" style="margin-top:5px;">' +
                    '<input id="chanYe01" class="sCheck" checked="checked" name="cyType" type="checkbox" value="01"/><label for="chanYe01" class="sLabel">涉气问题(F/B/C/R)</label>' +
                 '</div>' +
                '<div class="MenuCommonElement">' +
                    '<input id="chanYe04" class="sCheck" checked="checked" name="cyType" type="checkbox" value="04"/><label for="chanYe04" class="sLabel">涉土问题(S)</label>' +
                 '</div>' +
                '<div class="MenuCommonElement">' +
                    '<input id="chanYe07" class="sCheck" checked="checked" name="cyType" type="checkbox" value="07"/><label for="chanYe07" class="sLabel">涉水问题(W)</label>' +
                '</div>' +
                '<div class="MenuCommonElement">' +
                    '<input id="chanYe08" class="sCheck" checked="checked" name="cyType" type="checkbox" value="07"/><label for="chanYe07" class="sLabel">其它问题(O)</label>' +
                 '</div>' +
                //'<div class="MenuCommonElement"><div class="MenuElementsTitle">统计方式</div></div>' +
                // '<div class="MenuCommonElement">' +
                //    '<select id="StatisticType"><option value="01">单产业各指标纵向比较</option><option value="02">产业间横向比较</option><option value="03"> 妇联扶持项目统计</option></select>' +
                // '</div>' +
                '<div class="MenuCommonElement"><div id="Statistic">统计</div></div>' +
            '</div>' +
            '<div id="queryDetailsRes">' +
            '</div>';
        $("#MenuBody").empty().append(html);
        this.pageEvtsRegister();
    },
    pageEvtsRegister: function () {
        var that = this;
        //行政区划下拉框
        //$("#StatisticCity").change(function () {
        //    var val = $(this).val();
        //    if (val == "51") {
        //        $("#StatisticCounty").empty().append('<option value="">全部</option>');
        //    } else {
        //        $("#StatisticCounty").empty().append(util_GetCountyByCityCode(val));
        //    }
        //});
        //全选
        //$('[name=checkAll]:checkbox').click(function () {
        //    var flag = this.checked;
        //    $('[name=cyType]:checkbox').each(function () {
        //        $(this).attr('checked', flag);
        //    });
        //});

        //$("#StatisticType").change(function () {
        //    var val = $(this).val();
        //    var flag = false;
        //    if (val == "03") {
        //        flag = true;
        //    };
        //    $('[name=cyType]:checkbox').each(function () {
        //        $(this).attr('disabled', flag);
        //    });

        //    $('[name=checkAll]:checkbox').each(function () {
        //        $(this).attr('disabled', flag);
        //    });
        //});

        ////单个check变化后操作全选
        //$('[name=cyType]:checkbox').click(function () {
        //    var $tmp = $('[name=cyType]:checkbox');
        //    $("#chanYeALL").attr('checked', $tmp.length == $tmp.filter(':checked').length);
        //});

        //初始化日期插件
        $('#QueryTimeMin1').calendar({ zIndex: 9999 }).val("2016-06-11");
        $('#QueryTimeMax1').calendar({ zIndex: 9999 }).val("2016-06-15");

        //统计
        $("#Statistic").click(function () {
            //that.createMarker();
            if ($("#QueryStatistic").css("left") != "282px") {
                that.statisticsAnimate(true);
            }
            that.statisticsEntrance();
        });

        $("#QueryResultChange").click(function () {
            var text = $(this).text();
            $(".QueryStatisticResType").hide();
            if (text == "统计图") {
                $(this).text("统计表格");
                $("#QueryStatisticChart").show();
            } else {
                $(this).text("统计图");
                $("#QueryStatisticTable").show();
            }
        });

    },

    //统计入口
    statisticsEntrance: function () {
        var that = this;
        //var conditionObj = {
        //    city: $("#StatisticCity").val(),
        //    county: $("#StatisticCounty").val(),
        //    chanYe: that.getCYType(),
        //    tongJiType: $("#StatisticType").val()
        //};
        //$.post(baseUrl + "Home/StatisticProInfo", { condition: JSON.stringify(conditionObj) }, function (cbdata) {
        //    that.currentStatisticsData = cbdata;
        //    that.createStatisticContent();
        //});
        //    that.currentStatisticsData = cbdata;
        that.createStatisticContent();
    },
    currentStatisticsData: null,
    createStatisticContent: function () {
        var that = this;
        that.createType1();
        //switch ($("#StatisticType").val()) {
        //    case "01":
        //        that.createType1();
        //        break;
        //    case "02":
        //        that.createType2();
        //        break;
        //    case "03":
        //        that.createType3();
        //        break;
        //}
    },
    //单产业比较
    createType1: function () {
        var that = this;
        //var tableStr = '<table id="QSTable1" class="QSTable">' +
        //     '<thead>' +
        //         '<tr>' +
        //             '<th>行政区</th>' +
        //             '<th>产业类别</th>' +
        //             '<th>占地面积（㎡）</th>' +
        //             '<th>从业人数</th>' +
        //             '<th>女性人数</th>' +
        //             '<th>年产值（万元）</th>' +
        //         '</tr>' +
        //     '</thead><tbody>';
        //var dataNow = that.currentStatisticsData.sType1;
        //for (var i = 0 ; i < dataNow.length; i++) {
        //    if (i == 0) {
        //        tableStr += '<tr>' +
        //                            '<td rowspan="' + dataNow.length + '">' + that.currentStatisticsData.regionName + '</td>' +
        //                            '<td>' + dataNow[i].chanYeName + '</td>' +
        //                            '<td>' + dataNow[i].zhanDiMianJi + '</td>' +
        //                            '<td>' + dataNow[i].congYeRenShu + '</td>' +
        //                            '<td>' + dataNow[i].womenRenShu + '</td>' +
        //                            '<td>' + dataNow[i].nianChanZhi + '</td>' +
        //                        '</tr>';
        //    } else {
        //        tableStr += '<tr>' +
        //                            '<td>' + dataNow[i].chanYeName + '</td>' +
        //                            '<td>' + dataNow[i].zhanDiMianJi + '</td>' +
        //                            '<td>' + dataNow[i].congYeRenShu + '</td>' +
        //                            '<td>' + dataNow[i].womenRenShu + '</td>' +
        //                            '<td>' + dataNow[i].nianChanZhi + '</td>' +
        //                         '</tr>';
        //    }
        //}
        //tableStr += '</tbody></table>';
        //$("#QueryStatisticTable").empty().append(tableStr);
        that.createType1HighCharts();
    },
    createType1HighCharts: function () {
        var that = this;
        var hHeight = $("#QueryStatisticChart").height();
        var hWidth = $("#QueryStatisticChart").width();
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'QueryStatisticChart',
                backgroundColor: 'transparent',
                type: 'column',
                margin: 150,
                width: hWidth,
                height: hHeight,
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25
                }
            },
            title: {
                text: '2016-06-11至2016-06-15期间航测情况'
            },
            subtitle: {
                text: '问题总数统计'
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            xAxis: [{
                categories: ["2015年6月11日", "2015年6月12日", "2015年6月13日", "2015年6月14日", "2015年6月15日"]
            }],
            yAxis: [{ // Primary yAxis
                gridLineWidth: 1,
                labels: {
                    formatter: function () {
                        return this.value + '个';
                    },
                    style: {
                        color: '#89A54E'
                    }
                },
                title: {
                    text: '个数',
                    style: {
                        color: '#89A54E'
                    }
                },
                opposite: true
            }],
            series: [{
                name: "涉气问题（F/B/C/R）",
                yAxis: 0,
                data: [10, 5, 12, 7, 8],
                tooltip: {
                    valueSuffix: ' 个'
                }
            }, {
                name: "涉土问题（S）",
                yAxis: 0,
                data: [3, 3, 3, 12, 6],
                tooltip: {
                    valueSuffix: ' 人'
                }
            }, {
                name: "涉水问题（W）",
                yAxis: 0,
                data: [4, 2, 6, 5, 9],
                tooltip: {
                    valueSuffix: ' 个'
                }
            }, {
                name: "其它问题（O）",
                yAxis: 0,
                data: [2, 1, 8, 3, 1],
                tooltip: {
                    valueSuffix: ' 个'
                }
            }]
        });
    },
    getHighchartType1xAxis: function () {
        var that = this;
        var data = that.currentStatisticsData.sType1;
        var serArr = [];
        for (var i = 0; i < data.length; i++) {
            serArr.push(data[i].chanYeName);
        }
        return serArr;
    },
    getHighchartType1SeriesData: function (index) {
        var that = this;
        var data = that.currentStatisticsData.sType1;
        var resArr = [];
        switch (index) {
            case 0:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].zhanDiMianJi);
                }
                break;
            case 1:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].congYeRenShu);
                }
                break;
            case 2:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].womenRenShu);
                }
                break;
            case 3:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].nianChanZhi);
                }
                break;
        }
        return resArr;
    },
    //产业间比较
    createType2: function () {
        var that = this;
        var tableStr = '<table id="QSTable2" class="QSTable">' +
             '<thead>' +
                 '<tr>' +
                     '<th>行政区</th>' +
                     '<th>统计指标</th>' +
                     '<th>手工编织业</th>' +
                     '<th>绿色种植业</th>' +
                     '<th>生态养殖业</th>' +
                     '<th>农副产品加工</th>' +
                     '<th>生活性服务业</th>' +
                     '<th>妇联扶持项目</th>' +
                     '<th>女大学生新增就业</th>' +
                 '</tr>' +
             '</thead><tbody>';
        var dataNow = that.currentStatisticsData.sType2;
        for (var i = 0 ; i < dataNow.length; i++) {
            if (i == 0) {
                tableStr += '<tr>' +
                                    '<td rowspan="' + dataNow.length + '">' + that.currentStatisticsData.regionName + '</td>' +
                                    '<td>' + dataNow[i].tongJiZhiBiao + '</td>' +
                                    '<td>' + dataNow[i].shougongbianzhi + '</td>' +
                                    '<td>' + dataNow[i].lvsezhongzhi + '</td>' +
                                    '<td>' + dataNow[i].shengtaiyangzhi + '</td>' +
                                    '<td>' + dataNow[i].nongfuchanpin + '</td>' +
                                    '<td>' + dataNow[i].shenghuo + '</td>' +
                                    '<td>' + dataNow[i].fulian + '</td>' +
                                    '<td>' + dataNow[i].nvdaxuesheng + '</td>' +
                                '</tr>';
            } else {
                tableStr += '<tr>' +
                                    '<td>' + dataNow[i].tongJiZhiBiao + '</td>' +
                                    '<td>' + dataNow[i].shougongbianzhi + '</td>' +
                                    '<td>' + dataNow[i].lvsezhongzhi + '</td>' +
                                    '<td>' + dataNow[i].shengtaiyangzhi + '</td>' +
                                    '<td>' + dataNow[i].nongfuchanpin + '</td>' +
                                    '<td>' + dataNow[i].shenghuo + '</td>' +
                                    '<td>' + dataNow[i].fulian + '</td>' +
                                    '<td>' + dataNow[i].nvdaxuesheng + '</td>' +
                                 '</tr>';
            }
        }
        tableStr += '</tbody></table>';
        $("#QueryStatisticTable").empty().append(tableStr);
        that.createType2HighCharts();
    },
    createType2HighCharts: function () {
        var that = this;
        var hHeight = $("#QueryStatisticChart").height();
        var hWidth = $("#QueryStatisticChart").width();
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'QueryStatisticChart',
                backgroundColor: 'transparent',
                type: 'column',
                margin: 150,
                width: hWidth,
                height: hHeight,
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25
                }
            },
            title: {
                text: that.currentStatisticsData.regionName + '情况统计'
            },
            subtitle: {
                text: '产业间横向比较'
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            xAxis: [{
                categories: that.getHighchartType2xAxis()
            }],
            yAxis: [{ // Primary yAxis
                gridLineWidth: 1,
                labels: {
                    formatter: function () {
                        return this.value + '人';
                    },
                    style: {
                        color: '#89A54E'
                    }
                },
                title: {
                    text: '人数',
                    style: {
                        color: '#89A54E'
                    }
                },
                opposite: true
            }, { // Secondary yAxis
                gridLineWidth: 1,
                title: {
                    text: '规模',
                    style: {
                        color: '#4572A7'
                    }
                },
                labels: {
                    formatter: function () {
                        return this.value + '㎡';
                    },
                    style: {
                        color: '#4572A7'
                    }
                }

            }, { // Tertiary yAxis
                gridLineWidth: 1,
                title: {
                    text: '产值',
                    style: {
                        color: '#AA4643'
                    }
                },
                labels: {
                    formatter: function () {
                        return this.value + ' 万元';
                    },
                    style: {
                        color: '#AA4643'
                    }
                },
                opposite: true
            }],
            series: [{
                name: "手工编织业",
                yAxis: 1,
                data: that.getHighchartType2SeriesData(0),
            }, {
                name: "绿色种植业",
                yAxis: 0,
                data: that.getHighchartType2SeriesData(1),
            }, {
                name: "生态养殖业",
                yAxis: 0,
                data: that.getHighchartType2SeriesData(2),
            }, {
                name: "农副产品加工",
                yAxis: 2,
                data: that.getHighchartType2SeriesData(3),
            }, {
                name: "生活性服务业",
                yAxis: 2,
                data: that.getHighchartType2SeriesData(4),
            }, {
                name: "妇联扶持项目",
                yAxis: 2,
                data: that.getHighchartType2SeriesData(6),
            }
            , {
                name: "女大学生新增就业",
                yAxis: 2,
                data: that.getHighchartType2SeriesData(5),
            }]
        });
    },
    getHighchartType2xAxis: function () {
        var that = this;
        var data = that.currentStatisticsData.sType2;
        var serArr = [];
        for (var i = 0; i < data.length; i++) {
            serArr.push(data[i].tongJiZhiBiao);
        }
        return serArr;
    },
    getHighchartType2SeriesData: function (index) {
        var that = this;
        var data = that.currentStatisticsData.sType2;
        var resArr = [];
        switch (index) {
            case 0:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].shougongbianzhi);
                }
                break;
            case 1:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].lvsezhongzhi);
                }
                break;
            case 2:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].shengtaiyangzhi);
                }
                break;
            case 3:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].nongfuchanpin);
                }
                break;
            case 4:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].shenghuo);
                }
                break;
            case 5:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].nvdaxuesheng);
                }
                break;
            case 6:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].fulian);
                }
                break;
        }
        return resArr;
    },
    //妇联比较
    createType3: function () {
        var that = this;
        var tableStr = '<table id="QSTable1" class="QSTable">' +
             '<thead>' +
                 '<tr>' +
                     '<th>行政区</th>' +
                     '<th>扶持类型</th>' +
                     '<th>项目总数</th>' +
                     '<th>扶持总额（万元）</th>' +
                     '<th>占地面积（㎡）</th>' +
                     '<th>从业人数</th>' +
                     '<th>女性人数</th>' +
                     '<th>年产值（万元）</th>' +
                 '</tr>' +
             '</thead><tbody>';
        var dataNow = that.currentStatisticsData.sType3;
        for (var i = 0 ; i < dataNow.length; i++) {
            if (i == 0) {
                tableStr += '<tr>' +
                                    '<td rowspan="' + dataNow.length + '">' + that.currentStatisticsData.regionName + '</td>' +
                                    '<td>' + dataNow[i].zhichiType + '</td>' +
                                    '<td>' + dataNow[i].qiyeCount + '</td>' +
                                    '<td>' + dataNow[i].moneyCount + '</td>' +
                                    '<td>' + dataNow[i].zhanDiMianJi + '</td>' +
                                    '<td>' + dataNow[i].congYeRenShu + '</td>' +
                                    '<td>' + dataNow[i].womenRenShu + '</td>' +
                                    '<td>' + dataNow[i].nianChanZhi + '</td>' +
                                '</tr>';
            } else {
                tableStr += '<tr>' +
                                    '<td>' + dataNow[i].zhichiType + '</td>' +
                                    '<td>' + dataNow[i].qiyeCount + '</td>' +
                                    '<td>' + dataNow[i].moneyCount + '</td>' +
                                    '<td>' + dataNow[i].zhanDiMianJi + '</td>' +
                                    '<td>' + dataNow[i].congYeRenShu + '</td>' +
                                    '<td>' + dataNow[i].womenRenShu + '</td>' +
                                    '<td>' + dataNow[i].nianChanZhi + '</td>' +
                                 '</tr>';
            }
        }
        tableStr += '</tbody></table>';
        $("#QueryStatisticTable").empty().append(tableStr);
        that.createType3HighCharts();
    },
    createType3HighCharts: function () {
        var that = this;
        var hHeight = $("#QueryStatisticChart").height();
        var hWidth = $("#QueryStatisticChart").width();
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'QueryStatisticChart',
                backgroundColor: 'transparent',
                type: 'column',
                margin: 150,
                width: hWidth,
                height: hHeight,
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25
                }
            },
            title: {
                text: that.currentStatisticsData.regionName + '情况统计'
            },
            subtitle: {
                text: '妇联扶持项目统计'
            },
            plotOptions: {
                column: {
                    depth: 25
                }
            },
            xAxis: [{
                categories: that.getHighchartType3xAxis()
            }],
            yAxis: [
                { // Primary yAxis
                    gridLineWidth: 1,
                    labels: {
                        formatter: function () {
                            return this.value + '个';
                        },
                        style: {
                            color: '#89A54E'
                        }
                    },
                    title: {
                        text: '个数',
                        style: {
                            color: '#89A54E'
                        }
                    },
                    opposite: true
                }, { // Primary yAxis
                    gridLineWidth: 1,
                    labels: {
                        formatter: function () {
                            return this.value + '人';
                        },
                        style: {
                            color: '#89A54E'
                        }
                    },
                    title: {
                        text: '人数',
                        style: {
                            color: '#89A54E'
                        }
                    },
                    opposite: true
                }, { // Secondary yAxis
                    gridLineWidth: 1,
                    title: {
                        text: '规模',
                        style: {
                            color: '#4572A7'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return this.value + '㎡';
                        },
                        style: {
                            color: '#4572A7'
                        }
                    }

                }, { // Tertiary yAxis
                    gridLineWidth: 1,
                    title: {
                        text: '金额',
                        style: {
                            color: '#AA4643'
                        }
                    },
                    labels: {
                        formatter: function () {
                            return this.value + ' 万元';
                        },
                        style: {
                            color: '#AA4643'
                        }
                    },
                    opposite: true
                }],
            series: [
                {
                    name: "扶持企业总数",
                    yAxis: 0,
                    data: that.getHighchartType3SeriesData(0),
                    tooltip: {
                        valueSuffix: ' 个'
                    }
                },
                {
                    name: "扶持项目资金数",
                    yAxis: 3,
                    data: that.getHighchartType3SeriesData(1),
                    tooltip: {
                        valueSuffix: ' 万元'
                    }
                },
                {
                    name: "占地面积",
                    yAxis: 2,
                    data: that.getHighchartType3SeriesData(2),
                    tooltip: {
                        valueSuffix: ' 平方米'
                    }
                }, {
                    name: "从业人数",
                    yAxis: 1,
                    data: that.getHighchartType3SeriesData(3),
                    tooltip: {
                        valueSuffix: ' 人'
                    }
                }, {
                    name: "女性人数",
                    yAxis: 1,
                    data: that.getHighchartType3SeriesData(4),
                    tooltip: {
                        valueSuffix: ' 人'
                    }
                }, {
                    name: "年产值",
                    yAxis: 3,
                    data: that.getHighchartType3SeriesData(5),
                    tooltip: {
                        valueSuffix: ' 万元'
                    }
                }]
        });
    },
    getHighchartType3xAxis: function () {
        var that = this;
        var data = that.currentStatisticsData.sType3;
        var serArr = [];
        for (var i = 0; i < data.length; i++) {
            serArr.push(data[i].zhichiType);
        }
        return serArr;
    },
    getHighchartType3SeriesData: function (index) {
        var that = this;
        var data = that.currentStatisticsData.sType3;
        var resArr = [];
        switch (index) {
            case 0:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].qiyeCount);
                }
                break;
            case 1:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].moneyCount);
                }
                break;
            case 2:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].zhanDiMianJi);
                }
                break;
            case 3:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].congYeRenShu);
                }
                break;
            case 4:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].womenRenShu);
                }
                break;
            case 5:
                for (var m = 0; m < data.length; m++) {
                    resArr.push(data[m].nianChanZhi);
                }
                break;
        }
        return resArr;
    },

    //获取产业类型条件
    getCYType: function () {
        var str = "";
        $('[name=cyType]:checkbox').each(function () {
            if (this.checked) {
                str += $(this).val() + "#";
            }
        })
        return str;
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
                size: { w: 20 + 25 * 4 + 50, h: 200 },
                html: "",
                longitude: that.currentMarkerData[i].X,
                latitude: that.currentMarkerData[i].Y,
                imgSrc: "",
            });
            CDWF.MarkerArr.push(marker);
            that.createColumnChart(marker.icon.imageDiv.id);
        }
    },
    createColumnChart: function (container) {
        var that = this;
        $("#" + container).highcharts({
            chart: {
                type: 'column',
                animation: Highcharts.svg,
                borderWidth: 0,
                backgroundColor: 'transparent'
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                y: 0,
                style: {
                    display: 'none',
                }
            },
            plotOptions: {
                column: {
                    pointWidth: 11,
                }
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: [
                    'Jan'
                ],
                labels: {
                    rotation: 0,
                    style: {
                        display: 'none'
                    }
                },
                lineColor: 'grey',
                tickPosition: 'inside',
                tickLength: 0,
            },
            yAxis: {
                min: 0,
                max: 100,
                offset: 0,
                title: {
                    text: '',
                    align: "high",
                    rotation: 0,
                    offset: 0,
                    y: -20,
                    x: 10
                },
                labels: {
                    style: {
                        color: 'transparent',
                        display: 'none'
                    }
                },
                lineWidth: 0,
                showFirstLabel: false,
                showLastLabel: false,
                gridLineColor: 'transparent',
            },
            tooltip: {
                useHTML: true,
                formatter: function () {
                    return "产量" + '：</br>' + that.statisticUnit[this.series.index] + '' + this.y + '亿吨';
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Tokyo',
                data: [49.9],
                dataLabels: {  //柱上面的数字
                    enabled: true,
                    rotation: 0, //旋转
                    color: 'black',
                    align: 'center',
                    x: 0,
                    y: 3,
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif',
                    }
                }

            }, {
                name: 'New York',
                data: [83.6]

            }, {
                name: 'London',
                data: [48.9]

            }, {
                name: 'Berlin',
                data: [42.4]

            }]
        });
    },
    statisticsAnimate: function (isShow) {
        var leftPx = isShow ? "282px" : $("#Map").width() + "px";
        $("#QueryStatistic").animate({ left: leftPx });
    },
    functionClosed: function () {
        var that = this;
        CDWF.CurrentActiveFuncIndex = -1;
        CDWF.MapObj.clearEles();
        that.statisticsAnimate(false);
    }
});