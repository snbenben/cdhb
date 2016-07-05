/// <reference path="../Common/jquery-1.7.1.js" />
/// <reference path="Global.js" />
//工具函数集合

//获取产业SELECT字符串
function util_GetChanYeType() {
    var typeArr = [["01", "手工编织业"], ["02", "绿色种植业"], ["03", "生态养殖业"], ["04", "农副产品加工"], ["05", "生活性服务业"], ["06", "女大学生新增就业"], ["07", "妇联扶持项目"]];
    var temp = '<option value="">全部</option>';
    for (var i = 0; i < typeArr.length; i++) {
        temp += '<option value="' + typeArr[i][0] + '">' + typeArr[i][1] + '</option>';
    }
    return temp;
}

function util_GetCityAll() {
    var tempHtml = '<option value="51">全部</option>';
    for (var i = 0; i < SICHUAN.length; i++) {
        if (SICHUAN[i][0].substr(4, 2) == 00) {
            tempHtml += '<option value="' + SICHUAN[i][0].substr(0, 4) + '">' + SICHUAN[i][1] + '</option>';
        }
    }
    return tempHtml;
}

function util_GetCountyByCityCode(val) {
    var cityCode = val + "00";
    var tempHtml = '<option value="">全部</option>';
    for (var i = 0; i < SICHUAN.length; i++) {
        var tempCounty = SICHUAN[i];
        if (tempCounty[0] != cityCode && tempCounty[0].substr(0, 4) == val) {
            tempHtml += '<option value="' + tempCounty[0] + '">' + tempCounty[1] + '</option>';
        }
    }
    return tempHtml;
}

function util_GetTownsByCountyCode(val) {
    var tempHtml = '<option value="">全部</option>';
    $.post(baseUrl + "Home/QueryTownInfo", { countyCode: val }, function (cbdata) {
        if (cbdata == null || cbdata.length == 0) {
            return tempHtml;
        }
        for (var i = 0; i < cbdata.length; i++) {
            tempHtml += '<option value="' + cbdata[i].tCode + '">' + cbdata[i].tName + '</option>';
        }
        return tempHtml;
    })
}

function util_GetEnviromentType() {
    var temp = '<option value="">全部</option>';
    for (var i = 0; i < EnvironmentType.length; i++) {
        temp += '<option value="' + EnvironmentType[i][0] + '">' + EnvironmentType[i][1] + '</option>';
    }
    return temp;
}