/// <reference path="../Common/jquery-1.7.1.js" />
/// <reference path="../Base/Global.js" />

$(function () {
    ip_calculateElementsStyle();
    ip_registerEvts();
    ip_initializeMap();
    //ip_initializeTownArr();
});

//首页_计算元素高宽
function ip_calculateElementsStyle() {
    $("#Map").height($("#Index").height() - 45).width($("#Index").width());
    $("#Menu").height($("#Map").height() - 2);
    $("#MenuBody").height($("#Menu").height() - 40);
    $("#MenuWait").height($("#MenuBody").height());
    $("#QueryStatisticResult").css("top", $("#Index").height() + "px");
    $("#QueryStatistic").css({
        height: ($("#Menu").height() + 2) + "px",
        width: ($("#Map").width() - 282) + "px",
        left: $("#Map").width() + "px"
    });
    $("#QueryStatisticBody").height($("#QueryStatistic").height() - 40);
    $(".QueryStatisticResType").height($("#QueryStatisticBody").height());
};
//首页_事件注册
function ip_registerEvts() {
    $(".menuControl").click(function () {
        var clickObj = $(this);
        var index = $(".menuControl").index(clickObj);
        if (CDWF.CurrentActiveFuncIndex == index) {
            if ($("#MenuShowBtn").css("display") != "none") {
                $("#MenuShowBtn").hide();
                ip_menuAnimate(true);
            }
            return;
        }
        if (CDWF.MenuObj != null) {
            CDWF.MenuObj.functionClosed();
        }
        if ($("#MenuShowBtn").css("display") != "none") {
            $("#MenuShowBtn").hide();
        }
        CDWF.CurrentActiveFuncIndex = index;
        if (index != 0 && index != 1) {
            ip_menuAnimate(true);
        } else {
            ip_menuAnimate(false);
        }
        switch (index) {
            case 0:
                //用户管理
                break;
            case 1:
                //信息管理;
                break
            case 2:
                CDWF.MenuObj = new projectStatistic();
                break;
            case 3:
                CDWF.MenuObj = new projectQuery();
                break;
            case 4:
                CDWF.MenuObj = new HPTree();
                break;
        }
    });
    //菜单隐藏
    $("#MenuHide").click(function () {
        ip_menuAnimate(false);
    });
    //菜单关闭
    $("#MenuClose").click(function () {
        //$("#Menu").hide();
        CDWF.MenuObj.functionClosed();
        ip_menuAnimate(false);
        $("#MenuBody").empty();
    });
    //菜单显示小按钮
    $("#MenuShowBtn").click(function () {
        $(this).hide();
        ip_menuAnimate(true);
    });

    $("#infoManagement").hover(function () {
        $(".management2ndFuncs").show();
        $("#management2ndMenu").stop().animate({ height: "90px" });
    }, function () {
        $("#management2ndMenu").stop().animate({ height: "0px" }, function () {
            $(".management2ndFuncs").hide();
        });
    })

    //退出系统
    $(".close").click(function () {
        location.href = baseUrl + "Login/Login";
    });
};

//首页_初始化地图
function ip_initializeMap() {
    CDWF.MapObj = new window.CDWF.Map('Map', [{ 'name': 'basicDitu', 'url': 'SCMAP' }]);
};

//首页_菜单显隐
function ip_menuAnimate(isShow) {
    var leftPx = isShow ? "0px" : "-282px";
    var topPx = isShow ? ($("#Index").height() - $("#QueryStatisticResult").height() - 2) + "px" : $("#Index").height() + "px";
    $("#Menu").animate({ left: leftPx }, function () {
        if (!isShow) {
            //$("#Menu").hide();
            if (CDWF.CurrentActiveFuncIndex == -1 || CDWF.CurrentActiveFuncIndex == 0 || CDWF.CurrentActiveFuncIndex == 1) {
                return;
            }
            $("#MenuShowBtn").show();
        } else {
            //$("#MenuShowBtn").hide();
            //$("#Menu").show();
        }

    });
    if (CDWF.isStatistics) {
        $("#QueryStatisticResult").animate({ top: topPx });
    }
}