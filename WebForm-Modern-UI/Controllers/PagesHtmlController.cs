using GroupDocs.Viewer.Handler;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Viewer_Modren_UI.Helpers;
using GroupDocs.Viewer.Converter.Options;
using GroupDocs.Viewer.Domain.Html;
using System.Net.Http.Headers;
using GroupDocs.Viewer.Domain;
using System.Web.Http.Results;

namespace WebForm_Modern_UI.Controllers
{

    public class PagesHtmlController : ApiController
    {
        public JsonResult<List<string>> Get(string file, int page, string watermarkText, int? watermarkColor, WatermarkPosition? watermarkPosition, int? watermarkWidth, byte watermarkOpacity)
        {
            if (Utils.IsValidUrl(file))
                file = Utils.DownloadToStorage(file);
            ViewerHtmlHandler handler = Utils.CreateViewerHtmlHandler();

            List<int> pageNumberstoRender = new List<int>();
            pageNumberstoRender.Add(page);
            HtmlOptions options = new HtmlOptions();

            //options.PageNumbersToRender = pageNumberstoRender;
            //options.PageNumber = page;
            //options.CountPagesToRender = 1;
            //options.HtmlResourcePrefix = "/pageresource?file=" + file + "&page=" + page + "&resource=";
            options.IsResourcesEmbedded = true;
            if (watermarkText != "")
                options.Watermark = Utils.GetWatermark(watermarkText, watermarkColor, watermarkPosition, watermarkWidth, watermarkOpacity);

            List<PageHtml> list = Utils.LoadPageHtmlList(handler, file, options);
            List<string> lstPageHtml = new List<string>();
            foreach (PageHtml pageHtml in list) { lstPageHtml.Add(pageHtml.HtmlContent); };

            return Json(lstPageHtml);
        }
    }
}