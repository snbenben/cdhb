using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CDWF.Business.Entities;

namespace CDWF.Business.CDWFService
{
    public class UserOperate
    {
        readonly ChengDuEntities _cdEntities = new ChengDuEntities();

        //根据用户名查询用户信息
        public UserInfo GetUerInfoByUername(string userName)
        {
            var result = (from u in _cdEntities.UserInfoes
                          where u.uName == userName
                          select u).FirstOrDefault();
            return result;
        }
    }
}
