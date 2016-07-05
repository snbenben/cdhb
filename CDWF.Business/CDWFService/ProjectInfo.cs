using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using CDWF.Business.Helper;
using CDWF.Business.Models;
using CDWF.Business.SQLFactory;
using CDWF.Business.Entities;

namespace CDWF.Business.CDWFService
{
    public class ProjectInfo
    {
        private readonly SQLBusiness _sqlWorker = new SQLBusiness();

        private Dictionary<string, string> _CyType = new Dictionary<string, string>();
        private Dictionary<string, string> _FulianType = new Dictionary<string, string>();
        public ProjectInfo()
        {
            _CyType.Add("01", "手工编织业");
            _CyType.Add("02", "绿色种植业");
            _CyType.Add("03", "生态养殖业");
            _CyType.Add("04", "农副产品加工");
            _CyType.Add("05", "生活性服务业");
            _CyType.Add("06", "女大学生新增就业");
            _CyType.Add("07", "妇联扶持项目");
        }

        public List<ProjectQueryRes> QueryProjectInfoByConditions(ProjectQuery c)
        {
            List<ProjectQueryRes> res = new List<ProjectQueryRes>();
            DataTable dt = _sqlWorker.GetProInfoByConditionsFromSQL(c);
            if (dt.Rows.Count == 0)
            {
                //无结果
                return null;
            }
            foreach (string key in _CyType.Keys)
            {
                ProjectQueryRes tempPro = new ProjectQueryRes();
                tempPro.chanYeType = _CyType[key];

                foreach (DataRow dr in dt.Rows)
                {
                    if (dr["ProjectType"].ToString() != key)
                    {
                        continue;
                    }
                    MainData tempData = new MainData();
                    tempData.ProjectName = dr["ProjectName"] == null || dr["ProjectName"].ToString() == "" ? "" : dr["ProjectName"].ToString().Trim();
                    tempData.ProjectType = key;
                    tempData.ProjectPosition = dr["ProjectPosition"] == null || dr["ProjectPosition"].ToString() == "" ? "" : dr["ProjectPosition"].ToString();
                    tempData.ProjectProduct = dr["ProjectProduct"] == null || dr["ProjectProduct"].ToString() == "" ? "" : dr["ProjectProduct"].ToString();
                    tempData.PersonInCharge = dr["PersonInCharge"] == null || dr["PersonInCharge"].ToString() == "" ? "" : dr["PersonInCharge"].ToString();
                    tempData.ContactInformation = dr["ContactInformation"] == null || dr["ContactInformation"].ToString() == "" ? "" : dr["ContactInformation"].ToString();
                    tempData.AnnualOutputValue = dr["AnnualOutputValue"] == null || dr["AnnualOutputValue"].ToString() == "" ? 0 : double.Parse(dr["AnnualOutputValue"].ToString());
                    tempData.WomenEmployees = dr["WomenEmployees"] == null || dr["WomenEmployees"].ToString() == "" ? 0 : double.Parse(dr["WomenEmployees"].ToString());
                    tempData.FloorSpace = dr["FloorSpace"] == null || dr["FloorSpace"].ToString() == "" ? 0 : double.Parse(dr["FloorSpace"].ToString());
                    tempData.EmployeesNums = dr["EmployeesNums"] == null || dr["EmployeesNums"].ToString() == "" ? 0 : double.Parse(dr["EmployeesNums"].ToString());
                    tempData.X = dr["X"] == null || dr["X"].ToString() == "" ? 0 : double.Parse(dr["X"].ToString());
                    tempData.Y = dr["Y"] == null || dr["Y"].ToString() == "" ? 0 : double.Parse(dr["Y"].ToString());
                    tempData.GBCODE = dr["GBCODE"] == null || dr["GBCODE"].ToString() == "" ? "" : dr["GBCODE"].ToString();
                    tempData.SportType = dr["typeName"] == null || dr["typeName"].ToString() == "" ? "" : dr["typeName"].ToString();
                    tempData.SportMoney = dr["SportMoney"] == null || dr["SportMoney"].ToString() == "" ? 0 : double.Parse(dr["SportMoney"].ToString());
                    tempPro.nianChanZhi += (double)tempData.AnnualOutputValue;
                    tempPro.zhanDiMianJi += (double)tempData.FloorSpace;
                    tempPro.congYeRenShu += (double)tempData.EmployeesNums;
                    tempPro.womenRenShu += (double)tempData.WomenEmployees;

                    tempPro.details.Add(tempData);
                }

                if (tempPro.details.Count != 0)
                {
                    res.Add(tempPro);
                }
            }
            return res;
        }

        /// <summary>
        /// 查询乡镇信息
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public List<TownsInfo> QueryTownsInfoByCode(string code)
        {
            List<TownsInfo> res = new List<TownsInfo>();
            DataTable dt = _sqlWorker.GetTownsInfoByConditionsFromSQL(code);
            if (dt.Rows.Count == 0)
            {
                return null;
            }
            foreach (DataRow dr in dt.Rows)
            {
                TownsInfo temp = new TownsInfo();
                temp.tCode = dr["rCode"] == null || dr["rCode"].ToString() == "" ? "" : dr["rCode"].ToString().Trim();
                temp.tName = dr["rName"] == null || dr["rName"].ToString() == "" ? "" : dr["rName"].ToString().Trim();
                res.Add(temp);
            }
            return res;
        }

