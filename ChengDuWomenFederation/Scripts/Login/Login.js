/// <reference path="../Common/jquery-1.7.1.js" />

$(function () {
    loginPageInit();
});

//页面初始化
function loginPageInit() {
    lp_EvtsRegister();
}

//login页面事件注册
function lp_EvtsRegister() {
    //输入框焦点获取及失去事件
    $(".LoginText").focus(function () {
        if ($(this).val() == "用户名" || $(this).val() == "密码") {
            $(this).val("");
            $(this).css("border", "1px solid #FF4810").css("color", "#FF4810");
        }
    }).blur(function () {
        var index = $(".LoginText").index($(this));
        if ($(this).val() == "") {
            var tempStr = index == 0 ? "用户名" : "密码";
            $(this).val(tempStr);
            $(this).css("border", "1px solid #999999").css("color", "#999999");
        }
    });
    //提交按钮
    $("#loginSubmit").click(function () {
        var uName = $("#userName").val();
        var uPwd = $("#userPwd").val();
        if (uName == "用户名" || uPwd == "密码") {
            lp_timerSettor("请输入正确的用户名密码！");
            return;
        }
        $.post(baseUrl + "Login/Check", { userName: uName, passWord: uPwd }, function (cbdata) {
            if (cbdata == "success") {
                location.href = baseUrl + "Home/Index";
            } else {
                lp_timerSettor(cbdata);
            }
        });
    });

    $(document).bind("keydown", function (e) {
        if (e.keyCode == 13) { //Enter
            $("#loginSubmit").trigger("click");
        }
    });
}

function lp_timerSettor(str) {
    $("#loginTips").text(str);
    var myTimer = setTimeout(function () { $("#loginTips").text(""); clearTimeout(myTimer); }, 3000);
}