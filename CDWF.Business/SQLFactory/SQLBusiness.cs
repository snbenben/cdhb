using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using CDWF.Business.Helper;
using CDWF.Business.Models;

namespace CDWF.Business.SQLFactory
{
    /// <summary>
    /// SQL语句操作数据库
    /// </summary>
    public class SQLBusiness
    {
        private readonly SqlHelper _sqlHelper = new SqlHelper();
        /// <summary>
        /// 根据查询条件从数据库中获取项目信息集合
        /// </summary>
        /// <returns></returns>
        public DataTable GetProInfoByConditionsFromSQL(ProjectQuery c)
        {
            string sql = "Select * from MainData as m left join SportDic as s " +
                               "on m.SportType = s.typeCode " +
                               "where GBCODE like '" + c.gbcode + "%' ";
            //string sql = "SELECT * " +
            //              "FROM MainData " +
            //              "WHERE GBCODE like '" + c.gbcode + "%' ";
            if (c.cyType != "")
            {
                sql += "AND ProjectType = '" + c.cyType + "' ";
            }
            if (c.cyKeyWords != "")
            {
                sql += "AND ProjectProduct like '%" + c.cyKeyWords + "%' ";
            }
            if (c.nChanzhiMin != "")
            {
                sql += "AND AnnualOutputValue >= '" + c.nChanzhiMin + "' ";
            }
            if (c.nChanzhiMax != "")
            {
                sql += "AND AnnualOutputValue <= '" + c.nChanzhiMax + "' ";
            }
            if (c.renshuMin != "")
            {
                sql += "AND EmployeesNums >= '" + c.renshuMin + "' ";
            }
            if (c.renshuMax != "")
            {
                sql += "AND EmployeesNums <= '" + c.renshuMax + "' ";
            }
            if (c.womenMin != "")
            {
                sql += "AND WomenEmployees >= '" + c.womenMin + "' ";
            }
            if (c.womenMax != "")
            {
                sql += "AND WomenEmployees <= '" + c.womenMax + "' ";
            }
            return _sqlHelper.GetDataTable(sql);
        }
        /// <summary>
        /// 获取乡镇信息
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public DataTable GetTownsInfoByConditionsFromSQL(string code)
        {
            string sql = "SELECT [rCode],[rName] FROM [ChengDu].[dbo].[Town] WHERE rCode like '" + code + "_%'";
            return _sqlHelper.GetDataTable(sql);
        }

        public DataTable GetProStatisticInfoByConditions(ProjectStatistic p)
        {
            var chanyeType = p.chanYe.Substring(0, p.chanYe.Length - 1).Split('#');
            var chanyeCondition = "";
            foreach (var cha in chanyeType)
            {
                chanyeCondition += "ProjectType = '" + cha + "' or ";
            }
            chanyeCondition = chanyeCondition.Substring(0, chanyeCondition.Length - 3);
            //var citycode=p.city ==""?
            var xzqCondition = p.county == "" ? "GBCODE like '" + p.city + "%'" : "GBCODE = '" + p.county + "'";
            string sql = "";
            // sql = "SELECT 产业类别 as chanye,SUM(占地面积) as zhandi,SUM(从业人数) as congyerenshu,SUM(女性) as nvxing,SUM(年产值) as nianchanzhi " +
            //"FROM [ChengDu].[dbo].[MainData] " +
            //"where " + xzqCondition + " and " + chanyeCondition +
            //" group by 产业类别 ";
            sql = "SELECT a.ProjectType as chanye,SUM(a.FloorSpace) as zhandi,SUM(a.EmployeesNums) as congyerenshu,SUM(a.WomenEmployees) as nvxing,SUM(a.AnnualOutputValue) as nianchanzhi FROM (SELECT * FROM [ChengDu].[dbo].[MainData] where " + xzqCondition + " ) as a where " + chanyeCondition + "  group by a.ProjectType ";
            return _sqlHelper.GetDataTable(sql);
        }

        /// <summary>
        /// 更新 妇联支持项目 数据词典
        /// </summary>
        /// <returns></returns>
        public DataTable GetFulianDic()
        {
            string sql = "SELECT * FROM SportDic";
            return _sqlHelper.GetDataTable(sql);
        }

        /// <summary>
        /// 妇联项目统计结果
        /// </summary>
        /// <returns></returns>
        public DataTable GetFulianStatisticRes(ProjectStatistic p)
        {
            var xzqCondition = p.county == "" ? "GBCODE like '" + p.city + "%'" : "GBCODE = '" + p.county + "'";
            string sql = "SELECT a.SportType as chanye, " +
                              "count(a.ID) as qicounts, " +
                              "SUM(a.SportMoney) as zijin, " +
                              "SUM(a.EmployeesNums) as congyerenshu, " +
                              "SUM(a.WomenEmployees) as nvxing, " +
                              "SUM(a.FloorSpace) as zhandi, " +
                              "SUM(a.AnnualOutputValue) as nianchanzhi " +
                              "FROM (SELECT * FROM MainData where " + xzqCondition + " and ProjectType = '07' ) as a " +
                              "group by a.SportType ";
            return _sqlHelper.GetDataTable(sql);
        }

        public string GetRegionNameByCode(string code)
        {
            string sql = "SELECT NAME " +
            "FROM [ChengDu].[dbo].[RegionInfo] " +
            "where CODE = '" + code + "' ";
            return _sqlHelper.GetDataTable(sql).Rows[0]["NAME"].ToString();
        }
    }
}
