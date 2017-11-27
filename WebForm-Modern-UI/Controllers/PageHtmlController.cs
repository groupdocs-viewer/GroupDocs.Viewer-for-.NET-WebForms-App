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

namespace WebForm_Modern_UI.Controllers
{

    public class PageHtmlController : ApiController
    {
        public HttpResponseMessage Get(string file, int page, string watermarkText, int? watermarkColor, WatermarkPosition? watermarkPosition, int? watermarkWidth, byte watermarkOpacity)
        {
            if (Utils.IsValidUrl(file))
                file = Utils.DownloadToStorage(file);
            ViewerHtmlHandler handler = Utils.CreateViewerHtmlHandler();

            List<int> pageNumberstoRender = new List<int>();
            pageNumberstoRender.Add(page);
            HtmlOptions options = new HtmlOptions();

            options.PageNumbersToRender = pageNumberstoRender;
            options.PageNumber = page;
            options.CountPagesToRender = 1;
            options.HtmlResourcePrefix = "/pageresource?file=" + file + "&page=" + page + "&resource=";
            if (watermarkText != "")
                options.Watermark = Utils.GetWatermark(watermarkText, watermarkColor, watermarkPosition, watermarkWidth, watermarkOpacity);

            List<PageHtml> list = Utils.LoadPageHtmlList(handler, file, options);
            string fullHtml = "";
            foreach (PageHtml pageHtml in list.Where(x => x.PageNumber == page)) { fullHtml = pageHtml.HtmlContent; };
            var response = new HttpResponseMessage();
            response.Content = new StringContent(fullHtml);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return response;
        }
    }
}