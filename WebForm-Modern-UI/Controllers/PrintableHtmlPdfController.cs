using GroupDocs.Viewer.Handler;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Viewer_Modren_UI.Helpers;
using GroupDocs.Viewer.Domain;
using GroupDocs.Viewer.Domain.Options;

namespace WebForm_Modern_UI.Controllers
{

    public class PrintableHtmlPdfController : ApiController
    {

        public string Get(string file, string watermarkText, int? watermarkColor, WatermarkPosition? watermarkPosition, int? watermarkWidth, byte watermarkOpacity, bool isdownload)
        {
            ViewerHtmlHandler handler = Utils.CreateViewerHtmlHandler();

            try
            {
                PrintableHtmlOptions o = new PrintableHtmlOptions();
                if (watermarkText != "")
                    o.Watermark = Utils.GetWatermark(watermarkText, watermarkColor, watermarkPosition, watermarkWidth, watermarkOpacity);

                return handler.GetPrintableHtml(file, o).HtmlContent;
            }
            catch (Exception x)
            {
                throw x;
            }
        }
    }
}