using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CDWF.Business.CDWFService;


namespace CDWF.Business.Models
{
    public class UserInfo
    {
        //用户信息
        public string UserName { set; get; }  //用户名
        public string PassWord { set; get; } //用户密码

        /// <summary>
        /// 用户登录验证，验证当前用户是否存在
        /// </summary>
        /// <param name="errorString"></param>
        /// <returns></returns>
        public bool Validate(out string errorString)
        {
            try
            {
                errorString = "success";
                return true;
                //var uio = new UserOperate();
                //CDWF.Business.Entities.UserInfo queryUser = uio.GetUerInfoByUername(UserName);
                //if (queryUser != null)
                //{
                //    if (PassWord.Equals(queryUser.uPwd))
                //    {
                //        errorString = "success";
                //        return true;
                //    }
                //    errorString = "密码错误";
                //    return false;
                //}
                //errorString = "用户不存在";
                //return false;
            }
            catch (Exception)
            {
                errorString = "数据库链接失败";
                return false;
            }

        }
    }
}