        public ProjectStatisticRes StatisticProjectInfoByConditions(ProjectStatistic p)
        {
            ProjectStatisticRes res = new ProjectStatisticRes();
            res.regionName = GetRegionName(p);
            switch (p.tongJiType)
            {
                case "01":
                    //单产业比较
                    res.sType1 = StatisticByType1(p);
                    break;
                case "02":
                    //产业间
                    res.sType2 = StatisticByType2(p);
                    break;
                case "03":
                    //妇联
                    res.sType3 = StatisticByType3(p);
                    break;
            }
            return res;
        }

        public string GetRegionName(ProjectStatistic p)
        {
            var condition = "";
            if (p.county != "")
            {
                condition = p.county;
            }
            else if (p.city == "51")
            {
                condition = "510000";
            }
            else
            {
                condition = p.city + "00";
            }
            return _sqlWorker.GetRegionNameByCode(condition);
        }
        /// <summary>
        /// 单产业
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public List<ProjectSType1> StatisticByType1(ProjectStatistic p)
        {
            DataTable dt = _sqlWorker.GetProStatisticInfoByConditions(p);
            List<ProjectSType1> res = new List<ProjectSType1>();
            foreach (DataRow dr in dt.Rows)
            {
                ProjectSType1 tempP = new ProjectSType1();
                tempP.chanYeName = _CyType[dr["chanye"].ToString()];
                tempP.congYeRenShu = dr["congyerenshu"] == null || dr["congyerenshu"].ToString() == "" ? 0 : double.Parse(dr["congyerenshu"].ToString());
                tempP.nianChanZhi = dr["nianchanzhi"] == null || dr["nianchanzhi"].ToString() == "" ? 0 : double.Parse(dr["nianchanzhi"].ToString());
                tempP.womenRenShu = dr["nvxing"] == null || dr["nvxing"].ToString() == "" ? 0 : double.Parse(dr["nvxing"].ToString());
                tempP.zhanDiMianJi = dr["zhandi"] == null || dr["zhandi"].ToString() == "" ? 0 : double.Parse(dr["zhandi"].ToString());
                res.Add(tempP);
            }
            return res;
        }
        /// <summary>
        /// 产业间统计
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public List<ProjectSType2> StatisticByType2(ProjectStatistic p)
        {
            DataTable dt = _sqlWorker.GetProStatisticInfoByConditions(p);
            List<ProjectSType2> res = new List<ProjectSType2>();
            var tongjizhibiao = new string[4] { "congyerenshu", "nvxing", "zhandi", "nianchanzhi" };
            var tongjizhibiaoName = new string[4] { "从业人数", "女性人数", "占地面积（㎡）", "年产值（万元）" };
            for (int i = 0; i < 4; i++)
            {
                ProjectSType2 temp = new ProjectSType2();
                temp.tongJiZhiBiao = tongjizhibiaoName[i];

                foreach (DataRow dr in dt.Rows)
                {
                    switch (dr["chanye"].ToString())
                    {
                        case "01":
                            temp.shougongbianzhi = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "02":
                            temp.lvsezhongzhi = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "03":
                            temp.shengtaiyangzhi = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "04":
                            temp.nongfuchanpin = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "05":
                            temp.shenghuo = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "06":
                            temp.nvdaxuesheng = double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                        case "07":
                            temp.fulian = dr[tongjizhibiao[i]] == null || dr[tongjizhibiao[i]].ToString() == "" ? 0 : double.Parse(dr[tongjizhibiao[i]].ToString());
                            break;
                    }
                }
                res.Add(temp);
            }
            return res;
        }
        /// <summary>
        /// 妇联支持项目统计
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public List<ProjectSType3> StatisticByType3(ProjectStatistic p)
        {
            //更新妇联支持项目词典
            DataTable dicResouce = _sqlWorker.GetFulianDic();
            foreach (DataRow r in dicResouce.Rows)
            {
                _FulianType.Add(r["typeCode"].ToString(), r["typeName"].ToString());
            }
            //取数据
            DataTable dt = _sqlWorker.GetFulianStatisticRes(p);
            List<ProjectSType3> res = new List<ProjectSType3>();
            foreach (DataRow dr in dt.Rows)
            {
                //chanye	qicounts	zijin	congyerenshu	nvxing	zhandi	nianchanzhi
                ProjectSType3 tempP = new ProjectSType3();
                tempP.zhichiType = _FulianType[dr["chanye"].ToString()];
                tempP.qiyeCount = dr["qicounts"] == null || dr["qicounts"].ToString() == "" ? 0 : int.Parse(dr["qicounts"].ToString());
                tempP.moneyCount = dr["zijin"] == null || dr["zijin"].ToString() == "" ? 0 : double.Parse(dr["zijin"].ToString());
                tempP.congYeRenShu = dr["congyerenshu"] == null || dr["congyerenshu"].ToString() == "" ? 0 : double.Parse(dr["congyerenshu"].ToString());
                tempP.nianChanZhi = dr["nianchanzhi"] == null || dr["nianchanzhi"].ToString() == "" ? 0 : double.Parse(dr["nianchanzhi"].ToString());
                tempP.womenRenShu = dr["nvxing"] == null || dr["nvxing"].ToString() == "" ? 0 : double.Parse(dr["nvxing"].ToString());
                tempP.zhanDiMianJi = dr["zhandi"] == null || dr["zhandi"].ToString() == "" ? 0 : double.Parse(dr["zhandi"].ToString());
                res.Add(tempP);
            }
            return res;
        }
    }
}
