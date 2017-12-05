using GroupDocs.Viewer.Converter.Options;
using GroupDocs.Viewer.Domain;
using GroupDocs.Viewer.Domain.Image;
using GroupDocs.Viewer.Handler;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Viewer_Modren_UI.Helpers;
using GroupDocs.Viewer.Domain.Options;
using GroupDocs.Viewer.Domain.Containers;

namespace WebForm_Modern_UI.Controllers
{
    public class PageImageController : ApiController
    {
        public HttpResponseMessage Get(int? width, string file, int page, string watermarkText, int? watermarkColor, WatermarkPosition? watermarkPosition, int? watermarkWidth, byte watermarkOpacity, int? rotate, int? zoom, int? height = null)
        {
            if (Utils.IsValidUrl(file))
                file = Utils.DownloadToStorage(file);
            ViewerImageHandler handler = Utils.CreateViewerImageHandler();
            ImageOptions options = new ImageOptions();

            options.PageNumbersToRender = new List<int>(new int[] { page });
            options.PageNumber = page;
            options.CountPagesToRender = 1;

            if (watermarkText != "")
                options.Watermark = Utils.GetWatermark(watermarkText, watermarkColor, watermarkPosition, watermarkWidth, watermarkOpacity);

            if (width.HasValue)
            {
                int w = Convert.ToInt32(width);
                if (zoom.HasValue)
                    w = w + zoom.Value;
                options.Width = w;
            }

            if (height.HasValue)
            {
                if (zoom.HasValue)
                    options.Height = options.Height + zoom.Value;
            }

            if (rotate.HasValue)
            {
                if (rotate.Value > 0)
                {
                    if (width.HasValue)
                    {
                        int side = options.Width;

                        DocumentInfoContainer documentInfoContainer = handler.GetDocumentInfo(file);
                        int pageAngle = documentInfoContainer.Pages[page - 1].Angle;
                        if (pageAngle == 90 || pageAngle == 270)
                            options.Height = side;
                        else
                            options.Width = side;
                    }

                    options.Transformations = Transformation.Rotate;
                    handler.RotatePage(file, new RotatePageOptions(page, rotate.Value));
                }
            }
            else
            {
                options.Transformations = Transformation.None;
                handler.RotatePage(file, new RotatePageOptions(page, 0));
            }

            List<PageImage> list = handler.GetPages(file, options);
            PageImage pageImage = list.Single(_ => _.PageNumber == page);

            Stream stream = pageImage.Stream;
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            Image image = Image.FromStream(stream);
            MemoryStream memoryStream = new MemoryStream();
            image.Save(memoryStream, ImageFormat.Jpeg);
            result.Content = new ByteArrayContent(memoryStream.ToArray());
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            return result;
        }

    }
}