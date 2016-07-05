using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CDWF.Business.Entities;

namespace CDWF.Business.Models
{
    /// <summary>
    /// 结果类
    /// </summary>
    public class Result
    {
    }
    /// <summary>
    /// 项目信息查询结果集合
    /// </summary>
    public class ProjectQueryRes
    {
        public string chanYeType;
        public double zhanDiMianJi = 0;
        public double congYeRenShu = 0;
        public double womenRenShu = 0;
        public double nianChanZhi = 0;
        public List<MainData> details = new List<MainData>();
    }

    public class TownsInfo
    {
        public string tCode;
        public string tName;
    }

    public class ProjectStatisticRes
    {
        public string regionName;
        public List<ProjectSType1> sType1;
        public List<ProjectSType2> sType2;
        public List<ProjectSType3> sType3;
    }

    public class ProjectSType1
    {
        public string chanYeName;
        public double zhanDiMianJi = 0;
        public double congYeRenShu = 0;
        public double womenRenShu = 0;
        public double nianChanZhi = 0;
    }

    public class ProjectSType2
    {
        //     _CyType.Add("01", "手工编织业");
        //_CyType.Add("02", "绿色种植业");
        //_CyType.Add("03", "生态养殖业");
        //_CyType.Add("04", "农副产品加工");
        //_CyType.Add("05", "生活性服务业");
        //_CyType.Add("06", "女大学生新增就业");
        public string tongJiZhiBiao;
        public double shougongbianzhi;
        public double lvsezhongzhi;
        public double shengtaiyangzhi;
        public double nongfuchanpin;
        public double shenghuo;
        public double nvdaxuesheng;
        public double fulian;
    }
    /// <summary>
    /// 妇联支持项目
    /// </summary>
    public class ProjectSType3
    {
        public string zhichiType;
        public int qiyeCount = 0;
        public double moneyCount = 0;
        public double zhanDiMianJi = 0;
        public double congYeRenShu = 0;
        public double womenRenShu = 0;
        public double nianChanZhi = 0;
    }

}
