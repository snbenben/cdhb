using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CDWF.Business;

namespace ChengDuWomenFederation.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        public ActionResult Login()
        {
            return View();
        }
        /// <summary>
        /// 验证用户
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="passWord"></param>
        /// <returns></returns>
        public JsonResult Check(string userName, string passWord)
        {
            //var user = new CDWF.Business.Models.UserInfo { UserName = userName, PassWord = passWord };
            //string validateResult;
            //if (user.Validate(out validateResult))
            //{
            //    return Json(validateResult);
            //}
            return Json("success");
        }
    }
}
