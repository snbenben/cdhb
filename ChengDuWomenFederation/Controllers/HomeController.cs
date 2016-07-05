using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using CDWF.Business.Models;
using CDWF.Business.CDWFService;

namespace ChengDuWomenFederation.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        private readonly ProjectInfo _service = new ProjectInfo();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult QueryProInfo(string condition)
        {
            ProjectQuery pConditons = JsonConvert.DeserializeObject<ProjectQuery>(condition);
            return Json(_service.QueryProjectInfoByConditions(pConditons));
        }

        public JsonResult StatisticProInfo(string condition)
        {
            ProjectStatistic pConditions = JsonConvert.DeserializeObject<ProjectStatistic>(condition);
            return Json(_service.StatisticProjectInfoByConditions(pConditions));
        }

        public JsonResult QueryTownInfo(string countyCode)
        {
            return Json(_service.QueryTownsInfoByCode(countyCode));
        }
    }
}
