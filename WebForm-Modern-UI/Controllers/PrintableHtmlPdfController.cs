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
using GroupDocs.Viewer.Domain.Containers;

namespace WebForm_Modern_UI.Controllers
{

    public class PrintableHtmlPdfController : ApiController
    {

        public String Get(string file, string watermarkText, int? watermarkColor, WatermarkPosition? watermarkPosition, int? watermarkWidth, byte watermarkOpacity, bool isdownload)
        {
            ViewerHtmlHandler handler = Utils.CreateViewerHtmlHandler();
            handler.ClearCache(file);
            try
            {
                PrintableHtmlOptions o = new PrintableHtmlOptions();
                if (watermarkText != "")
                    o.Watermark = Utils.GetWatermark(watermarkText, watermarkColor, watermarkPosition, watermarkWidth, watermarkOpacity);

                PrintableHtmlContainer container = handler.GetPrintableHtml(file, o);
                //string filePath = Utils._storagePath + "\\" + Path.GetFileNameWithoutExtension(file) + "-Printable.html";
                //File.WriteAllText(filePath, container.HtmlContent);
                return container.HtmlContent;
            }
            catch (Exception x)
            {
                throw x;
            }
        }
    }
}